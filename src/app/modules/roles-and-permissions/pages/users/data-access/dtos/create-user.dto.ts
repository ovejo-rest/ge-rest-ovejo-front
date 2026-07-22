export type CreateUserDto = Readonly<{
  rut: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  email: string;
  roleIds?: number[];
}>;
