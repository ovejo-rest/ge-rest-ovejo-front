import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, filter, map, Subject, switchMap, tap } from 'rxjs';
import { GetProfileDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class GetProfileService {
  readonly #httpClient = inject(HttpClient);
  readonly #userId$ = new BehaviorSubject<string | null>(null);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $profile = toSignal(
    this.#userId$.pipe(
      filter((id): id is string => id !== null),
      tap(() => {
        this.#isLoading$.next(true);
        this.#error$.next(undefined);
      }),
      switchMap((userId) =>
        this.#httpClient.get<GetProfileDto>(`${ApiPathEnum.AUTH}/profile/${userId}/user`).pipe(
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
          tap(() => this.#isLoading$.next(false)),
        ),
      ),
    ),
  );

  loadProfile(userId: string) {
    this.#userId$.next(userId);
  }
}
