import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { UserDto } from './dtos';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllUsersService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly #params$ = new BehaviorSubject<{
    page: number;
    perPage: number;
    name?: string;
    email?: string;
    statusId?: number;
    activated?: boolean;
  }>({
    page: 1,
    perPage: 10,
  });

  setParams(
    params: Partial<{
      page: number;
      perPage: number;
      name?: string;
      email?: string;
      statusId?: number;
      activated?: boolean;
    }>,
  ) {
    const current = this.#params$.getValue();
    this.#params$.next({ ...current, ...params });
  }

  readonly $users = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((params) => {
        let httpParams = new HttpParams()
          .set('page', params.page.toString())
          .set('perPage', params.perPage.toString());

        if (params.name && params.name.trim() !== '') {
          httpParams = httpParams.set('name', params.name.trim());
        }
        if (params.email && params.email.trim() !== '') {
          httpParams = httpParams.set('email', params.email.trim());
        }
        if (params.statusId !== undefined) {
          httpParams = httpParams.set('statusId', params.statusId.toString());
        }
        if (params.activated !== undefined) {
          httpParams = httpParams.set('activated', params.activated.toString());
        }

        return this.#httpClient
          .get<StandardizedPagination<UserDto>>(`${ApiPathEnum.AUTH}/users`, {
            params: httpParams,
          })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.#error$.next(error.status);
              this.#isLoading$.next(false);
              return EMPTY;
            }),
            tap(() => this.#isLoading$.next(false)),
            map((data) => data),
          );
      }),
    ),
  );

  retry() {
    this.#params$.next({ ...this.#params$.getValue() });
  }
}
