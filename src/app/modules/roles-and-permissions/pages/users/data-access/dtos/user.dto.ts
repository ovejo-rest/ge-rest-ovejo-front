export type UserDto = Readonly<{
  code: string;
  rut: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  email: string;
  statusId: number;
  statusCode: string;
}>;
