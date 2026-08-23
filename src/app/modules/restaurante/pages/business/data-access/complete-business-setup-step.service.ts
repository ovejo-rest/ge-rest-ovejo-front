import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class CompleteBusinessSetupStepService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading = signal(false);
  readonly #error = signal<HttpStatusCode | undefined>(undefined);
  readonly #errorMessage = signal<string | undefined>(undefined);
  readonly #success = signal(false);

  readonly $isLoading = this.#isLoading.asReadonly();
  readonly $error = this.#error.asReadonly();
  readonly $errorMessage = this.#errorMessage.asReadonly();
  readonly $hasError = computed(() => this.#error() !== undefined);
  readonly $success = this.#success.asReadonly();

  execute(businessId: number, stepNumber: number, body: Record<string, unknown>) {
    this.#isLoading.set(true);
    this.#error.set(undefined);
    this.#errorMessage.set(undefined);
    this.#success.set(false);

    this.#httpClient
      .post(`${ApiPathEnum.RESTAURANT}/business/${businessId}/setup/steps/${stepNumber}`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#error.set(error.status);
          this.#errorMessage.set(error.error?.message);
          this.#isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.#success.set(true);
        this.#isLoading.set(false);
      });
  }

  reset() {
    this.#isLoading.set(false);
    this.#error.set(undefined);
    this.#errorMessage.set(undefined);
    this.#success.set(false);
  }
}
