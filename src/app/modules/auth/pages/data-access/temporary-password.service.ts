import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, delay, finalize, map, Observable, Subject, tap, throwError } from 'rxjs';
import { TemporaryPasswordDto, TemporaryPasswordResponseDto } from '../dtos';
import { HttpClient } from '@angular/common/http';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class TemporaryPasswordService {
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  constructor(private httpClient: HttpClient) {}

  validate(input: TemporaryPasswordDto): Observable<TemporaryPasswordResponseDto> {
    this.#isLoading$.next(true);

    return this.httpClient
      .post<TemporaryPasswordResponseDto>(`${ApiPathEnum.AUTH}/login/new-password-validate`, input)
      .pipe(
        tap(() => this.#isLoading$.next(true)),
        tap(() => this.#error$.next(undefined)),
        delay(2000),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error ${error.error.message}`;
          } else {
            errorMessage = `Error code: ${error.status}, message: ${error.message}`;
          }
          this.#error$.next(error.status);
          this.#isLoading$.next(false);
          return throwError(() => error);
        }),
        finalize(() => {
          this.#isLoading$.next(false);
        }),
      );
  }
}
