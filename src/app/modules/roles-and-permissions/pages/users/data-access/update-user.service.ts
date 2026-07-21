import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { UpdateUserDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class UpdateUserService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<UpdateUserDto>();
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
        switchMap((input) => {
          const body: Record<string, unknown> = {};
          if (input.name !== undefined) body['name'] = input.name;
          if (input.fatherLastName !== undefined) body['fatherLastName'] = input.fatherLastName;
          if (input.motherLastName !== undefined) body['motherLastName'] = input.motherLastName;
          if (input.email !== undefined) body['email'] = input.email;
          if (input.statusId !== undefined) body['statusId'] = input.statusId;

          return this.#httpClient.patch<{ message: string }>(`${ApiPathEnum.AUTH}/users/${input.userId}`, body).pipe(
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
          );
        }),
      )
      .subscribe();
  }

  update(input: UpdateUserDto) {
    this.#submit$.next(input);
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
