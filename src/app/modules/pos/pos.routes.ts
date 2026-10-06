import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { PosTerminalComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: PosTerminalComponent,
  },
];

export default routes;
