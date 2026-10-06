import { environment } from '../../environments/environment';

/** Enlaces hacia la app (app.redom.cl): la landing no maneja sesión, solo redirige. */
export const APP_LINKS = {
  signIn: `${environment.appUrl}/auth/sign-in`,
  signUp: `${environment.appUrl}/auth/sign-up`,
} as const;
