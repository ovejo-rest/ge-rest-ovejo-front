import { Routes } from '@angular/router';
import { terminalModeGuard } from './core';

export const routes: Routes = [
  {
    // Terminal de salón: pantalla completa, fuera del layout del backoffice.
    path: 'terminal',
    loadChildren: () => import('./modules/terminal/terminal.routes'),
  },
  {
    path: '',
    canActivateChild: [terminalModeGuard],
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
