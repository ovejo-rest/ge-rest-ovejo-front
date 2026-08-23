import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { SectorDto } from './dtos';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllSectorsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #params$ = new BehaviorSubject<{ page: number; perPage: number; name?: string }>({ page: 1, perPage: 10 });

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  setParams(params: Partial<{ page: number; perPage: number; name?: string }>) {
    this.#params$.next({ ...this.#params$.getValue(), ...params });
  }

  readonly $sectors = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((params) => {
        let httpParams = new HttpParams().set('page', params.page.toString()).set('perPage', params.perPage.toString());
        if (params.name?.trim()) httpParams = httpParams.set('name', params.name.trim());
        return this.#httpClient.get<SectorDto[]>(`${ApiPathEnum.RESTAURANT}/sectors`, { params: httpParams }).pipe(
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
          tap(() => this.#isLoading$.next(false)),
        );
      }),
    ),
  );

  retry() {
    this.#params$.next({ ...this.#params$.getValue() });
  }
}
