import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap, tap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { CustomerDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class SearchCustomersService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #query$ = new Subject<string>();

  readonly $isLoading = toSignal(this.#isLoading$);

  readonly $customers = toSignal(
    this.#query$.pipe(
      map((query) => query.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (query.length < 2) return of<CustomerDto[]>([]);
        this.#isLoading$.next(true);
        const params = new HttpParams().set('q', query).set('page', 1).set('perPage', 8);
        return this.#httpClient
          .get<StandardizedPagination<CustomerDto>>(`${ApiPathEnum.RESTAURANT}/customers`, { params })
          .pipe(
            map(({ data }) => data),
            catchError(() => of<CustomerDto[]>([])),
          );
      }),
      tap(() => this.#isLoading$.next(false)),
    ),
    { initialValue: [] as CustomerDto[] },
  );

  search(query: string) {
    this.#query$.next(query);
  }
}
