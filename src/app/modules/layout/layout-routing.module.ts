import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { RolesAndPermissionsComponent } from '../roles-and-permissions/roles-and-permissions.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'components/table',
    component: LayoutComponent,
    loadChildren: () => import('../uim/uim.module').then((m) => m.UimModule),
  },
  {
    path: 'components',
    component: LayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
  },
  {
    path: 'roles-and-permissions',
    component: LayoutComponent,
    loadChildren: () =>
      import('../roles-and-permissions/roles-and-permissions.module').then((m) => m.RolesAndPermissionsModule),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
