import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { BookingListComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: BookingListComponent,
  },
];

export default routes;
