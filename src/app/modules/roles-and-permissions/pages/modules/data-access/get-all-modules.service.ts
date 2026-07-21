import { HttpClient, HttpErrorResponse, HttpStatusCode, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  delay,
  EMPTY,
  map,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { GetAllModulesDto } from './dtos';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class GetAllModulesService {
  readonly #httpClient = inject(HttpClient);

  readonly #retry$ = new Subject<void>();
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  readonly #params$ = new BehaviorSubject<{ page: number; perPage: number; searchCode?: string; searchName?: string }>({
    page: 1,
    perPage: 10,
  });

  setParams(params: Partial<{ page: number; perPage: number; searchCode?: string; searchName?: string }>) {
    const current = this.#params$.getValue();
    this.#params$.next({ ...current, ...params });
  }

  readonly $modules = toSignal(
    combineLatest([this.#params$, this.#retry$]).pipe(
      startWith([this.#params$.value, void 0] as const),
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap(([params]) => {
        let httpParams = new HttpParams().set('page', params.page.toString()).set('perPage', params.perPage.toString());

        if (params.searchCode && params.searchCode.trim() !== '') {
          httpParams = httpParams.set('code', params.searchCode.trim().toUpperCase());
        }
        if (params.searchName && params.searchName.trim() !== '') {
          httpParams = httpParams.set('name', params.searchName.trim());
        }

        return this.#httpClient
          .get<StandardizedPagination<GetAllModulesDto>>(`${ApiPathEnum.AUTH}/roles-and-permissions/modules`, {
            params: httpParams,
          })
          .pipe(
            delay(2000),
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
    this.#retry$.next();
  }
}
