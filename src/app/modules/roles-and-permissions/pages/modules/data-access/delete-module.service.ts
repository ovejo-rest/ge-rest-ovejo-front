import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { DeleteModuleDto } from './dtos/delete-module.dto';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class DeleteModuleService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<DeleteModuleDto>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));
  readonly $success = toSignal(this.#success$);

  constructor() {
    this.#submit$
      .pipe(
        tap(() => this.#isLoading$.next(true)),
        tap(() => this.#error$.next(undefined)),
        switchMap((input) =>
          this.#httpClient.put(`${ApiPathEnum.AUTH}/roles-and-permissions/modules/${input.id}/delete`, null).pipe(
            tap(() => {
              this.#success$.next(true);
              this.#isLoading$.next(false);
            }),
            catchError((error: HttpErrorResponse) => {
              this.#error$.next(error.status);
              this.#success$.next(false);
              this.#isLoading$.next(false);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  delete(input: DeleteModuleDto) {
    this.#submit$.next(input);
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
