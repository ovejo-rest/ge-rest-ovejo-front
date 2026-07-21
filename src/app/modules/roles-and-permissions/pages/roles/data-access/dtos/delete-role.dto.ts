import { RoleDto } from './role.dto';

export type DeleteRoleDto = Readonly<Pick<RoleDto, 'id'>>;
