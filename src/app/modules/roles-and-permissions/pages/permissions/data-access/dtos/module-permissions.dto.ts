import { PermissionDto } from './permission.dto';

export type ModulePermissionsDto = Readonly<{
  moduleId: number;
  moduleName: string;
  permissions: ReadonlyArray<Omit<PermissionDto, 'moduleId' | 'moduleName'>>;
}>;
