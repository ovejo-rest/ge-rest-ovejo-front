export type CreateUserDto = Readonly<{
  rut: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  email: string;
  roleIds?: number[];
  // Sucursal del restaurante; el backend responde 404 si no le pertenece.
  branchId?: number;
}>;
