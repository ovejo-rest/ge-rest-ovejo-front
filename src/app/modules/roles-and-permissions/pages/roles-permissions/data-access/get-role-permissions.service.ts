import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { PermissionDto } from '../../permissions/data-access';

@Injectable({ providedIn: 'root' })
export class GetRolePermissionsService {
  readonly #httpClient = inject(HttpClient);

  readonly #rolePermissions = signal<PermissionDto[]>([]);
  readonly #isLoading = signal(false);
  readonly #error = signal<HttpStatusCode | undefined>(undefined);

  readonly $isLoading = this.#isLoading.asReadonly();
  readonly $error = this.#error.asReadonly();
  readonly $hasError = computed(() => this.#error() !== undefined);

  readonly $rolePermissionIds = computed(() => new Set(this.#rolePermissions().map((p) => p.id)));
  readonly $rolePermissionsCount = computed(() => this.#rolePermissions().length);

  setRoleId(roleId: number) {
    if (!roleId) {
      this.#rolePermissions.set([]);
      return;
    }
    this.fetchRolePermissions(roleId);
  }

  retry(roleId: number) {
    this.#rolePermissions.set([]);
    this.fetchRolePermissions(roleId);
  }

  private fetchRolePermissions(roleId: number) {
    this.#isLoading.set(true);
    this.#error.set(undefined);

    this.#httpClient
      .get<PermissionDto[]>(`${ApiPathEnum.AUTH}/roles-and-permissions/roles/${roleId}/permissions`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#error.set(error.status);
          this.#isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe((permissions) => {
        this.#rolePermissions.set(permissions);
        this.#isLoading.set(false);
      });
  }
}
