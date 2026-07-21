import { RoleDto } from '../../../roles/data-access';

export type UserRoleItemDto = RoleDto;

export type UserWithRolesDto = Readonly<{
  userId: string;
  fullName: string;
  email: string;
  restaurantId: number;
  branchId: number;
  roles: UserRoleItemDto[];
}>;
