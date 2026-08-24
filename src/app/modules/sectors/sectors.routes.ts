import { Routes } from '@angular/router';
import { SectorListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: SectorListComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
];

export default routes;
