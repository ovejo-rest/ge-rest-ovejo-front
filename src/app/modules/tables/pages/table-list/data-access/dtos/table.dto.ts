export type TableStatus = 'available' | 'occupied' | 'reserved' | 'blocked';

export type TableDto = Readonly<{
  id: number;
  name: string;
  capacity: number;
  sectorId: number;
  sectorName: string;
  sectorColor: string;
  status: TableStatus;
  isActive: boolean;
}>;

export type CreateTableDto = Readonly<{
  name: string;
  capacity: number;
  sectorId: number;
}>;

export type UpdateTableDto = Readonly<{
  name?: string;
  capacity?: number;
  sectorId?: number;
  status?: TableStatus;
  isActive?: boolean;
}>;
