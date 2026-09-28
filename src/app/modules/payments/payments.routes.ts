import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { PaymentsComponent } from './payments.component';
import { PaymentListComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: PaymentListComponent,
      },
    ],
  },
];

export default routes;
