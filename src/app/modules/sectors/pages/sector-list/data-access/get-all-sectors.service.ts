import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, catchError, EMPTY, filter, map, Subject, switchMap, tap } from 'rxjs';

import { SectorDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllSectorsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);

  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly #params$ = new BehaviorSubject<{
    name?: string;
    locationId: number | null;
  }>({
    locationId: null,
  });

  readonly $isLoading = toSignal(this.#isLoading$);

  readonly $error = toSignal(this.#error$);

  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  setParams(
    params: Partial<{
      name?: string;
      locationId: number;
    }>,
  ) {
    this.#params$.next({
      ...this.#params$.getValue(),
      ...params,
    });
  }

  readonly $sectors = toSignal(
    this.#params$.pipe(
      filter((params) => params.locationId !== null),

      tap(() => {
        this.#isLoading$.next(true);
        this.#error$.next(undefined);
      }),

      switchMap((params) => {
        let httpParams = new HttpParams();

        httpParams = httpParams.set('locationId', params.locationId!.toString());

        if (params.name?.trim()) {
          httpParams = httpParams.set('name', params.name.trim());
        }

        return this.#httpClient.get<SectorDto[]>(`${ApiPathEnum.RESTAURANT}/sectors`, { params: httpParams }).pipe(
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);

            this.#isLoading$.next(false);

            return EMPTY;
          }),

          tap(() => {
            this.#isLoading$.next(false);
          }),
        );
      }),
    ),
    { initialValue: [] },
  );

  retry() {
    this.#params$.next({
      ...this.#params$.getValue(),
    });
  }
}
