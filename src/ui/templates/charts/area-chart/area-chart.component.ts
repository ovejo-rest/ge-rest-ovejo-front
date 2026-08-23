import { Component, effect, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { ChartOptions } from '../options';
import { ThemeService } from 'src/app/core/services/theme.service';
import { BadgeComponent, IconComponent } from 'src/ui/atoms';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-area-chart',
  imports: [NgApexchartsModule, BadgeComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './area-chart.component.html',
})
export class AreaChartComponent {
  public $chartOptions: Partial<ChartOptions>;
  public data = [2100, 3200, 3200, 2400, 2400, 1800, 1800, 2400, 2400, 3200, 3200, 3000];
  public categories = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  public $history = [this.data, this.categories];
  constructor(private $themeService: ThemeService) {
    let baseColor = '#FFFFFFF';

    this.$chartOptions = {
      series: [
        {
          name: 'Ventas',
          data: this.data,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 150,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.2,
          stops: [15, 120, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor], // line color
      },
      xaxis: {
        categories: this.categories,
        labels: {
          show: false,
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 4,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      colors: [baseColor], //line colors
    };

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      this.$chartOptions.tooltip = {
        theme: this.$themeService.theme().mode as 'light' | 'dark',
      };
      this.$chartOptions.colors = [primaryColor];
      this.$chartOptions.stroke!.colors = [primaryColor];
      this.$chartOptions.xaxis!.crosshairs!.stroke!.color = primaryColor;
    });
  }

  getVariationPercentage(): string {
    const last = this.data[this.data.length - 1];
    const prev = this.data[this.data.length - 2];
    if (!prev) return '—';
    const variation = ((last - prev) / prev) * 100;
    return variation.toFixed(2).replace('.', ','); // ejemplo: 9,23
  }
}
