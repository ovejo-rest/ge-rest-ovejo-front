import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { OrderStatus, PaymentStatus, ServiceStaffDto } from '../../data-access';
import { ORDER_STATUS, PAYMENT_STATUS } from '../order-badges';

export type OrderListFilters = Readonly<{
  waiter: string | null;
  status: OrderStatus | null;
  payment: PaymentStatus | null;
  from: string | null;
  to: string | null;
  location: number | null;
  table: number | null;
}>;

export type FilterOption = Readonly<{ id: number; name: string }>;

@Component({
  selector: 'app-filters-order-table',
  templateUrl: './filters-order-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersOrderTableComponent {
  readonly staff = input<ServiceStaffDto[]>([]);
  readonly locations = input<FilterOption[]>([]);
  readonly tables = input<FilterOption[]>([]);
  readonly filters = input.required<OrderListFilters>();

  // Emite solo lo que cambió; el padre lo mezcla con los query params.
  readonly filtersChange = output<Partial<OrderListFilters>>();
  readonly clearFilters = output<void>();

  readonly statusOptions = Object.entries(ORDER_STATUS).map(([value, config]) => ({ value, label: config.label }));
  readonly paymentOptions = Object.entries(PAYMENT_STATUS).map(([value, config]) => ({ value, label: config.label }));

  readonly $hasFilters = computed(() => Object.values(this.filters()).some((value) => value !== null));

  onWaiterChange(event: Event) {
    this.filtersChange.emit({ waiter: this.readValue(event) });
  }

  onStatusChange(event: Event) {
    this.filtersChange.emit({ status: this.readValue(event) as OrderStatus | null });
  }

  onPaymentChange(event: Event) {
    this.filtersChange.emit({ payment: this.readValue(event) as PaymentStatus | null });
  }

  // Al cambiar de sucursal, la mesa elegida deja de aplicar.
  onLocationChange(event: Event) {
    const value = this.readValue(event);
    this.filtersChange.emit({ location: value ? Number(value) : null, table: null });
  }

  onTableChange(event: Event) {
    const value = this.readValue(event);
    this.filtersChange.emit({ table: value ? Number(value) : null });
  }

  onFromChange(event: Event) {
    this.filtersChange.emit({ from: this.readValue(event) });
  }

  onToChange(event: Event) {
    this.filtersChange.emit({ to: this.readValue(event) });
  }

  private readValue(event: Event): string | null {
    return (event.target as HTMLInputElement | HTMLSelectElement).value || null;
  }
}
