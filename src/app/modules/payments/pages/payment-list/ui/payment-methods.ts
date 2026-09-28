import { PaymentMethod } from '../data-access';

export type PaymentMethodOption = Readonly<{ value: PaymentMethod; label: string; icon: string }>;

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { value: 'cash', label: 'Efectivo', icon: 'payments' },
  { value: 'debit', label: 'Débito', icon: 'credit_card' },
  { value: 'credit', label: 'Crédito', icon: 'credit_score' },
  { value: 'transfer', label: 'Transferencia', icon: 'account_balance' },
  { value: 'other', label: 'Otro', icon: 'more_horiz' },
];

export function paymentMethodLabel(method: string | null): string {
  return PAYMENT_METHODS.find((option) => option.value === method)?.label ?? 'Sin método';
}

export function paymentMethodIcon(method: string | null): string {
  return PAYMENT_METHODS.find((option) => option.value === method)?.icon ?? 'help';
}
