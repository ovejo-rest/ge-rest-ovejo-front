import { Routes } from '@angular/router';
import { OrderListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  { path: '', component: OrderListComponent, canActivate: [authGuard], canActivateChild: [authGuard] },
];

export default routes;
