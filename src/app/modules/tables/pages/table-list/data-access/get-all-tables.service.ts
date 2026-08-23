import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { TableDto } from './dtos';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllTablesService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #params$ = new BehaviorSubject<{ page: number; perPage: number; name?: string; sectorId?: number; status?: string }>({ page: 1, perPage: 10 });

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  setParams(params: Partial<{ page: number; perPage: number; name?: string; sectorId?: number; status?: string }>) {
    this.#params$.next({ ...this.#params$.getValue(), ...params });
  }

  readonly $tables = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((params) => {
        let hp = new HttpParams().set('page', params.page).set('perPage', params.perPage);
        if (params.name?.trim()) hp = hp.set('name', params.name.trim());
        if (params.sectorId !== undefined) hp = hp.set('sectorId', params.sectorId);
        if (params.status) hp = hp.set('status', params.status);
        return this.#httpClient.get<StandardizedPagination<TableDto>>(`${ApiPathEnum.RESTAURANT}/tables`, { params: hp }).pipe(
          catchError((e: HttpErrorResponse) => { this.#error$.next(e.status); this.#isLoading$.next(false); return EMPTY; }),
          tap(() => this.#isLoading$.next(false)),
        );
      }),
    ),
  );

  retry() { this.#params$.next({ ...this.#params$.getValue() }); }
}
