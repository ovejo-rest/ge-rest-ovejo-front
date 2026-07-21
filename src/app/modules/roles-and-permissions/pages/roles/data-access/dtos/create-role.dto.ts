import { RoleDto } from './role.dto';

export type CreateRoleDto = Readonly<Pick<RoleDto, 'code' | 'name'>>;
