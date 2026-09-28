import { Component, input, output } from '@angular/core';
import { PaymentMethod } from '../../data-access';
import { PAYMENT_METHODS } from '../payment-methods';

export type PaymentTableFilters = Readonly<{
  method: PaymentMethod | null;
  from: string | null;
  to: string | null;
  includeCancelled: boolean;
}>;

@Component({
  selector: 'app-filters-payment-table',
  templateUrl: './filters-payment-table.component.html',
})
export class FiltersPaymentTableComponent {
  readonly filters = input.required<PaymentTableFilters>();
  readonly hasFilters = input(false);
  readonly filtersChange = output<Partial<PaymentTableFilters>>();
  readonly clear = output<void>();

  readonly methods = PAYMENT_METHODS;

  onMethod(event: Event) {
    const value = (event.target as HTMLSelectElement).value as PaymentMethod | '';
    this.filtersChange.emit({ method: value || null });
  }

  onDate(field: 'from' | 'to', event: Event) {
    this.filtersChange.emit({ [field]: (event.target as HTMLInputElement).value || null });
  }

  onIncludeCancelled(event: Event) {
    this.filtersChange.emit({ includeCancelled: (event.target as HTMLInputElement).checked });
  }
}
