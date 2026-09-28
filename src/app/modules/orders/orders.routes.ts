import { Routes } from '@angular/router';
import { OrderCreateComponent, OrderDetailComponent, OrderListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: OrderListComponent },
      { path: 'new', component: OrderCreateComponent, data: { mode: 'create' } },
      { path: ':id/add', component: OrderCreateComponent, data: { mode: 'add' } },
      { path: ':id', component: OrderDetailComponent },
    ],
  },
];

export default routes;
