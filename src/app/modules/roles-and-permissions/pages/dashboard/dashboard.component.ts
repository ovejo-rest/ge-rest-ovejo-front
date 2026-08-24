import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardMenuRoutesDto } from 'src/app/core/dtos';
import { CardComponent, HeaderDashboardComponent } from 'src/ui';
import { CheckPermissionDirective } from 'src/app/shared/directives';

type DashboardCard = CardMenuRoutesDto & { permission?: string };

@Component({
  selector: 'app-dashboard',
  imports: [HeaderDashboardComponent, RouterLink, CardComponent, CheckPermissionDirective],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  principalCards: Array<DashboardCard>;

  constructor() {
    const basePath = 'roles-and-permissions';
    this.principalCards = [
      {
        name: 'Módulos',
        description: 'Gestiona los módulos para los permisos.',
        route: `modules`,
        permission: 'modules:see-module',
      },
      {
        name: 'Permisos',
        description: 'Gestiona los permisos existentes en el sistema.',
        route: `permissions`,
        permission: 'permissions:view',
      },
      {
        name: 'Roles',
        description: 'Gestiona los roles que tendrá el sistema.',
        route: `roles`,
        permission: 'roles:view',
      },
      {
        name: 'Roles y permisos',
        description: 'Administra los roles y sus permisos respectivos.',
        route: `roles-permissions`,
        permission: 'roles-permissions:view',
      },
      {
        name: 'Usuarios y roles',
        description: 'Gestiona los roles que tendrá cada usuario.',
        route: `roles-user`,
        permission: 'users-roles:view',
      },
      {
        name: 'Usuarios',
        description: 'Gestiona los usuarios del sistema.',
        route: `users`,
        permission: 'users:view',
      },
    ];
  }
}
