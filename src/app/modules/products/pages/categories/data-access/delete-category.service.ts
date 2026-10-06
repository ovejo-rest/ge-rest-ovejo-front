import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));
  readonly $success = toSignal(this.#success$);

  delete(id: number) {
    this.#isLoading$.next(true);
    this.#error$.next(undefined);

    this.#httpClient
      .delete<void>(`${ApiPathEnum.RESTAURANT}/categories/${id}`)
      .pipe(
        tap(() => this.#isLoading$.next(false)),
        catchError((error: HttpErrorResponse) => {
          this.#error$.next(error.status);
          this.#isLoading$.next(false);
          return EMPTY;
        })
      )
      .subscribe(() => this.#success$.next(true));
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
