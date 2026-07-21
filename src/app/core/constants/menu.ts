import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'dashboard',
          label: 'Dashboard',
          route: '/dashboard',
          children: [{ label: 'Admin', route: '/dashboard/admin' }],
        },
        {
          icon: 'admin_panel_settings',
          label: 'Roles y permisos',
          route: '/roles-and-permissions',
          children: [
            { label: 'Módulos', route: '/roles-and-permissions/modules', permission: 'modules:see-modules' },
            { label: 'Permisos', route: '/roles-and-permissions/permissions', permission: 'permissions:see-module' },
            { label: 'Roles', route: '/roles-and-permissions/roles', permission: 'roles:see-module' },
            {
              label: 'Roles y permisos',
              route: '/roles-and-permissions/roles-permissions',
              icon: 'home',
              permission: 'roles-permissions:see-module',
            },
            {
              label: 'Usuarios y roles',
              route: '/roles-and-permissions/roles-user',
              permission: 'users-roles:see-module',
            },
            {
              label: 'Usuarios',
              route: '/roles-and-permissions/users',
              permission: 'users:see-module',
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errors',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Components',
          route: '/components',
          children: [{ label: 'Table', route: '/components/table' }],
        },
      ],
    },
    {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'download',
          label: 'Download',
          route: '/download',
        },
        {
          icon: 'credit_card',
          label: 'Gift Card',
          route: '/gift',
        },
        {
          icon: 'groups',
          label: 'Users',
          route: '/users',
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'settings',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'notifications',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'folder',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },
  ];
}
