import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ThemeService } from 'src/app/core/services/theme.service';
import { formatCurrency } from 'src/app/modules/orders/pages/order-list/ui';
import { compactCurrency, readChartTheme } from '../chart-theme';

export type SalesByDayPoint = Readonly<{ date: string; sales: number; orders: number }>;

const dayLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });

@Component({
  selector: 'app-sales-by-day-chart',
  standalone: true,
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glass-tile-soft h-full rounded-2xl p-4">
      <div class="mb-2 flex items-baseline justify-between gap-2">
        <h2 class="text-foreground font-semibold">Ventas por día</h2>
        <span class="text-muted-foreground text-xs tabular-nums">Total {{ formatCurrency($total()) }}</span>
      </div>
      @if (days().length < 2) {
      <p class="text-muted-foreground py-10 text-center text-sm">Elige un período de 2 días o más para ver la tendencia.</p>
      } @else {
      @let options = $options();
      <apx-chart
        [series]="options.series"
        [chart]="options.chart"
        [colors]="options.colors"
        [stroke]="options.stroke"
        [fill]="options.fill"
        [markers]="options.markers"
        [dataLabels]="options.dataLabels"
        [xaxis]="options.xaxis"
        [yaxis]="options.yaxis"
        [grid]="options.grid"
        [tooltip]="options.tooltip" />
      }
    </section>
  `,
})
export class SalesByDayChartComponent {
  readonly days = input.required<ReadonlyArray<SalesByDayPoint>>();

  private readonly themeService = inject(ThemeService);
  readonly formatCurrency = formatCurrency;

  readonly $total = computed(() => this.days().reduce((sum, day) => sum + day.sales, 0));

  readonly $options = computed(() => {
    const days = this.days();
    const theme = readChartTheme(this.themeService.theme().mode as 'light' | 'dark');
    const axisLabels = { style: { colors: theme.muted, fontSize: '11px' } };
    return {
      series: [{ name: 'Ventas', data: days.map((day) => day.sales) }],
      chart: { type: 'area' as const, height: 240, fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
      colors: [theme.primary],
      stroke: { curve: 'smooth' as const, width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 95, 100] } },
      markers: { size: days.length <= 14 ? 4 : 0, strokeWidth: 2, strokeColors: theme.primary, hover: { size: 6 } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: days.map((day) => dayLabel(day.date)),
        labels: { ...axisLabels, rotate: 0, hideOverlappingLabels: true },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: { min: 0, forceNiceScale: true, labels: { ...axisLabels, formatter: compactCurrency } },
      grid: { borderColor: theme.border, strokeDashArray: 4, xaxis: { lines: { show: false } } },
      tooltip: {
        theme: theme.mode,
        y: {
          // Además del monto, la cantidad de pedidos del día.
          formatter: (value: number, opts?: { dataPointIndex: number }) =>
            `${formatCurrency(value)} · ${days[opts?.dataPointIndex ?? -1]?.orders ?? 0} pedidos`,
        },
      },
    };
  });
}
