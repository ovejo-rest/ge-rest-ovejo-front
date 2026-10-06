import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { KitchenDisplayComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: KitchenDisplayComponent,
  },
];

export default routes;
