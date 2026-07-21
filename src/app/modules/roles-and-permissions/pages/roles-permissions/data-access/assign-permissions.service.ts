import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { AssignPermissionsDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class AssignPermissionsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading = signal(false);
  readonly #error = signal<HttpStatusCode | undefined>(undefined);
  readonly #success = signal(false);

  readonly $isLoading = this.#isLoading.asReadonly();
  readonly $error = this.#error.asReadonly();
  readonly $hasError = computed(() => this.#error() !== undefined);
  readonly $success = this.#success.asReadonly();

  execute(roleId: number, permissionIds: number[]) {
    this.#isLoading.set(true);
    this.#error.set(undefined);
    this.#success.set(false);

    this.#httpClient
      .post<void>(`${ApiPathEnum.AUTH}/roles-and-permissions/roles/${roleId}/permissions`, {
        permissionIds,
      } satisfies AssignPermissionsDto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#error.set(error.status);
          this.#isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.#success.set(true);
        this.#isLoading.set(false);
      });
  }
}
