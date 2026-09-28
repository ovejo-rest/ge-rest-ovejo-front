import { PaymentMethod } from './payment.dto';

export type CreatePaymentDto = Readonly<{
  transactionId: number;
  amount: number;
  method: PaymentMethod;
  tipAmount?: number;
  // Solo para efectivo: debe cubrir amount + tipAmount.
  amountTendered?: number;
  note?: string;
}>;

export type CreatePaymentResponseDto = Readonly<{
  id: number;
  success: boolean;
  changeAmount: number;
  paymentStatus: 'due' | 'partial' | 'paid';
  remaining: number;
}>;

export type CancelPaymentDto = Readonly<{
  id: number;
  reason: string;
}>;
