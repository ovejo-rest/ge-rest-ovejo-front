import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { OrderDetailDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetOrderByIdService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #id$ = new Subject<number>();
  #lastId: number | null = null;

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $order = toSignal(
    this.#id$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((id) =>
        this.#httpClient.get<OrderDetailDto>(`${ApiPathEnum.RESTAURANT}/orders/${id}`).pipe(
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

  load(id: number) {
    this.#lastId = id;
    this.#id$.next(id);
  }

  retry() {
    if (this.#lastId !== null) this.#id$.next(this.#lastId);
  }
}
