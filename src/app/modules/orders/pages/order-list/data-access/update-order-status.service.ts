import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { OrderStatus } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class UpdateOrderStatusService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<{ id: number; status: OrderStatus }>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $hasError = toSignal(this.#error$.pipe(map((c) => c !== undefined)));
  readonly $success = toSignal(this.#success$);

  constructor() {
    this.#submit$.pipe(
      tap(() => this.#isLoading$.next(true)),
      switchMap(({ id, status }) => this.#httpClient.patch(`${ApiPathEnum.RESTAURANT}/orders/${id}/status`, { status }).pipe(
        tap(() => { this.#success$.next(true); this.#isLoading$.next(false); }),
        catchError((e: HttpErrorResponse) => { this.#error$.next(e.status); this.#isLoading$.next(false); return EMPTY; }),
      )),
    ).subscribe();
  }

  update(id: number, status: OrderStatus) { this.#submit$.next({ id, status }); }
  reset() { this.#error$.next(undefined); this.#success$.next(false); this.#isLoading$.next(false); }
}
