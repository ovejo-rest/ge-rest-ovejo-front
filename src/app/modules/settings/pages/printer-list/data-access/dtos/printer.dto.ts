export type PrinterType = 'network' | 'usb';
export type PrinterStatus = 'ACTIVE' | 'INACTIVE';

export type PrinterDto = Readonly<{
  id: number;
  businessId: number;
  locationId: number | null;
  name: string;
  type: PrinterType;
  ipAddress: string | null;
  port: number | null;
  status: PrinterStatus;
  // Última vez que una estación de impresión pidió sus comandas (null: nunca).
  lastSeenAt: string | null;
}>;

export type CreatePrinterDto = Readonly<{
  name: string;
  type: PrinterType;
  // Obligatoria para impresoras de red.
  ipAddress?: string;
  port?: number;
  locationId?: number;
}>;

export type UpdatePrinterDto = Readonly<{
  id: number;
  name?: string;
  type?: PrinterType;
  ipAddress?: string;
  port?: number;
  locationId?: number;
  status?: PrinterStatus;
}>;
