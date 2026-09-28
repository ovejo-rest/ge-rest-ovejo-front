import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { TerminalShellComponent } from './pages';

// Fuera del layout del backoffice: sin menú ni barra superior.
const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: TerminalShellComponent,
  },
];

export default routes;
