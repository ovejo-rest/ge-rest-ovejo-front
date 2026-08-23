import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes'),
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.routes'),
  },
  { path: '**', redirectTo: 'errors/404' },
];
