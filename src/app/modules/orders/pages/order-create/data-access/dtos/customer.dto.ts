export type CustomerDto = Readonly<{
  id: number;
  name: string;
  mobile: string;
  email: string | null;
}>;

export type CreateCustomerDto = Readonly<{
  name: string;
  mobile: string;
  email?: string;
}>;
