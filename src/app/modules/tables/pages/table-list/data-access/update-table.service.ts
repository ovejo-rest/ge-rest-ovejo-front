import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, map, Subject, switchMap, tap } from 'rxjs';
import { UpdateTableDto } from './dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class UpdateTableService {
  readonly #httpClient = inject(HttpClient);
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #submit$ = new Subject<UpdateTableDto>();
  readonly #success$ = new Subject<boolean>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((c) => c !== undefined)));
  readonly $success = toSignal(this.#success$);

  constructor() {
    this.#submit$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap((data) => this.#httpClient.put(`${ApiPathEnum.RESTAURANT}/tables/${data.id}`, data).pipe(
        tap(() => { this.#success$.next(true); this.#isLoading$.next(false); }),
        catchError((e: HttpErrorResponse) => { this.#error$.next(e.status); this.#success$.next(false); this.#isLoading$.next(false); return EMPTY; }),
      )),
    ).subscribe();
  }

  update(data: UpdateTableDto) { this.#submit$.next(data); }
  reset() { this.#error$.next(undefined); this.#success$.next(false); this.#isLoading$.next(false); }
}
