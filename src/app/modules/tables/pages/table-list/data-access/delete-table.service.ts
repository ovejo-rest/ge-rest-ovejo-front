import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class DeleteTableService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<number>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((c) => c !== undefined)));
  readonly $success = toSignal(this.#success$);

  constructor() {
    this.#submit$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((id) => this.#httpClient.delete(`${ApiPathEnum.RESTAURANT}/tables/${id}`).pipe(
        tap(() => { this.#success$.next(true); this.#isLoading$.next(false); }),
        catchError((e: HttpErrorResponse) => { this.#error$.next(e.status); this.#success$.next(false); this.#isLoading$.next(false); return EMPTY; }),
      )),
    ).subscribe();
  }

  delete(id: number) { this.#submit$.next(id); }
  reset() { this.#error$.next(undefined); this.#success$.next(false); this.#isLoading$.next(false); }
}
