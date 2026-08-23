import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { FindBusinessSetupStepsResponseDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class FindBusinessSetupStepsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #businessId$ = new BehaviorSubject<number | undefined>(undefined);

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $steps = toSignal(
    this.#businessId$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((businessId) => {
        if (businessId === undefined) {
          return EMPTY;
        }

        return this.#httpClient
          .get<FindBusinessSetupStepsResponseDto>(`${ApiPathEnum.RESTAURANT}/business/${businessId}/setup/steps`)
          .pipe(
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

  load(businessId: number) {
    this.#businessId$.next(businessId);
  }

  retry() {
    this.#businessId$.next(this.#businessId$.getValue());
  }
}
