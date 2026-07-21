import { PermissionDto } from '../../../permissions/data-access';

export type RolePermissionDto = PermissionDto;

export type AssignPermissionsDto = Readonly<{
  permissionIds: number[];
}>;
