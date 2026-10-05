import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, tap } from 'rxjs';
import { ApiError, readApiError } from 'src/app/core/utils';
import { ApiPathEnum } from 'src/environments';
import { CreateOrderDto, CreateOrderResponseDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class CreateOrderService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<ApiError | undefined>();
  readonly #created$ = new Subject<CreateOrderResponseDto | null>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $created = toSignal(this.#created$);

  create(dto: CreateOrderDto) {
    this.#isLoading$.next(true);
    this.#error$.next(undefined);

    this.#httpClient
      .post<CreateOrderResponseDto>(`${ApiPathEnum.RESTAURANT}/orders`, dto)
      .pipe(
        tap(() => this.#isLoading$.next(false)),
        catchError((error: unknown) => {
          // Se conserva el código de negocio (TABLE_BLOCKED…) para el mensaje.
          this.#error$.next(readApiError(error));
          this.#isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => this.#created$.next(response));
  }

  reset() {
    this.#error$.next(undefined);
    this.#created$.next(null);
    this.#isLoading$.next(false);
  }
}
