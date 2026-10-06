import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { CustomerFiltersDto, CustomerListItemDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetCustomersService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #filters$ = new Subject<CustomerFiltersDto>();
  #lastFilters: CustomerFiltersDto = { page: 1, perPage: 10 };

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);

  readonly $customers = toSignal(
    this.#filters$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((filters) => {
        // GET /customers: con `q` busca por nombre o teléfono; sin él lista todos los clientes.
        let params = new HttpParams().set('page', filters.page).set('perPage', filters.perPage);
        if (filters.q) params = params.set('q', filters.q);
        return this.#httpClient.get<StandardizedPagination<CustomerListItemDto>>(`${ApiPathEnum.RESTAURANT}/customers`, { params }).pipe(
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

  load(filters: CustomerFiltersDto) {
    this.#lastFilters = filters;
    this.#filters$.next(filters);
  }

  retry() {
    this.#filters$.next(this.#lastFilters);
  }
}
