export type CreateBusinessLocationDto = Readonly<{
  name: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  mobile?: string;
  email?: string;
}>;
