import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, filter, map, Subject, switchMap, tap } from 'rxjs';
import { GetCommunesDto } from './dtos/get-communes.dto';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class GetCommunesByProvincesIdService {
  readonly #httpClient = inject(HttpClient);
  readonly #communeId$ = new BehaviorSubject<number | null>(null);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $communesById = toSignal(
    this.#communeId$.pipe(
      filter((id): id is number => id !== null),
      tap(() => {
        this.#isLoading$.next(true);
        this.#error$.next(undefined);
      }),
      switchMap((communeId) =>
        this.#httpClient.get<GetCommunesDto[]>(`${ApiPathEnum.AUTH}/address/comunes/${communeId}`).pipe(
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
          tap(() => this.#isLoading$.next(false)),
        ),
      ),
    ),
  );

  loadCommunes(communeId: number) {
    this.#communeId$.next(communeId);
  }
}
