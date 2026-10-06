import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { SectorDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class FindSectorByIdService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #fetch$ = new Subject<number>();
  readonly #sector$ = new BehaviorSubject<SectorDto | null>(null);

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));
  readonly $sector = toSignal(this.#sector$);

  constructor() {
    this.#fetch$
      .pipe(
        tap(() => {
          this.#isLoading$.next(true);
          this.#error$.next(undefined);
        }),
        switchMap((id) =>
          this.#httpClient.get<SectorDto>(`${ApiPathEnum.RESTAURANT}/sectors/${id}`).pipe(
            tap((sector) => {
              this.#sector$.next(sector);
              this.#isLoading$.next(false);
            }),
            catchError((error: HttpErrorResponse) => {
              this.#error$.next(error.status);
              this.#sector$.next(null);
              this.#isLoading$.next(false);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  fetch(id: number) {
    this.#fetch$.next(id);
  }

  reset() {
    this.#sector$.next(null);
    this.#error$.next(undefined);
    this.#isLoading$.next(false);
  }
}
