import { Injectable, inject, Injector } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { LoginInputDto, LoginOutputDto, UserDataDto } from '../dtos';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiPathEnum } from 'src/environments';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenKey = 'token';
  refreshTokenKey = 'refreshToken';
  private userDataKey = 'userData';
  private lastActivityKey = 'lastActivity';

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });
  readonly $error = toSignal(this.#error$);
  readonly $hasError = toSignal(this.#error$.pipe(map((code) => code !== undefined)));

  token: string | null = null;
  refreshToken: string | null = null;
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<LoginOutputDto> = new BehaviorSubject<Readonly<LoginOutputDto>>({
    token: { token: '' },
    refreshToken: '',
    userData: {
      code: '',
      email: '',
      fatherLastName: '',
      motherLastName: '',
      name: '',
      rut: '',
      status: '',
    },
  });

  readonly #injector = inject(Injector);
  #whoamiService: WhoamiService | null = null;

  get #whoami(): WhoamiService {
    if (!this.#whoamiService) {
      this.#whoamiService = this.#injector.get(WhoamiService);
    }
    return this.#whoamiService;
  }

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  private loadSession() {
    const lastActivity = localStorage.getItem(this.lastActivityKey);

    if (lastActivity) {
      const elapsed = Date.now() - Number(lastActivity);
      const oneDay = 24 * 60 * 60 * 1000;

      if (elapsed > oneDay) {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userDataKey);
        localStorage.removeItem(this.lastActivityKey);
        return;
      }
    }

    const storedToken = localStorage.getItem(this.tokenKey);
    const storedRefreshToken = localStorage.getItem(this.refreshTokenKey);
    const storedUserData = localStorage.getItem(this.userDataKey);

    if (storedToken) {
      this.token = storedToken;
      this.refreshToken = storedRefreshToken;
      this.currentUserLoginOn.next(true);

      if (storedUserData) {
        try {
          const userData: UserDataDto = JSON.parse(storedUserData);
          this.currentUserData.next({
            token: { token: storedToken },
            refreshToken: storedRefreshToken ?? '',
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

  private saveRefreshToken(refreshToken: string) {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.refreshToken = refreshToken;
  }

  getToken(): string | null {
    return this.token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  login(loginInput: LoginInputDto): Observable<{ token: string; refreshToken: string; userData: UserDataDto }> {
    this.#isLoading$.next(true);

    return this.http
      .post<{ token: string; refreshToken: string; userData: UserDataDto }>(
        `${ApiPathEnum.AUTH}/login/authenticate-user`,
        {
          email: loginInput.email,
          password: loginInput.password,
        },
      )
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
        tap((response: { token: string; refreshToken: string; userData: UserDataDto }) => {
          this.saveToken(response.token);
          this.saveRefreshToken(response.refreshToken);
          localStorage.setItem(this.lastActivityKey, String(Date.now()));
          this.currentUserLoginOn.next(true);
          this.currentUserData.next({
            token: { token: response.token },
            refreshToken: response.refreshToken,
            userData: response.userData,
          });
          this.#whoami.refetch();
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
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.lastActivityKey);
        this.token = null;
        this.refreshToken = null;
        this.currentUserLoginOn.next(false);
        this.currentUserData.next({
          token: { token: '' },
          refreshToken: '',
          userData: {
            code: '',
            email: '',
            fatherLastName: '',
            motherLastName: '',
            name: '',
            rut: '',
            status: '',
          },
        });
      }),
    );
  }

  refreshAccessToken(): Observable<string> {
    const currentRefreshToken = this.getRefreshToken();
    if (!currentRefreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{ token: string; refreshToken: string }>(`${ApiPathEnum.AUTH}/auth/refresh-token`, {
        refreshToken: currentRefreshToken,
      })
      .pipe(
        tap((response) => {
          this.saveToken(response.token);
          this.saveRefreshToken(response.refreshToken);
          localStorage.setItem(this.lastActivityKey, String(Date.now()));
        }),
        map((response) => response.token),
        catchError((error: HttpErrorResponse) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  hasRole(roles: string[]): Observable<boolean> {
    return this.#whoami.roles$.pipe(map((userRoles) => roles.some((role) => userRoles.has(role))));
  }

  hasPermission(permissions: string[]): Observable<boolean> {
    return this.#whoami.permissions$.pipe(map((userPermissions) => permissions.some((p) => userPermissions.has(p))));
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
