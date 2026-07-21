import { PermissionDto } from './permission.dto';

export type DeletePermissionDto = Readonly<Pick<PermissionDto, 'id'>>;
