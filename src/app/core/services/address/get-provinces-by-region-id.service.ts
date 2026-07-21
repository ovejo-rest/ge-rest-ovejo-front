import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, catchError, filter, map, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { GetProvincesDto } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class GetProvincesByRegionIdService {
  readonly #httpClient = inject(HttpClient);
  readonly #regionId$ = new BehaviorSubject<number | null>(null);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly $provincesById = toSignal(
    this.#regionId$.pipe(
      filter((id): id is number => id !== null),
      tap(() => {
        this.#isLoading$.next(true);
        this.#error$.next(undefined);
      }),
      switchMap((regionId) =>
        this.#httpClient.get<GetProvincesDto[]>(`${ApiPathEnum.AUTH}/address/provinces/${regionId}`).pipe(
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

  loadProvinces(regionId: number) {
    this.#regionId$.next(regionId);
  }
}
