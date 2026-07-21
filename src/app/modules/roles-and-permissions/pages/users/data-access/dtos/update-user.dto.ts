export type UpdateUserDto = Readonly<{
  userId: string;
  name?: string;
  fatherLastName?: string;
  motherLastName?: string;
  email?: string;
  statusId?: number;
  branchId?: number;
}>;
