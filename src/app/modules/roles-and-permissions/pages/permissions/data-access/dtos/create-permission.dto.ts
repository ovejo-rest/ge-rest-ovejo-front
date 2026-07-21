import { PermissionDto } from './permission.dto';

export type CreatePermissionDto = Readonly<
  Pick<PermissionDto, 'moduleId'> & {
    code: string;
    name: string;
  }
>;
