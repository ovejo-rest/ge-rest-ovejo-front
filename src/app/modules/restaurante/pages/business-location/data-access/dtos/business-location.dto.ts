export type BusinessLocationDto = Readonly<{
  id: number;
  businessId: number;
  locationId: string;
  name: string;
  landmark: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  createdAt: Date;
}>;
