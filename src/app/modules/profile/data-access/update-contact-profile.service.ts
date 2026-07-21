import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { UpdateContactProfileDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

type UpdateContactInput = {
  id: number;
} & UpdateContactProfileDto;

@Injectable({
  providedIn: 'root',
})
export class UpdateContactProfileService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<UpdateContactInput>();
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
          this.#httpClient
            .patch(`${ApiPathEnum.AUTH}/contacts/${input.id}`, {
              phone: input.phone,
              cellphone: input.cellphone,
              address: input.address,
              city: input.city,
              email: input.email,
              communeId: input.communeId,
            })
            .pipe(
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

  update(id: number, input: UpdateContactProfileDto) {
    this.#submit$.next({ id, ...input });
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
