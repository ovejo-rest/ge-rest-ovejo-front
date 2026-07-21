import { PermissionDto } from './permission.dto';

export type UpdatePermissionDto = Readonly<
  Pick<PermissionDto, 'id'> & {
    name: string;
  }
>;
