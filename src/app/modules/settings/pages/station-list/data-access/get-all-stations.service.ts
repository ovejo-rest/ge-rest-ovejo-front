import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { StationDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetAllStationsService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #load$ = new Subject<void>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);

  readonly $stations = toSignal(
    this.#load$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap(() =>
        this.#httpClient.get<StationDto[]>(`${ApiPathEnum.RESTAURANT}/stations`).pipe(
          tap(() => this.#isLoading$.next(false)),
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  load() {
    this.#load$.next();
  }
}
