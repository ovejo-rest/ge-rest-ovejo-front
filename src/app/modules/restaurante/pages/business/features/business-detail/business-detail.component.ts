import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { THEME_COLORS, ThemeColorName } from 'src/app/core/constants/theme-colors';
import { BrandColorService } from 'src/app/core/services/brand-color';
import { ThemeService } from 'src/app/core/services/theme.service';
import {
  FileUploadService,
  getUploadErrorMessage,
  ImageSelection,
  throttledRefresh,
} from 'src/app/core/services/file-upload';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  ButtonComponent,
  CardComponent,
  IconComponent,
  ImagePickerComponent,
  ImageThumbComponent,
  SlotDirective,
  ToastService,
  ToggleComponent,
} from 'src/ui';
import { ActivateBusinessService, BusinessDto, FindMyBusinessesService, UpdateBusinessLogoService } from '../../data-access';
import { SetupBusinessModalComponent } from '../setup-business-modal';

@Component({
  selector: 'app-business-detail',
  imports: [
    DatePipe,
    CardComponent,
    SlotDirective,
    ButtonComponent,
    IconComponent,
    ToggleComponent,
    ImagePickerComponent,
    ImageThumbComponent,
  ],
  templateUrl: './business-detail.component.html',
})
export class BusinessDetailComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly $toast = inject(ToastService);
  protected readonly $activateBusinessService = inject(ActivateBusinessService);
  protected readonly $findMyBusinessesService = inject(FindMyBusinessesService);

  readonly business = input.required<BusinessDto>();

  readonly #upload = inject(FileUploadService);
  readonly #logoService = inject(UpdateBusinessLogoService);
  protected readonly $isUploading = this.#upload.$isUploading;
  protected readonly $uploadProgress = this.#upload.$progress;
  protected readonly $logoSelection = signal<ImageSelection>({ kind: 'keep' });
  protected readonly $isSavingLogo = signal(false);
  // Remonta el selector para descartar la vista previa tras guardar.
  protected readonly $pickerKey = signal(0);
  // La URL del logo vence en 1 hora: se vuelve a pedir el negocio.
  protected readonly refreshExpiredLogo = throttledRefresh(() => this.$findMyBusinessesService.retry());

  constructor() {
    effect(() => {
      if (this.$activateBusinessService.$isLoading()) {
        this.$toast.show('Activando negocio...', 'warning');
      }
      if (this.$activateBusinessService.$success()) {
        this.$toast.show('Negocio activado con éxito', 'success');
        this.$findMyBusinessesService.retry();
      }
      if (this.$activateBusinessService.$hasError()) {
        this.$toast.show('Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  onToggleChange(checked: boolean) {
    if (checked) {
      this.$activateBusinessService.execute({ id: this.business().id });
      return;
    }
    this.$toast.show('La desactivación del negocio está en construcción', 'warning');
  }

  openSetupModal() {
    const b = this.business();
    this.dialog.open(SetupBusinessModalComponent, {
      width: '90%',
      maxWidth: '640px',
      data: { businessId: b.id, businessName: b.name },
    });
  }

  async saveLogo() {
    const selection = this.$logoSelection();
    if (selection.kind === 'keep') return;
    this.$isSavingLogo.set(true);
    try {
      const logoFileId = (await this.#upload.resolveSelection(selection, 'business_logos')) ?? null;
      await firstValueFrom(this.#logoService.update(this.business().id, logoFileId));
      this.$toast.show(logoFileId ? 'Logo actualizado' : 'Logo eliminado', 'success');
      this.discardLogo();
      this.$findMyBusinessesService.retry();
    } catch (error) {
      this.$toast.show(getUploadErrorMessage(error), 'error');
    } finally {
      this.$isSavingLogo.set(false);
    }
  }

  discardLogo() {
    this.$logoSelection.set({ kind: 'keep' });
    this.$pickerKey.update((key) => key + 1);
  }

  // Color de marca: lo ven todos los usuarios del restaurante.
  readonly #brandColor = inject(BrandColorService);
  protected readonly themeColors = THEME_COLORS;
  readonly #themeService = inject(ThemeService);
  protected readonly $currentColor = computed(() => this.#themeService.theme().color);
  protected readonly $savingColor = signal<ThemeColorName | null>(null);

  selectColor(color: ThemeColorName) {
    if (color === this.$currentColor() || this.$savingColor()) return;
    this.$savingColor.set(color);
    this.#brandColor.save(this.business().id, color).subscribe({
      next: () => {
        this.$savingColor.set(null);
        this.$toast.show('Color del restaurante actualizado', 'success');
      },
      error: () => {
        this.$savingColor.set(null);
        this.$toast.show('No se pudo guardar el color. Inténtalo de nuevo.', 'error');
      },
    });
  }

  navigateToLocations() {
    this.router.navigate(['/business/location']);
  }
}
