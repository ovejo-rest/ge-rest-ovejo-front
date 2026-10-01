export type WhoamiDto = Readonly<{
  user: {
    code: string;
    rut: string;
    name: string;
    fatherLastName: string;
    motherLastName: string;
    email: string;
    statusCode: string;
    // null mientras el usuario no tenga negocio (va al onboarding).
    restaurantId: number | null;
    branchId: number | null;
  };
  roles: ReadonlyArray<{ id: number; code: string; name: string }>;
  permissions: string[];
}>;
