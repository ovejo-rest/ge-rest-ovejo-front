export const Permission = {
  AUTH: {
    MODULES: {
      SEE_MODULE: 'modules:see-modules',
      GET_ALL_MODULES: 'modules:get-all-modules',
      UPDATE_MODULE: 'modules:update-module',
      DELETE_MODULE: 'modules:delete-module',
      CREATE_MODULE: 'modules:create-module',
    },
    PERMISSIONS: {
      SEE_MODULE: 'permissions:see-module',
      GET_ALL_PERMISSIONS: 'permissions:get-all-permissions',
      CREATE_PERMISSION: 'permissions:create-permission',
      DELETE_PERMISSION: 'permissions:delete-permission',
      UPDATE_PERMISSION: 'permissions:update-permission',
    },
    ROLES: {
      SEE_MODULE: 'roles:see-module',
      UPDATE_ROLE: 'roles:update-role',
      CREATE_ROLE: 'roles:create-role',
      DELETE_ROLE: 'roles:delete-role',
      GET_ALL_ROLES: 'roles:get-all-roles',
    },
    ROLES_PERMISSIONS: {
      SEE_MODULE: 'roles-permissions:see-module',
      ASSIGN_PERMISSION: 'roles-permissions:assign-permissions',
    },
    USER_ROLES: {
      SEE_MODULE: 'users-roles:see-module',
      ASSIGN_ROLE: 'users-roles:assign-roles',
    },
    USERS: {
      CREATE_USER: 'users:create-user',
      DELETE_USER: 'users:delete-user',
      UPDATE_USER: 'users:update-user',
      SEE_MODULE: 'users:see-module',
      GET_ALL_USERS: 'users:get-all-users',
    },
  },
} as const;

type ExtractPermissions<TPermission> = TPermission extends {
  [key: string]: infer PossibleCode;
}
  ? PossibleCode extends string
    ? PossibleCode
    : ExtractPermissions<PossibleCode>
  : never;

export type Permission = ExtractPermissions<typeof Permission>;
