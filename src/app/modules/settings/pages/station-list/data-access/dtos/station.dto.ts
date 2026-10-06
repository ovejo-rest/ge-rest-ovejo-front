export type StationType = 'kitchen' | 'bar' | 'grill' | 'coffee';

export type StationDto = Readonly<{
  id: number;
  businessId: number;
  locationId: number | null;
  name: string;
  type: StationType;
  printerId: number | null;
  isActive: boolean;
}>;

export type CreateStationDto = Readonly<{
  name: string;
  type: StationType;
  locationId?: number;
  printerId?: number;
}>;

export type UpdateStationDto = Readonly<{
  id: number;
  name?: string;
  type?: StationType;
  locationId?: number;
  printerId?: number;
  isActive?: boolean;
}>;

export type StationProductDto = Readonly<{
  productId: number;
  productName: string;
  sku: string;
}>;
