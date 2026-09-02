import { PaymentMethod } from './payment-method.enum';

export type CreatePaymentDto = Readonly<{
  transactionId: number;
  amount: number;
  method: PaymentMethod;
  note?: string;
}>;
