import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ModulePermissionsDto, GetAllPermissionsDto } from './dtos';
import { ApiPathEnum } from 'src/environments';
import { catchError, delay, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetAllPermissionsService {
  readonly #httpClient = inject(HttpClient);

  readonly #rawModules = signal<ModulePermissionsDto[]>([]);
  readonly #isLoading = signal(false);
  readonly #error = signal<HttpStatusCode | undefined>(undefined);
  readonly #searchCode = signal('');
  readonly #searchName = signal('');

  readonly $isLoading = this.#isLoading.asReadonly();
  readonly $error = this.#error.asReadonly();
  readonly $hasError = computed(() => this.#error() !== undefined);

  readonly $filteredModules = computed(() => {
    const searchCode = this.#searchCode().toLowerCase();
    const searchName = this.#searchName().toLowerCase();

    if (!searchCode && !searchName) {
      return this.#rawModules();
    }

    return this.#rawModules()
      .map((module) => ({
        ...module,
        permissions: module.permissions.filter((p) => {
          const matchesCode = !searchCode || p.code.toLowerCase().includes(searchCode);
          const matchesName = !searchName || p.name.toLowerCase().includes(searchName);
          return matchesCode && matchesName;
        }),
      }))
      .filter((module) => module.permissions.length > 0);
  });

  readonly $allPermissionsCount = computed(() =>
    this.#rawModules().reduce((acc, m) => acc + m.permissions.length, 0),
  );

  setParams(params: Partial<{ searchCode?: string; searchName?: string }>) {
    if (params.searchCode !== undefined) this.#searchCode.set(params.searchCode);
    if (params.searchName !== undefined) this.#searchName.set(params.searchName);
  }

  constructor() {
    this.fetchPermissions();
  }

  private fetchPermissions() {
    this.#isLoading.set(true);
    this.#error.set(undefined);

    this.#httpClient
      .get<ModulePermissionsDto[]>(`${ApiPathEnum.AUTH}/roles-and-permissions/permissions`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#error.set(error.status);
          this.#isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe((modules) => {
        this.#rawModules.set(modules);
        this.#isLoading.set(false);
      });
  }

  retry() {
    this.#rawModules.set([]);
    this.fetchPermissions();
  }
}
