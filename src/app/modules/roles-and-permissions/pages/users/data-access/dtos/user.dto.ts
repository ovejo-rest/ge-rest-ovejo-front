export type UserDto = Readonly<{
  code: string;
  rut: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  email: string;
  statusId: number;
  statusCode: string;
  // Sucursal (business location) del usuario; null = sin sucursal.
  branchId: number | null;
  // Tiene PIN del POS asignado (el PIN nunca viaja).
  hasPin: boolean;
}>;
