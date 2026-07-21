import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, finalize, map, Observable, Subject, tap, throwError } from 'rxjs';
import { ForgotPasswordDto } from '../dtos';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  constructor(private httpClient: HttpClient) {}

  deactivate(input: ForgotPasswordDto): Observable<{ code: number; message: string }> {
    this.#isLoading$.next(true);

    return this.httpClient
      .post<{ code: number; message: string }>(`${ApiPathEnum.AUTH}/auth/forgot-password`, {
        email: input.email,
      })
      .pipe(
        tap(() => this.#isLoading$.next(true)),
        tap(() => this.#error$.next(undefined)),
        catchError((error: HttpErrorResponse) => {
          console.log(`Error: ${error.status}`);
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
