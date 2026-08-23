import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { UpdateSectorDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class UpdateSectorService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<{ id: number; data: UpdateSectorDto }>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));
  readonly $success = toSignal(this.#success$);

  constructor() {
    this.#submit$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap(({ id, data }) =>
        this.#httpClient.patch(`${ApiPathEnum.RESTAURANT}/sectors/${id}`, data).pipe(
          tap(() => { this.#success$.next(true); this.#isLoading$.next(false); }),
          catchError((error: HttpErrorResponse) => { this.#error$.next(error.status); this.#success$.next(false); this.#isLoading$.next(false); return EMPTY; }),
        ),
      ),
    ).subscribe();
  }

  update(id: number, data: UpdateSectorDto) { this.#submit$.next({ id, data }); }
  reset() { this.#error$.next(undefined); this.#success$.next(false); this.#isLoading$.next(false); }
}
