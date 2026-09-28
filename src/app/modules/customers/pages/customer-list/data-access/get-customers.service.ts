import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { CustomerFiltersDto, CustomerListItemDto } from './dtos';

type ContactItem = Readonly<{ id: number; name: string | null; firstName: string | null; lastName: string | null; mobile: string; email: string | null }>;

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
        const params = new HttpParams().set('page', filters.page).set('perPage', filters.perPage);
        // GET /customers exige texto de búsqueda; sin búsqueda se listan los contactos tipo cliente.
        const request = filters.q
          ? this.#httpClient.get<StandardizedPagination<CustomerListItemDto>>(`${ApiPathEnum.RESTAURANT}/customers`, {
              params: params.set('q', filters.q),
            })
          : this.#httpClient
              .get<StandardizedPagination<ContactItem>>(`${ApiPathEnum.RESTAURANT}/contacts`, {
                params: params.set('type', 'customer'),
              })
              .pipe(
                map(({ data, pagination }) => ({
                  pagination,
                  data: data.map((contact) => ({
                    id: contact.id,
                    name: contact.name ?? ([contact.firstName, contact.lastName].filter(Boolean).join(' ') || '—'),
                    mobile: contact.mobile,
                    email: contact.email,
                  })),
                })),
              );
        return request.pipe(
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
