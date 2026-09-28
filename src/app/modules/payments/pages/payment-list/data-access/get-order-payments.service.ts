import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { PaymentDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetOrderPaymentsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #transactionId$ = new Subject<number>();
  #lastTransactionId: number | null = null;

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);

  // Incluye los pagos anulados: se muestran para la auditoría de caja.
  readonly $payments = toSignal(
    this.#transactionId$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((transactionId) =>
        this.#httpClient
          .get<PaymentDto[]>(`${ApiPathEnum.RESTAURANT}/payments`, {
            params: new HttpParams().set('transactionId', transactionId),
          })
          .pipe(
            map((payments) => ({ transactionId, payments })),
            tap(() => this.#isLoading$.next(false)),
            catchError((error: HttpErrorResponse) => {
              this.#error$.next(error.status);
              this.#isLoading$.next(false);
              return EMPTY;
            }),
          ),
      ),
    ),
  );

  load(transactionId: number) {
    this.#lastTransactionId = transactionId;
    this.#transactionId$.next(transactionId);
  }

  retry() {
    if (this.#lastTransactionId !== null) this.#transactionId$.next(this.#lastTransactionId);
  }
}
