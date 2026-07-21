import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, tap } from 'rxjs';
import { GetRegionsDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class GetRegionsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $regions = toSignal(
    this.#httpClient.get<GetRegionsDto[]>(`${ApiPathEnum.AUTH}/address/regions`).pipe(
      tap(() => {
        this.#isLoading$.next(true);
        this.#error$.next(undefined);
      }),
      catchError((error: HttpErrorResponse) => {
        this.#error$.next(error.status);
        this.#isLoading$.next(false);
        return EMPTY;
      }),
      tap(() => this.#isLoading$.next(false)),
    ),
  );
}
