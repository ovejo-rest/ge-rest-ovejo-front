import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationMeta } from 'src/app/core/standarized-response/standardized-pagination/pagination-meta.dto';
import { IconComponent, PaginationTableComponent, SkeletonComponent } from 'src/ui';
import { OrderSummaryDto } from '../../data-access';
import { formatDateTime, formatRelative, KITCHEN_STATUS, StatusBadgeComponent } from '../../ui';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [RouterLink, IconComponent, SkeletonComponent, PaginationTableComponent, StatusBadgeComponent],
  templateUrl: './orders-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersTableComponent {
  readonly orders = input.required<OrderSummaryDto[]>();
  readonly loading = input(false);
  readonly pagination = input<PaginationMeta | null>(null);
  readonly hasFilters = input(false);

  readonly pageChange = output<number>();
  readonly clearFilters = output<void>();

  readonly kitchenStatus = KITCHEN_STATUS;
  readonly skeletonRows = [1, 2, 3, 4, 5];
  readonly formatDateTime = formatDateTime;
  readonly formatRelative = formatRelative;
}
