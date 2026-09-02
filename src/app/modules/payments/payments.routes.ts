import { Routes } from '@angular/router';
import { PaymentsComponent } from './payments.component';
import { PaymentListComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    children: [
      {
        path: '',
        component: PaymentListComponent,
      },
    ],
  },
];

export default routes;
