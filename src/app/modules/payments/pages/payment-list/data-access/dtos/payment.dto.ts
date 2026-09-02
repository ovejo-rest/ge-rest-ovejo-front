export type PaymentDto = Readonly<{
  id: number;
  transactionId: number;
  invoiceNo?: string;
  amount: number;
  method: string | null;
  note: string | null;
  createdAt: Date;
}>;
