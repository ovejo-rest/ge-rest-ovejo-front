export type TableStatus = 'available' | 'occupied' | 'reserved' | 'blocked';

export type TableDto = Readonly<{
  id: number;
  name: string;
  location: string;
  description: string | null;
  capacity: number;
  status: TableStatus;
  qrCode: string | null;
  // URL de la carta digital que se codifica en el QR (ej. https://app.redom.cl/carta/{qrCode}); null si no hay.
  qrUrl: string | null;
  sectorId: number | null;
  // Pedido abierto más reciente de la mesa (el que se abre al tocarla) y todos los abiertos.
  currentTransactionId: number | null;
  openTransactionIds: number[];
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
