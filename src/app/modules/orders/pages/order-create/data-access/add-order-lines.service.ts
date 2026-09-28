import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, of, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { AddOrderLinesDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class AddOrderLinesService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $success = toSignal(this.#success$);

  add({ orderId, products, note, currentNote }: AddOrderLinesDto) {
    this.#isLoading$.next(true);
    this.#error$.next(undefined);
    const url = `${ApiPathEnum.RESTAURANT}/orders/${orderId}`;
    // El backend no acepta notas por línea: se agregan a la nota del pedido tras sumar los productos.
    const staffNote = note ? [currentNote?.trim(), note].filter(Boolean).join('\n') : null;

    this.#httpClient
      .post(`${url}/lines`, { products })
      .pipe(
        switchMap(() => (staffNote ? this.#httpClient.patch(url, { staffNote }) : of(null))),
        tap(() => this.#isLoading$.next(false)),
        catchError((error: HttpErrorResponse) => {
          this.#error$.next(error.status);
          this.#isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe(() => this.#success$.next(true));
  }

  reset() {
    this.#error$.next(undefined);
    this.#success$.next(false);
    this.#isLoading$.next(false);
  }
}
