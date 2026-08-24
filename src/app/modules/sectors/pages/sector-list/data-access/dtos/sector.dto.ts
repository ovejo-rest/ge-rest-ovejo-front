export type SectorDto = Readonly<{
  id: number;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}>;

export type CreateSectorDto = Readonly<{
  name: string;
  description?: string;
  color?: string;
}>;

export type UpdateSectorDto = Readonly<{
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}>;
