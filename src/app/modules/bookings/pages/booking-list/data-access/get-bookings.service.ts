import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { BookingDto, BookingFiltersDto } from './dtos';

// Máximo por página del backend; alcanza para una semana de reservas de un local.
const PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class GetBookingsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #filters$ = new Subject<BookingFiltersDto>();
  #lastFilters: BookingFiltersDto | null = null;

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);

  // Reservas del rango, ordenadas por hora de inicio (el backend las entrega de la más nueva a la más antigua).
  readonly $bookings = toSignal(
    this.#filters$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((filters) => {
        let params = new HttpParams()
          .set('page', 1)
          .set('perPage', PAGE_SIZE)
          .set('startDate', filters.startDate)
          .set('endDate', filters.endDate);
        if (filters.locationId) params = params.set('locationId', filters.locationId);
        if (filters.status) params = params.set('status', filters.status);

        return this.#httpClient
          .get<StandardizedPagination<BookingDto>>(`${ApiPathEnum.RESTAURANT}/bookings`, { params })
          .pipe(
            map(({ data }) => [...data].sort((a, b) => a.start.localeCompare(b.start))),
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

  load(filters: BookingFiltersDto) {
    this.#lastFilters = filters;
    this.#filters$.next(filters);
  }

  retry() {
    if (this.#lastFilters) this.#filters$.next(this.#lastFilters);
  }
}
