import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { PaymentDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllPaymentsService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #fetch$ = new BehaviorSubject<{
    transactionId?: number;
    method?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $payments = toSignal(
    this.#fetch$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((filters) => {
        let httpParams = new HttpParams();
        if (filters.transactionId) httpParams = httpParams.set('transactionId', filters.transactionId.toString());
        if (filters.method) httpParams = httpParams.set('method', filters.method);
        if (filters.startDate) httpParams = httpParams.set('startDate', filters.startDate);
        if (filters.endDate) httpParams = httpParams.set('endDate', filters.endDate);

        return this.#httpClient
          .get<PaymentDto[]>(`${ApiPathEnum.RESTAURANT}/payments/all`, { params: httpParams })
          .pipe(
            tap(() => this.#isLoading$.next(false)),
            catchError((error: HttpErrorResponse) => {
              this.#error$.next(error.status);
              this.#isLoading$.next(false);
              return EMPTY;
            }),
          );
      }),
    ),
  );

  retry(filters?: { transactionId?: number; method?: string; startDate?: string; endDate?: string }) {
    this.#fetch$.next(filters ?? {});
  }
}
