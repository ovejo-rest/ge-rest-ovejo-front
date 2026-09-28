import { KitchenStatus } from '../../../order-list/data-access';

export type OrderStatus = 'ORDERED' | 'FINAL' | 'CANCELLED';
export type PaymentStatus = 'due' | 'partial' | 'paid';
export type DiscountType = 'fixed' | 'percentage';

export type OrderLineDto = Readonly<{
  lineId: number;
  productId: number;
  productName: string;
  variationId: number;
  variationName: string;
  quantity: number;
  unitPriceIncTax: number;
  itemTax: number;
  resServiceStaffId: string | null;
  resLineOrderStatus: KitchenStatus | null;
  sellLineNote: string | null;
}>;

export type OrderDetailDto = Readonly<{
  transactionId: number;
  invoiceNo: string;
  businessId: number;
  locationId: number;
  contactId: number | null;
  customerName: string | null;
  resTableId: number | null;
  tableName: string | null;
  resWaiterId: string | null;
  waiterName: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  resOrderStatus: KitchenStatus | null;
  isKitchenOrder: boolean;
  totalBeforeTax: number;
  discountType: DiscountType | null;
  discountAmount: number;
  taxAmount: number;
  finalTotal: number;
  netTotal: number;
  totalPaid: number;
  remaining: number;
  additionalNotes: string | null;
  staffNote: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  lines: OrderLineDto[];
}>;
