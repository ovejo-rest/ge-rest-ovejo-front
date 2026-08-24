import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { OrderDto } from './dtos';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllOrdersService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #params$ = new BehaviorSubject<{ page: number; perPage: number; status?: string; tableName?: string }>({ page: 1, perPage: 10 });

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $hasError = toSignal(this.#error$.pipe(map((c) => c !== undefined)));

  setParams(p: Partial<{ page: number; perPage: number; status?: string; tableName?: string }>) {
    this.#params$.next({ ...this.#params$.getValue(), ...p });
  }

  readonly $orders = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((params) => {
        let hp = new HttpParams().set('page', params.page).set('perPage', params.perPage);
        if (params.status) hp = hp.set('status', params.status);
        if (params.tableName?.trim()) hp = hp.set('tableName', params.tableName.trim());
        return this.#httpClient.get<StandardizedPagination<OrderDto>>(`${ApiPathEnum.RESTAURANT}/orders`, { params: hp }).pipe(
          catchError((e: HttpErrorResponse) => { this.#error$.next(e.status); this.#isLoading$.next(false); return EMPTY; }),
          tap(() => this.#isLoading$.next(false)),
        );
      }),
    ),
  );

  retry() { this.#params$.next({ ...this.#params$.getValue() }); }
}
