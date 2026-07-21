export type WhoamiDto = Readonly<{
  user: {
    code: string;
    rut: string;
    name: string;
    fatherLastName: string;
    motherLastName: string;
    email: string;
    statusCode: string;
    restaurantId: number;
    branchId: number;
  };
  roles: ReadonlyArray<{ id: number; code: string; name: string }>;
  permissions: string[];
}>;
