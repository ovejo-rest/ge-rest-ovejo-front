import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, Subject, tap, throwError } from 'rxjs';
import { LoginInputDto, LoginOutputDto, UserDataDto } from '../dtos';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiPathEnum } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenKey = 'token';
  private userDataKey = 'userData';

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  token: string | null = null;
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<LoginOutputDto> = new BehaviorSubject<Readonly<LoginOutputDto>>({
    token: { token: '' },
    userData: {
      code: '',
      email: '',
      fatherLastName: '',
      id: 0,
      motherLastName: '',
      name: '',
      rut: '',
      status: '',
    },
  });

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  private loadSession() {
    const storedToken = localStorage.getItem(this.tokenKey);
    const storedUserData = localStorage.getItem(this.userDataKey);

    if (storedToken) {
      this.token = storedToken;
      this.currentUserLoginOn.next(true);

      if (storedUserData) {
        try {
          const userData: UserDataDto = JSON.parse(storedUserData);
          this.currentUserData.next({
            token: { token: storedToken },
            userData,
          });
        } catch (error) {
          console.error('Error al parsear userData desde localStorage:', error);
        }
      }
    }
  }

  private saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  login(loginInput: LoginInputDto): Observable<{ token: string; userData: UserDataDto }> {
    this.#isLoading$.next(true);

    return this.http
      .post<{ token: string; userData: UserDataDto }>(`${ApiPathEnum.AUTH}/login/authenticate-user`, {
        email: loginInput.email,
        password: loginInput.password,
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
        tap((response: { token: string; userData: UserDataDto }) => {
          this.saveToken(response.token);
          this.currentUserLoginOn.next(true);
          this.currentUserData.next({
            token: { token: response.token },
            userData: response.userData,
          });
        }),
        finalize(() => {
          this.#isLoading$.next(false);
        }),
      );
  }

  logout(): Observable<void> {
    this.#isLoading$.next(true);

    return this.http.post<void>(`${ApiPathEnum.AUTH}/login/logout`, {}).pipe(
      tap(() => this.#error$.next(undefined)),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error ${error.error.message}`;
        } else {
          errorMessage = `Error code: ${error.status}, message: ${error.message}`;
        }
        this.#error$.next(error.status);
        return throwError(() => errorMessage);
      }),
      finalize(() => {
        this.#isLoading$.next(false);
        localStorage.removeItem(this.tokenKey);
        this.token = null;
        this.currentUserLoginOn.next(false);
        this.currentUserData.next({
          token: { token: '' },
          userData: {
            code: '',
            email: '',
            fatherLastName: '',
            id: 0,
            motherLastName: '',
            name: '',
            rut: '',
            status: '',
          },
        });
      }),
    );
  }

  isLogin() {
    return this.token !== null;
  }

  get userData(): Observable<LoginOutputDto> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}
