import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { CustomerDetailComponent, CustomerListComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: CustomerListComponent },
      { path: ':id', component: CustomerDetailComponent },
    ],
  },
];

export default routes;
