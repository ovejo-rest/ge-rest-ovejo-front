export type KitchenStatus = 'received' | 'cooked' | 'served';
export type OrderStatus = 'ORDERED' | 'FINAL' | 'CANCELLED';
export type PaymentStatus = 'due' | 'partial' | 'paid';

export type OrderSummaryDto = Readonly<{
  transactionId: number;
  invoiceNo: string;
  tableName: string | null;
  resTableId: number | null;
  locationId: number;
  waiterName: string | null;
  customerName: string | null;
  contactId: number | null;
  orderDate: string;
  resOrderStatus: KitchenStatus | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  finalTotal: number;
}>;

// dateFrom/dateTo en formato YYYY-MM-DD; el backend los interpreta en la zona horaria del negocio.
export type OrderFiltersDto = Readonly<{
  page: number;
  perPage: number;
  serviceStaff?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  resTableId?: number;
  locationId?: number;
}>;
