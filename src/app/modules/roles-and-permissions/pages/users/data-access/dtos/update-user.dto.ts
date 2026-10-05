export type UpdateUserDto = Readonly<{
  userId: string;
  name?: string;
  fatherLastName?: string;
  motherLastName?: string;
  email?: string;
  statusId?: number;
  // null = quitar la sucursal.
  branchId?: number | null;
}>;
