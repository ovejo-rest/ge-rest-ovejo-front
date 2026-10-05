import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import { ApiPathEnum } from 'src/environments';

// Endpoints públicos: su 401 significa "credenciales inválidas", no "token vencido" (logout sí lleva token).
const PUBLIC_PATHS = [
  `${ApiPathEnum.AUTH}/login/`,
  `${ApiPathEnum.AUTH}/auth/refresh-token`,
  `${ApiPathEnum.AUTH}/auth/forgot-password`,
];
const isPublic = (url: string) => PUBLIC_PATHS.some((path) => url.startsWith(path)) && !url.endsWith('/login/logout');


const withToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token || isPublic(req.url)) return next(req);

  return next(withToken(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);
      // Refresh con cola: si ya hay uno en curso, se espera ese mismo.
      // Solo un refresh fallido cierra la sesión; los errores del reintento llegan tal cual al llamador.
      return authService.refreshAccessToken().pipe(
        catchError((refreshError) => {
          authService.clearSession();
          router.navigate(['/auth/sign-in']);
          return throwError(() => (refreshError instanceof HttpErrorResponse ? error : refreshError));
        }),
        switchMap((newToken) => next(withToken(req, newToken))),
      );
    }),
  );
};
