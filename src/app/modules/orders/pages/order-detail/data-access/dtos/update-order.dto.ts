import { DiscountType } from './order-detail.dto';

export type UpdateOrderDto = Readonly<{
  id: number;
  resTableId?: number;
  resWaiterId?: string;
  discountType?: DiscountType;
  discountAmount?: number;
  additionalNotes?: string;
  staffNote?: string;
}>;
