import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { KitchenOrderDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetKitchenOrdersService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #stationId$ = new Subject<number | null>();
  readonly #updatedAt$ = new BehaviorSubject<Date | null>(null);

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $updatedAt = toSignal(this.#updatedAt$);

  // Comandas pendientes, de la más antigua a la más nueva.
  readonly $orders = toSignal(
    this.#stationId$.pipe(
      tap(() => this.#isLoading$.next(true)),
      switchMap((stationId) => {
        const params = stationId ? new HttpParams().set('stationId', stationId) : undefined;
        return this.#httpClient.get<KitchenOrderDto[]>(`${ApiPathEnum.RESTAURANT}/kitchen`, { params }).pipe(
          tap(() => {
            this.#isLoading$.next(false);
            this.#error$.next(undefined);
            this.#updatedAt$.next(new Date());
          }),
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
        );
      }),
    ),
  );

  load(stationId: number | null) {
    this.#stationId$.next(stationId);
  }
}
