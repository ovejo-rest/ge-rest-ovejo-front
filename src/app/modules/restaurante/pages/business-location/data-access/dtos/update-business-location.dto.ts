export type UpdateBusinessLocationDto = Readonly<{
  id: number;
  name?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  mobile?: string;
  email?: string;
  website?: string;
}>;
