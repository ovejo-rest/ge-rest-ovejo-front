import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatCurrency, formatRelative, ORDER_STATUS, StatusBadgeComponent } from 'src/app/modules/orders/pages/order-list/ui';
import { DashboardMetricsDto } from '../../data-access';

@Component({
  selector: 'app-recent-orders-card',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glass h-full overflow-hidden rounded-[1rem]">
      <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h2 class="text-foreground font-semibold">Pedidos recientes</h2>
        <a routerLink="/orders" class="text-primary text-xs font-medium hover:underline">Ver todos</a>
      </div>
      @if (!orders().length) {
      <p class="text-muted-foreground px-4 py-8 text-center text-sm">Sin pedidos en el período.</p>
      } @else {
      <ul class="divide-y divide-[var(--border)]">
        @for (order of orders(); track order.transactionId) {
        <li>
          <a [routerLink]="['/orders', order.transactionId]" class="glass-row flex items-center gap-3 px-4 py-2.5">
            <div class="min-w-0 flex-1">
              <p class="text-foreground text-sm font-medium">{{ order.tableName ?? 'Sin mesa' }} <span class="text-muted-foreground font-mono text-xs">{{ order.invoiceNo }}</span></p>
              <p class="text-muted-foreground text-xs">{{ formatRelative(order.createdAt) }}</p>
            </div>
            <app-status-badge [map]="orderStatus" [status]="order.status" />
            <span class="text-foreground w-24 text-right text-sm font-semibold tabular-nums">{{ formatCurrency(order.total) }}</span>
          </a>
        </li>
        }
      </ul>
      }
    </section>
  `,
})
export class RecentOrdersCardComponent {
  readonly orders = input.required<DashboardMetricsDto['recentOrders']>();
  readonly orderStatus = ORDER_STATUS;
  readonly formatCurrency = formatCurrency;
  readonly formatRelative = formatRelative;
}
