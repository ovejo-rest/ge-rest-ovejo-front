export type StationDto = Readonly<{
  id: number;
  businessId: number;
  locationId: number | null;
  name: string;
  type: string;
  printerId: number | null;
  isActive: boolean;
}>;
