import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from 'src/ui';

export type PrintLogEntry = Readonly<{
  id: string;
  at: Date;
  title: string;
  detail: string;
  result: 'printed' | 'failed' | 'test';
}>;

@Component({
  selector: 'app-print-log',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass rounded-[1rem] p-4">
      <h3 class="text-foreground mb-3 font-semibold">Actividad reciente</h3>
      @if (!entries().length) {
      <p class="text-muted-foreground py-6 text-center text-sm">Todavía no se ha impreso nada en esta sesión.</p>
      } @else {
      <ul class="divide-y divide-[var(--border)]">
        @for (entry of entries(); track entry.id) {
        <li class="flex items-center gap-3 py-2">
          <app-icon class="h-5 w-5" [class]="entry.result === 'failed' ? 'text-red-600' : 'text-green-600'">
            {{ entry.result === 'failed' ? 'error' : entry.result === 'test' ? 'science' : 'check_circle' }}
          </app-icon>
          <div class="min-w-0 flex-1">
            <p class="text-foreground truncate text-sm font-medium">{{ entry.title }}</p>
            <p class="text-muted-foreground truncate text-xs">{{ entry.detail }}</p>
          </div>
          <span class="text-muted-foreground text-xs tabular-nums">{{ time(entry.at) }}</span>
        </li>
        }
      </ul>
      }
    </div>
  `,
})
export class PrintLogComponent {
  readonly entries = input.required<PrintLogEntry[]>();

  time(date: Date): string {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
