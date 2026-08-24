import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { CreateModuleDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class CreateModuleService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<CreateModuleDto>();
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
          this.#httpClient.post(`${ApiPathEnum.AUTH}/roles-and-permissions/modules`, input).pipe(
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

  create(input: CreateModuleDto) {
    this.#submit$.next(input);
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
