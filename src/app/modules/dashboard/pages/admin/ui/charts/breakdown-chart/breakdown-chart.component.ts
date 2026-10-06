import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ThemeService } from 'src/app/core/services/theme.service';
import { formatCurrency } from 'src/app/modules/orders/pages/order-list/ui';
import { compactCurrency, readChartTheme } from '../chart-theme';

// Una barra por ítem; detail se muestra en el tooltip (ej. "12 u", "8 pagos").
export type BreakdownItem = Readonly<{ label: string; value: number; detail?: string }>;

// Barras horizontales de un solo color, ordenadas de mayor a menor (categorías, métodos de pago).
@Component({
  selector: 'app-breakdown-chart',
  standalone: true,
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glass-tile-soft h-full rounded-2xl p-4">
      <h2 class="text-foreground mb-2 font-semibold">{{ title() }}</h2>
      @if (!$items().length) {
      <p class="text-muted-foreground py-8 text-center text-sm">{{ emptyText() }}</p>
      } @else {
      @let options = $options();
      <apx-chart
        [series]="options.series"
        [chart]="options.chart"
        [colors]="options.colors"
        [plotOptions]="options.plotOptions"
        [dataLabels]="options.dataLabels"
        [xaxis]="options.xaxis"
        [yaxis]="options.yaxis"
        [grid]="options.grid"
        [tooltip]="options.tooltip"
        [states]="options.states" />
      }
    </section>
  `,
})
export class BreakdownChartComponent {
  readonly title = input.required<string>();
  readonly items = input.required<ReadonlyArray<BreakdownItem>>();
  readonly seriesName = input('Monto');
  readonly emptyText = input('Sin datos en el período.');

  private readonly themeService = inject(ThemeService);

  readonly $items = computed(() => [...this.items()].filter((item) => item.value > 0).sort((a, b) => b.value - a.value));

  readonly $options = computed(() => {
    const items = this.$items();
    const theme = readChartTheme(this.themeService.$resolvedMode());
    const axisLabels = { style: { colors: theme.muted, fontSize: '12px' } };
    return {
      series: [{ name: this.seriesName(), data: items.map((item) => item.value) }],
      chart: {
        type: 'bar' as const,
        height: Math.max(140, items.length * 40 + 40),
        fontFamily: 'inherit',
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: [theme.primary],
      plotOptions: { bar: { horizontal: true, barHeight: '60%', borderRadius: 4, borderRadiusApplication: 'end' as const } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: items.map((item) => item.label),
        labels: { ...axisLabels, formatter: (value: string) => compactCurrency(Number(value)) },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { ...axisLabels, maxWidth: 140 } },
      grid: { borderColor: theme.border, strokeDashArray: 4, yaxis: { lines: { show: false } }, xaxis: { lines: { show: true } } },
      states: { hover: { filter: { type: 'darken' as const } } },
      tooltip: {
        theme: theme.mode,
        y: {
          formatter: (value: number, opts?: { dataPointIndex: number }) => {
            const detail = items[opts?.dataPointIndex ?? -1]?.detail;
            return detail ? `${formatCurrency(value)} · ${detail}` : formatCurrency(value);
          },
        },
      },
    };
  });
}
