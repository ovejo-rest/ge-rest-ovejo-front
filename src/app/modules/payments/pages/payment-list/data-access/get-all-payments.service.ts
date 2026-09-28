import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { PaymentDto, PaymentFiltersDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetAllPaymentsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #params$ = new Subject<PaymentFiltersDto>();
  #lastParams: PaymentFiltersDto = { page: 1, perPage: 10 };

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);

  readonly $payments = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((filters) => {
        let params = new HttpParams().set('page', filters.page).set('perPage', filters.perPage);
        if (filters.method) params = params.set('method', filters.method);
        if (filters.startDate) params = params.set('startDate', filters.startDate);
        if (filters.endDate) params = params.set('endDate', filters.endDate);
        if (filters.includeCancelled) params = params.set('includeCancelled', true);

        return this.#httpClient
          .get<StandardizedPagination<PaymentDto>>(`${ApiPathEnum.RESTAURANT}/payments/all`, { params })
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

  load(filters: PaymentFiltersDto) {
    this.#lastParams = filters;
    this.#params$.next(filters);
  }

  retry() {
    this.#params$.next(this.#lastParams);
  }
}
