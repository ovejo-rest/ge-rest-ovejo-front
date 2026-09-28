import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCurrency } from 'src/app/modules/orders/pages/order-list/ui';
import { DashboardMetricsDto } from '../../data-access';

@Component({
  selector: 'app-top-products-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glass h-full rounded-[1rem] p-4">
      <h2 class="text-foreground mb-3 font-semibold">Productos más vendidos</h2>
      @if (!products().length) {
      <p class="text-muted-foreground py-8 text-center text-sm">Sin ventas en el período.</p>
      } @else {
      <ol class="space-y-3">
        @for (product of products(); track product.productId; let index = $index) {
        <li>
          <div class="mb-1 flex items-baseline justify-between gap-2 text-sm">
            <span class="text-foreground truncate font-medium">{{ index + 1 }}. {{ product.productName }}</span>
            <span class="text-muted-foreground shrink-0 tabular-nums">{{ product.quantity }} u · {{ formatCurrency(product.revenue) }}</span>
          </div>
          <div class="bg-muted/30 h-2 overflow-hidden rounded-full" role="presentation">
            <div class="bg-primary h-full rounded-full" [style.width.%]="(product.quantity / $max()) * 100"></div>
          </div>
        </li>
        }
      </ol>
      }
    </section>
  `,
})
export class TopProductsCardComponent {
  readonly products = input.required<DashboardMetricsDto['topProducts']>();
  readonly formatCurrency = formatCurrency;
  readonly $max = computed(() => Math.max(1, ...this.products().map((product) => product.quantity)));
}
