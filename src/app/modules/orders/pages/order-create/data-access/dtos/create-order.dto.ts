import { DiscountType } from '../../../order-detail/data-access';

export type OrderProductDto = Readonly<{
  productId: number;
  variationId: number;
  quantity: number;
}>;

export type CreateOrderDto = Readonly<{
  locationId: number;
  contactId?: number;
  products: OrderProductDto[];
  resTableId?: number;
  resWaiterId?: string;
  isKitchenOrder?: boolean;
  discountType?: DiscountType;
  discountAmount?: number;
  additionalNotes?: string;
  // Nota que se imprime en la comanda.
  staffNote?: string;
}>;

export type CreateOrderResponseDto = Readonly<{
  transactionId: number;
  invoiceNo: string;
  printJobIds: number[];
}>;

export type AddOrderLinesDto = Readonly<{
  orderId: number;
  products: OrderProductDto[];
  // Notas de lo agregado: se suman a la nota actual del pedido (staffNote).
  note?: string;
  currentNote?: string | null;
}>;
