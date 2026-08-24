import { Routes } from '@angular/router';
import { TableListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: TableListComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
];

export default routes;
