import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'admin', component: AdminComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

export default routes;
