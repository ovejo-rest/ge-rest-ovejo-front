import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal, untracked } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent, IconComponent, ImagePickerComponent, ToastService, RedomLogoComponent } from 'src/ui';
import { FileUploadService, getUploadErrorMessage, ImageSelection } from 'src/app/core/services/file-upload';
import { ProfilePhotoService } from 'src/app/modules/profile/data-access';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import {
  CreateBusinessService,
  FindAllCurrenciesService,
  UpdateBusinessLogoService,
} from 'src/app/modules/restaurante/pages/business/data-access';
import { TIME_ZONES } from './time-zones';

type OnboardingStep = 'business' | 'photo' | 'done';

/** Onboarding: el dueño recién registrado crea su negocio (queda como OWNER) y pasa a usar el sistema. */
@Component({
  selector: 'app-create-business',
  templateUrl: './create-business.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RedomLogoComponent, ReactiveFormsModule, ButtonComponent, IconComponent, ImagePickerComponent],
})
export class CreateBusinessComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly whoami = inject(WhoamiService);
  private readonly authService = inject(AuthService);
  private readonly createService = inject(CreateBusinessService);
  private readonly currenciesService = inject(FindAllCurrenciesService);

  readonly timeZones = TIME_ZONES;
  readonly $step = signal<OnboardingStep>('business');
  readonly $currencies = computed(() => this.currenciesService.$currencies() ?? []);
  private readonly upload = inject(FileUploadService);
  private readonly logoService = inject(UpdateBusinessLogoService);
  private readonly photoService = inject(ProfilePhotoService);

  readonly $isUploading = this.upload.$isUploading;
  readonly $uploadProgress = this.upload.$progress;
  readonly #isFinishing = signal(false);
  // Creando el negocio o subiendo el logo.
  readonly $isSaving = computed(() => (this.createService.$isLoading() ?? false) || this.#isFinishing());
  #logo: ImageSelection = { kind: 'keep' };

  // Paso opcional "Agrega tu foto".
  readonly $photoFile = signal<File | null>(null);
  readonly $isSavingPhoto = this.photoService.$isSaving;
  readonly $firstName = computed(() => this.whoami.$whoami()?.user.name?.split(' ')[0] ?? '');
  readonly $businessName = signal('');
  submitted = false;

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    currencyId: [0, [Validators.min(1)]],
    timeZone: ['America/Santiago'],
  });

  constructor() {
    // Moneda por defecto: peso chileno si existe.
    effect(() => {
      const currencies = this.$currencies();
      if (!currencies.length || this.form.controls.currencyId.value) return;
      const clp = currencies.find((currency) => currency.code === 'CLP') ?? currencies[0];
      untracked(() => this.form.controls.currencyId.setValue(clp.id));
    });

    // Negocio creado: whoami ya trae el restaurantId (no se confía en el del JWT).
    effect(() => {
      if (!this.createService.$success()) return;
      untracked(() => {
        this.createService.reset();
        this.finishBusiness();
      });
    });

    effect(() => {
      const status = this.createService.$error();
      if (!status) return;
      untracked(() => this.handleError(status));
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show(this.form.controls.name.invalid ? 'Ingresa el nombre de tu negocio' : 'Elige la moneda', 'warning');
      return;
    }
    const { name, currencyId, timeZone } = this.form.getRawValue();
    this.$businessName.set(name.trim());
    this.createService.create({ name: name.trim(), currencyId, timeZone });
  }

  onLogoChange(selection: ImageSelection) {
    this.#logo = selection;
  }

  onPhotoChange(selection: ImageSelection) {
    this.$photoFile.set(selection.kind === 'set' ? selection.file : null);
  }

  async savePhoto() {
    const file = this.$photoFile();
    if (!file) return this.$step.set('done');
    try {
      await this.photoService.set(file);
      this.toast.show('¡Listo! Ya tienes foto de perfil', 'success');
      this.$step.set('done');
    } catch (error) {
      this.toast.show(getUploadErrorMessage(error), 'error');
    }
  }

  skipPhoto() {
    this.$step.set('done');
  }

  /**
   * Negocio creado: whoami trae el restaurantId (no se confía en el del JWT) y recién ahí se sube el logo.
   * Si el logo falla, el negocio ya existe: se avisa y el onboarding sigue.
   */
  private async finishBusiness() {
    this.#isFinishing.set(true);
    const whoami = await firstValueFrom(this.whoami.load());
    const restaurantId = whoami?.user.restaurantId;
    if (this.#logo.kind === 'set' && restaurantId) {
      try {
        const { fileId } = await this.upload.uploadImage(this.#logo.file, 'business_logos');
        await firstValueFrom(this.logoService.update(restaurantId, fileId));
      } catch {
        this.toast.show('No se pudo subir el logo, puedes intentarlo desde Configuración', 'warning');
      }
    }
    this.#isFinishing.set(false);
    this.$step.set(whoami?.user.profileImageUrl ? 'done' : 'photo');
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.authService.logout().subscribe({ error: () => undefined });
    this.whoami.forget();
    this.router.navigateByUrl('/auth/sign-in');
  }

  ngOnDestroy(): void {
    this.createService.reset();
  }

  private handleError(status: number) {
    // 409: el usuario ya tiene o ya pertenece a un negocio → se revisa whoami y se entra a la app.
    if (status === HttpStatusCode.Conflict) {
      this.whoami.load().subscribe((whoami) => {
        if (whoami?.user.restaurantId) {
          this.toast.show('Tu cuenta ya tiene un negocio. Te llevamos al panel.', 'warning');
          this.router.navigateByUrl('/dashboard/admin');
        } else this.toast.show('Tu cuenta ya pertenece a un negocio.', 'error');
      });
      return;
    }
    this.toast.show(status === 0 ? 'No hay conexión con el servidor.' : 'No se pudo crear el negocio. Intenta nuevamente.', 'error');
  }
}
