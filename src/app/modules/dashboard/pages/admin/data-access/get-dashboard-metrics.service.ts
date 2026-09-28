import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { DashboardFiltersDto, DashboardMetricsDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetDashboardMetricsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #filters$ = new Subject<DashboardFiltersDto>();
  #lastFilters: DashboardFiltersDto | null = null;

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);

  readonly $metrics = toSignal(
    this.#filters$.pipe(
      tap(() => this.#isLoading$.next(true)),
      switchMap((filters) => {
        let params = new HttpParams().set('dateFrom', filters.dateFrom).set('dateTo', filters.dateTo);
        if (filters.locationId) params = params.set('locationId', filters.locationId);
        return this.#httpClient.get<DashboardMetricsDto>(`${ApiPathEnum.RESTAURANT}/dashboard`, { params }).pipe(
          tap(() => {
            this.#isLoading$.next(false);
            this.#error$.next(undefined);
          }),
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
        );
      }),
    ),
  );

  load(filters: DashboardFiltersDto) {
    this.#lastFilters = filters;
    this.#filters$.next(filters);
  }

  retry() {
    if (this.#lastFilters) this.#filters$.next(this.#lastFilters);
  }
}
