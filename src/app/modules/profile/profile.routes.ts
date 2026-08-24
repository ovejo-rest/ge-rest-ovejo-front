import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
];

export default routes;
