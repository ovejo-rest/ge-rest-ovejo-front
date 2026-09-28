import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeConfig } from './order-badges';

const TONE_CLASSES: Record<BadgeConfig['tone'], { badge: string; dot: string }> = {
  green: { badge: 'bg-green-500/15 text-green-600', dot: 'bg-green-500' },
  amber: { badge: 'bg-amber-500/15 text-amber-600', dot: 'bg-amber-500' },
  blue: { badge: 'bg-blue-500/15 text-blue-600', dot: 'bg-blue-500' },
  red: { badge: 'bg-red-500/15 text-red-600', dot: 'bg-red-500' },
  gray: { badge: 'bg-gray-500/15 text-gray-500', dot: 'bg-gray-400' },
};

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let classes = $classes();
    <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium" [class]="classes.badge">
      <span class="h-1.5 w-1.5 rounded-full" [class]="classes.dot"></span>{{ $config().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  // Mapa de estados a mostrar (KITCHEN_STATUS, ORDER_STATUS o PAYMENT_STATUS) y el valor recibido del API.
  readonly map = input.required<Record<string, BadgeConfig>>();
  readonly status = input<string | null>(null);
  readonly fallback = input('Sin estado');

  readonly $config = computed<BadgeConfig>(
    () => (this.status() && this.map()[this.status()!]) || { label: this.fallback(), tone: 'gray' },
  );
  readonly $classes = computed(() => TONE_CLASSES[this.$config().tone]);
}
