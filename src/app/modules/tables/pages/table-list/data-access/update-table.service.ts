import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { ApiError, readApiError } from 'src/app/core/utils';
import { UpdateTableDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class UpdateTableService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<ApiError | undefined>();
  readonly #submit$ = new Subject<UpdateTableDto>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((e) => e !== undefined)));
  readonly $success = toSignal(this.#success$);

  constructor() {
    this.#submit$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      // El id va solo en la URL; el backend no lo acepta en el body.
      switchMap(({ id, ...changes }) => this.#httpClient.put(`${ApiPathEnum.RESTAURANT}/tables/${id}`, changes).pipe(
        tap(() => { this.#success$.next(true); this.#isLoading$.next(false); }),
        catchError((e: unknown) => { this.#error$.next(readApiError(e)); this.#success$.next(false); this.#isLoading$.next(false); return EMPTY; }),
      )),
    ).subscribe();
  }

  update(data: UpdateTableDto) { this.#submit$.next(data); }
  reset() { this.#error$.next(undefined); this.#success$.next(false); this.#isLoading$.next(false); }
}
