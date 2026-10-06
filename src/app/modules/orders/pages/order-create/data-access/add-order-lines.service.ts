import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, tap } from 'rxjs';
import { ApiError, readApiError } from 'src/app/core/utils';
import { ApiPathEnum } from 'src/environments';
import { AddOrderLinesDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class AddOrderLinesService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<ApiError | undefined>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $success = toSignal(this.#success$);

  // Las notas van en cada producto: se imprimen en la comanda de su estación.
  add({ orderId, products }: AddOrderLinesDto) {
    this.#isLoading$.next(true);
    this.#error$.next(undefined);

    this.#httpClient
      .post(`${ApiPathEnum.RESTAURANT}/orders/${orderId}/lines`, { products })
      .pipe(
        tap(() => this.#isLoading$.next(false)),
        catchError((error: unknown) => {
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
