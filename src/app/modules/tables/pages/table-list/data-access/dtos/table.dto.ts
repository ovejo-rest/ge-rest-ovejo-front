export type TableStatus = 'available' | 'occupied' | 'reserved' | 'blocked';

export type TableDto = Readonly<{
  id: number;
  name: string;
  location: string;
  description: string | null;
  capacity: number;
  status: TableStatus;
  qrCode: string | null;
  sectorId: number | null;
}>;

export type CreateTableDto = Readonly<{
  name: string;
  description?: string;
  locationId: number;
  capacity?: number;
  sectorId?: number;
}>;

export type UpdateTableDto = Readonly<{
  id: number;
  name?: string;
  description?: string;
  capacity?: number;
  status?: TableStatus;
  sectorId?: number;
}>;
