import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/pages/data-access';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[];

  return authService.hasRole(roles).pipe(
    map((has) => has || router.parseUrl('/dashboard/error')),
  );
};
