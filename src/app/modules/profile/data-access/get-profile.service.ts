import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiPathEnum } from 'src/environments';
import { GetProfileDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetProfileService {
  readonly #httpClient = inject(HttpClient);

  #userId: string | null = null;
  readonly #profile = signal<GetProfileDto | undefined>(undefined);
  readonly #isLoading = signal(false);
  readonly #error = signal<HttpStatusCode | undefined>(undefined);

  readonly $profile = this.#profile.asReadonly();
  readonly $isLoading = this.#isLoading.asReadonly();
  readonly $error = this.#error.asReadonly();
  readonly $hasError = computed(() => this.#error() !== undefined);

  loadProfile(userId: string) {
    // Otro usuario: no mostrar el perfil anterior.
    if (userId !== this.#userId) this.#profile.set(undefined);
    this.#userId = userId;
    this.reload();
  }

  reload() {
    if (!this.#userId) return;
    this.#isLoading.set(true);
    this.#error.set(undefined);
    this.#httpClient.get<GetProfileDto>(`${ApiPathEnum.AUTH}/profile/${this.#userId}/user`).subscribe({
      next: (profile) => {
        this.#profile.set(profile);
        this.#isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.#error.set(error.status);
        this.#isLoading.set(false);
      },
    });
  }

  /** Refleja un cambio propio sin volver a pedir el perfil. */
  patch(changes: Partial<GetProfileDto>) {
    const current = this.#profile();
    if (current) this.#profile.set({ ...current, ...changes });
  }
}
