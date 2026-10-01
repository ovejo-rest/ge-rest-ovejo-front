import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import { environment } from 'src/environments/environment';

export const permissionGuard: CanActivateFn = (route) => {
  if (!environment.enforcePermissions) return true;
  const authService = inject(AuthService);
  const router = inject(Router);
  const permission = route.data['viewPermission'] as string;

  return authService.hasPermission([permission]).pipe(
    map((has) => has || router.parseUrl('/dashboard/error')),
  );
};
