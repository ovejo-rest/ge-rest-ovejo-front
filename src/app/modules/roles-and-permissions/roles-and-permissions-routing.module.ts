import { RouterModule, Routes } from '@angular/router';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';
import { authGuard } from 'src/app/core';
import { NgModule } from '@angular/core';
import {
  DashboardComponent,
  ModulesComponent,
  PermissionsComponent,
  RolesComponent,
  RolesPermissionsComponent,
  RolesUserComponent,
  UsersComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: RolesAndPermissionsComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'modules',
        component: ModulesComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
      },
      {
        path: 'roles-permissions',
        component: RolesPermissionsComponent,
      },
      {
        path: 'roles-user',
        component: RolesUserComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesAndPermissionsRoutingModule {}
