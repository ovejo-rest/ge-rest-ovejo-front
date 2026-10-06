import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, catchError, EMPTY, map, switchMap, tap } from 'rxjs';

import { TableDto } from './dtos';

import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllTablesService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);

  readonly #error$ = new BehaviorSubject<HttpStatusCode | undefined>(undefined);

  readonly #locationId$ = new BehaviorSubject<number | null>(null);

  readonly $isLoading = toSignal(this.#isLoading$, {
    initialValue: false,
  });

  readonly $error = toSignal(this.#error$, {
    initialValue: undefined,
  });

  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)), {
    initialValue: false,
  });

  setParams(locationId: number) {
    this.#locationId$.next(locationId);
  }

  readonly $tables = toSignal(
    this.#locationId$.pipe(
      tap(() => {
        this.#isLoading$.next(true);
        this.#error$.next(undefined);
      }),

      switchMap((locationId) => {
        if (!locationId) {
          this.#isLoading$.next(false);
          return EMPTY;
        }

        const httpParams = new HttpParams().set('locationId', locationId.toString());

        return this.#httpClient
          .get<TableDto[]>(`${ApiPathEnum.RESTAURANT}/tables`, {
            params: httpParams,
          })
          .pipe(
            catchError((e: HttpErrorResponse) => {
              this.#error$.next(e.status);
              this.#isLoading$.next(false);

              return EMPTY;
            }),

            tap(() => {
              this.#isLoading$.next(false);
            }),
          );
      }),
    ),
    {
      initialValue: [],
    },
  );

  retry() {
    const locationId = this.#locationId$.getValue();

    if (locationId) {
      this.#locationId$.next(locationId);
    }
  }

  getCurrentLocationId(): number | null {
    return this.#locationId$.getValue();
  }
}
