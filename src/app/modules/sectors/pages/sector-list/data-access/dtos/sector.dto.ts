export type SectorDto = Readonly<{
  id: number;
  businessId: number;
  locationId: number | null;
  locationName?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type CreateSectorDto = Readonly<{
  name: string;
  locationId: number;
}>;

export type UpdateSectorDto = Readonly<{
  name?: string;
}>;
