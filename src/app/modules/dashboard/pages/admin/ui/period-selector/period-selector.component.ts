import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PERIOD_PRESETS, PeriodPreset } from './period';

@Component({
  selector: 'app-period-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex flex-wrap gap-1" role="tablist" aria-label="Período">
        @for (option of presets; track option.value) {
        <button type="button" role="tab" class="rounded-full px-3 py-1.5 text-sm font-medium" [class]="preset() === option.value ? 'bg-primary text-white' : 'glass-row text-foreground'" [attr.aria-selected]="preset() === option.value" (click)="presetChange.emit(option.value)">
          {{ option.label }}
        </button>
        }
      </div>
      <div class="flex items-center gap-1 text-sm">
        <input type="date" aria-label="Desde" class="glass-input h-9 rounded-md px-2" [value]="from()" [max]="to()" (change)="onDate('from', $event)" />
        <span class="text-muted-foreground">–</span>
        <input type="date" aria-label="Hasta" class="glass-input h-9 rounded-md px-2" [value]="to()" [min]="from()" (change)="onDate('to', $event)" />
      </div>
    </div>
  `,
})
export class PeriodSelectorComponent {
  readonly preset = input.required<PeriodPreset>();
  readonly from = input.required<string>();
  readonly to = input.required<string>();

  readonly presetChange = output<PeriodPreset>();
  readonly customChange = output<{ from: string; to: string }>();

  readonly presets = PERIOD_PRESETS;

  onDate(field: 'from' | 'to', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    const range = { from: this.from(), to: this.to(), [field]: value };
    if (range.from > range.to) range[field === 'from' ? 'to' : 'from'] = value;
    this.customChange.emit(range);
  }
}
