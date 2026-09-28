import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCurrency } from '../../../order-list/ui';
import { OrderDetailDto } from '../../data-access';

@Component({
  selector: 'app-order-totals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-totals.component.html',
})
export class OrderTotalsComponent {
  readonly order = input.required<OrderDetailDto>();

  readonly formatCurrency = formatCurrency;
  readonly $discount = computed(() => this.order().totalBeforeTax - this.order().finalTotal);
  readonly $discountLabel = computed(() => {
    const { discountType, discountAmount } = this.order();
    return discountType === 'percentage' ? `Descuento (${discountAmount}%)` : 'Descuento';
  });
}
