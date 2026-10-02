import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { getUploadErrorMessage, IMAGE_ACCEPT, throttledRefresh, validateImage } from 'src/app/core/services/file-upload';
import { ClickOutsideDirective, IconComponent, ImageThumbComponent, ToastService } from 'src/ui';
import { GetProfileDto, GetProfileService, ProfilePhotoService } from '../../data-access';

export type ProfileBusiness = Readonly<{ name: string; logoUrl?: string | null }>;

/** Tarjeta principal: foto (cambiar/quitar), nombre, rol, negocio y antigüedad. */
@Component({
  selector: 'app-profile-hero-card',
  imports: [IconComponent, ImageThumbComponent, ClickOutsideDirective],
  templateUrl: './profile-hero-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeroCardComponent {
  readonly #toast = inject(ToastService);
  readonly #photo = inject(ProfilePhotoService);
  readonly #profileService = inject(GetProfileService);

  readonly profile = input.required<GetProfileDto>();
  readonly roles = input<ReadonlyArray<{ code: string; name: string }>>([]);
  readonly business = input<ProfileBusiness | null>(null);

  protected readonly accept = IMAGE_ACCEPT;
  protected readonly $menuOpen = signal(false);
  protected readonly $isSaving = this.#photo.$isSaving;
  protected readonly $progress = this.#photo.$progress;
  protected readonly $isUploading = this.#photo.$isUploading;
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly $fullName = computed(() => {
    const p = this.profile();
    return [p.name, p.fatherLastName, p.motherLastName].filter(Boolean).join(' ');
  });
  protected readonly $avatarName = computed(() => [this.profile().name, this.profile().fatherLastName].filter(Boolean).join(' '));
  protected readonly $memberSince = computed(() => {
    const createdAt = this.profile().createdAt;
    if (!createdAt) return null;
    return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date(createdAt));
  });

  // La URL de la foto vence en 1 hora: se vuelve a pedir el perfil.
  protected readonly refreshExpired = throttledRefresh(() => this.#profileService.reload());

  protected toggleMenu() {
    this.$menuOpen.update((open) => !open);
  }

  protected chooseFile() {
    this.$menuOpen.set(false);
    this.fileInput().nativeElement.click();
  }

  protected async onFile(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;
    const invalid = validateImage(file, 'profile_images');
    if (invalid) return this.#toast.show(invalid, 'error');
    await this.#save(file, 'Foto actualizada');
  }

  protected async removePhoto() {
    this.$menuOpen.set(false);
    await this.#save(null, 'Foto eliminada');
  }

  async #save(file: File | null, successMessage: string) {
    try {
      await this.#photo.set(file);
      this.#toast.show(successMessage, 'success');
    } catch (error) {
      this.#toast.show(getUploadErrorMessage(error), 'error');
    }
  }
}
