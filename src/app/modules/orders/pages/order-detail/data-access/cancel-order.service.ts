import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, tap } from 'rxjs';
import { ApiError, readApiError } from 'src/app/core/utils';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class CancelOrderService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<ApiError | undefined>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((error) => error !== undefined)));
  readonly $success = toSignal(this.#success$);

  cancel(id: number) {
    this.#isLoading$.next(true);
    this.#error$.next(undefined);

    this.#httpClient
      .patch(`${ApiPathEnum.RESTAURANT}/orders/${id}/cancel`, {})
      .pipe(
        tap(() => this.#isLoading$.next(false)),
        catchError((error: unknown) => {
          // Se conserva el código de negocio (ORDER_HAS_PAYMENTS, TABLE_BLOCKED…) para el mensaje.
          this.#error$.next(readApiError(error));
          this.#isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe(() => this.#success$.next(true));
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
