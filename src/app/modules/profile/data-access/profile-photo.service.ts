import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FileUploadService } from 'src/app/core/services/file-upload';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';
import { GetProfileService } from './get-profile.service';
import { ProfileActionsService } from './profile-actions.service';

/**
 * Cambiar o quitar la foto de perfil (sirve aunque el usuario aún no tenga negocio).
 * Actualiza al instante el perfil y el header, sin recargar.
 */
@Injectable({ providedIn: 'root' })
export class ProfilePhotoService {
  readonly #upload = inject(FileUploadService);
  readonly #actions = inject(ProfileActionsService);
  readonly #whoami = inject(WhoamiService);
  readonly #profile = inject(GetProfileService);

  readonly #isSaving = signal(false);
  readonly $isSaving = this.#isSaving.asReadonly();
  readonly $isUploading = this.#upload.$isUploading;
  readonly $progress = this.#upload.$progress;

  /** file: nueva foto; null: quitarla. Lanza el error para que la pantalla lo muestre. */
  async set(file: File | null): Promise<string | null> {
    this.#isSaving.set(true);
    try {
      const fileId = file ? (await this.#upload.uploadImage(file, 'profile_images')).fileId : null;
      const { profileImageUrl } = await firstValueFrom(this.#actions.setProfileImage(fileId));
      this.#whoami.patchUser({ profileImageUrl });
      this.#profile.patch({ profileImageUrl });
      return profileImageUrl;
    } finally {
      this.#isSaving.set(false);
    }
  }
}
