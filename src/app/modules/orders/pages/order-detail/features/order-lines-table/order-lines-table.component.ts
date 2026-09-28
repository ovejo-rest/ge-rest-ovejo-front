import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from 'src/ui';
import { formatCurrency, KITCHEN_STATUS, StatusBadgeComponent } from '../../../order-list/ui';
import { OrderLineDto } from '../../data-access';

@Component({
  selector: 'app-order-lines-table',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent],
  templateUrl: './order-lines-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderLinesTableComponent {
  readonly lines = input.required<OrderLineDto[]>();
  readonly canServe = input(false);
  readonly showKitchenStatus = input(true);
  readonly pendingLineId = input<number | null>(null);

  readonly serveLine = output<OrderLineDto>();

  readonly kitchenStatus = KITCHEN_STATUS;
  readonly formatCurrency = formatCurrency;

  // Los productos sin variaciones reales usan la variación "DUMMY", que no se muestra.
  variationLabel(line: OrderLineDto): string | null {
    return line.variationName && line.variationName !== 'DUMMY' ? line.variationName : null;
  }
}
