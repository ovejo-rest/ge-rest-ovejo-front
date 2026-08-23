import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { CardComponent, IconComponent, SkeletonComponent } from 'src/ui';

export type KpiFormat = 'currency' | 'number' | 'percentage';

@Component({
  selector: 'app-kpi-card',
  imports: [CardComponent, IconComponent, SkeletonComponent, CurrencyPipe, DecimalPipe, PercentPipe],
  templateUrl: './kpi-card.component.html',
})
export class KpiCardComponent {
  readonly $title = input.required<string>({ alias: 'title' });
  readonly $value = input.required<number>({ alias: 'value' });
  readonly $icon = input.required<string>({ alias: 'icon' });
  readonly $loading = input(false, { alias: 'loading' });
  readonly $format = input<KpiFormat>('number', { alias: 'format' });
  readonly $trend = input<number | undefined>(undefined, { alias: 'trend' });
  readonly $currency = input<string>('CLP', { alias: 'currency' });
  readonly $locale = input<string>('es-CL', { alias: 'locale' });
}
