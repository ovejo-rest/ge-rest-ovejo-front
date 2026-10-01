import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import { WhoamiService } from '../services/whoami/whoami.service';

// Con sesión pero sin negocio → onboarding (el backend responde 403 en casi todo sin negocio).
export const businessGuard: CanActivateFn = () => {
  if (!inject(AuthService).isLogin()) return true; // authGuard de cada ruta se encarga.
  const router = inject(Router);
  const whoamiService = inject(WhoamiService);
  const known = whoamiService.$whoami();
  if (known) return known.user.restaurantId ? true : router.parseUrl('/onboarding');
  return whoamiService
    .load()
    .pipe(map((whoami) => (whoami && !whoami.user.restaurantId ? router.parseUrl('/onboarding') : true)));
};

// El onboarding es solo para quien aún no tiene negocio.
export const onboardingGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!inject(AuthService).isLogin()) return router.parseUrl('/auth/sign-in');
  return inject(WhoamiService)
    .load()
    .pipe(map((whoami) => (whoami?.user.restaurantId ? router.parseUrl('/dashboard/admin') : true)));
};

