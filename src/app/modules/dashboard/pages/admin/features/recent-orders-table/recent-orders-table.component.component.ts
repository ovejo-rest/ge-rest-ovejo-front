import { Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CardComponent, HeaderDashboardComponent, IconComponent, ProgressBarComponent, SkeletonComponent } from 'src/ui';
import { RecentOrderDto } from './recent-orders-table.component';

@Component({
  selector: 'app-recent-orders-table',
  imports: [CardComponent, HeaderDashboardComponent, IconComponent, ProgressBarComponent, SkeletonComponent, CurrencyPipe, DatePipe],
  templateUrl: './recent-orders-table.component.html',
})
export class RecentOrdersTableComponent {
  readonly $orders = input.required<RecentOrderDto[]>({ alias: 'orders' });
  readonly $loading = input(false, { alias: 'loading' });
  readonly $hasError = input(false, { alias: 'hasError' });

  statusBadgeClasses(status: string): string {
    const map: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-600',
      pending: 'bg-yellow-500/20 text-yellow-600',
      cancelled: 'bg-red-500/20 text-red-600',
      in_progress: 'bg-blue-500/20 text-blue-600',
      received: 'bg-purple-500/20 text-purple-600',
    };
    return map[status] ?? 'bg-muted text-muted-foreground';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      completed: 'Completado',
      pending: 'Pendiente',
      cancelled: 'Cancelado',
      in_progress: 'En progreso',
      received: 'Recibido',
    };
    return map[status] ?? status;
  }
}
