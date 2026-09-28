export type KitchenStatus = 'received' | 'cooked' | 'served';

export type OrderSummaryDto = Readonly<{
  transactionId: number;
  invoiceNo: string;
  tableName: string | null;
  waiterName: string | null;
  orderDate: string;
  resOrderStatus: KitchenStatus | null;
}>;

export type OrderFiltersDto = Readonly<{
  page: number;
  perPage: number;
  serviceStaff?: string;
}>;
