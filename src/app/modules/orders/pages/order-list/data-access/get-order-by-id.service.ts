import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { OrderDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetOrderByIdService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #fetch$ = new Subject<number>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $hasError = toSignal(this.#error$.pipe(map((c) => c !== undefined)));

  readonly $order = toSignal(
    this.#fetch$.pipe(
      tap(() => this.#isLoading$.next(true)),
      switchMap((id) => this.#httpClient.get<OrderDto>(`${ApiPathEnum.RESTAURANT}/orders/${id}`).pipe(
        tap(() => this.#isLoading$.next(false)),
        catchError((e: HttpErrorResponse) => { this.#error$.next(e.status); this.#isLoading$.next(false); return EMPTY; }),
      )),
    ),
  );

  load(id: number) { this.#fetch$.next(id); }
}
