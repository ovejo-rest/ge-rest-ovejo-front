import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, finalize, map, Observable, Subject, tap, throwError } from 'rxjs';
import { ResetPaswordInputDto, TemporaryPasswordResponseDto } from '../dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  constructor(private httpClient: HttpClient) {}

  reset(input: ResetPaswordInputDto): Observable<TemporaryPasswordResponseDto> {
    this.#isLoading$.next(true);

    return this.httpClient
      .put<TemporaryPasswordResponseDto>(`${ApiPathEnum.AUTH}/login/reset-password`, {
        email: input.email,
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      })
      .pipe(
        tap(() => this.#isLoading$.next(true)),
        tap(() => this.#error$.next(undefined)),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error ${error.error.message}`;
          } else {
            errorMessage = `Error code: ${error.status}, message: ${error.message}`;
          }
          this.#error$.next(error.status);
          this.#isLoading$.next(false);
          return throwError(() => errorMessage);
        }),
        finalize(() => {
          this.#isLoading$.next(false);
        }),
      );
  }
}
