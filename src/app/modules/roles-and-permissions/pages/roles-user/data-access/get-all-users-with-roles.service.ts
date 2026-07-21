import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { UserWithRolesDto } from './dtos';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllUsersWithRolesService {
  readonly #httpClient = inject(HttpClient);

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly #params$ = new BehaviorSubject<{ page: number; perPage: number; fullName?: string }>({
    page: 1,
    perPage: 10,
  });

  setParams(params: Partial<{ page: number; perPage: number; fullName?: string }>) {
    const current = this.#params$.getValue();
    this.#params$.next({ ...current, ...params });
  }

  readonly $users = toSignal(
    this.#params$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((params) => {
        let httpParams = new HttpParams().set('page', params.page.toString()).set('perPage', params.perPage.toString());

        if (params.fullName && params.fullName.trim() !== '') {
          httpParams = httpParams.set('fullName', params.fullName.trim());
        }

        return this.#httpClient
          .get<StandardizedPagination<UserWithRolesDto>>(`${ApiPathEnum.AUTH}/users/users-with-roles`, {
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
