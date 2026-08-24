import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.routes'),
  },
  {
    path: 'components/table',
    component: LayoutComponent,
    loadChildren: () => import('../uim/uim.routes'),
  },
  {
    path: 'components',
    component: LayoutComponent,
    loadChildren: () => import('../uikit/uikit.routes'),
  },
  {
    path: 'roles-and-permissions',
    component: LayoutComponent,
    loadChildren: () => import('../roles-and-permissions/roles-and-permissions.routes'),
  },
  {
    path: 'business',
    component: LayoutComponent,
    loadChildren: () => import('../restaurante/restaurante.routes'),
  },
  {
    path: 'orders',
    component: LayoutComponent,
    loadChildren: () => import('../orders/orders.routes'),
  },
  {
    path: 'tables',
    component: LayoutComponent,
    loadChildren: () => import('../tables/tables.routes'),
  },
  {
    path: 'sectors',
    component: LayoutComponent,
    loadChildren: () => import('../sectors/sectors.routes'),
  },
  {
    path: 'profile',
    component: LayoutComponent,
    loadChildren: () => import('../profile/profile.routes'),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

export default routes;
