import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { OrderFiltersDto, OrderSummaryDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetAllOrdersService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #params$ = new Subject<OrderFiltersDto>();
  #lastParams: OrderFiltersDto = { page: 1, perPage: 10 };

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $orders = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((params) => {
        // Solo se envían los filtros con valor; el backend ignora los ausentes.
        let httpParams = new HttpParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null && value !== '') httpParams = httpParams.set(key, value);
        }

        return this.#httpClient
          .get<StandardizedPagination<OrderSummaryDto>>(`${ApiPathEnum.RESTAURANT}/orders`, { params: httpParams })
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

  load(params: OrderFiltersDto) {
    this.#lastParams = params;
    this.#params$.next(params);
  }

  retry() {
    this.#params$.next(this.#lastParams);
  }
}
