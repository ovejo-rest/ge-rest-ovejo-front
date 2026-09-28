export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'transfer' | 'other';

export type PaymentDto = Readonly<{
  id: number;
  transactionId: number;
  // Solo viene en el listado general (GET /payments/all).
  invoiceNo?: string;
  amount: number;
  method: PaymentMethod | null;
  note: string | null;
  createdAt: string;
  tipAmount: number;
  amountTendered: number | null;
  changeAmount: number;
  cancelled: boolean;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
}>;

export type PaymentFiltersDto = Readonly<{
  page: number;
  perPage: number;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  includeCancelled?: boolean;
}>;
