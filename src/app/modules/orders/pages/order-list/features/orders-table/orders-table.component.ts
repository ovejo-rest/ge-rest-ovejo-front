import { Component, EventEmitter, input, Output, signal, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  ButtonComponent, PaginationTableComponent,
  ProgressBarComponent, SlotDirective, TableComponent,
} from 'src/ui';
import { FiltersOrderTableComponent } from '../../ui';
import { OrderDto, OrderStatus } from '../../data-access';
import { PaginationMeta } from 'src/app/core/standarized-response/standardized-pagination/pagination-meta.dto';
import { OrderDetailModalComponent } from '../order-detail-modal';
import { UpdateOrderStatusModalComponent } from '../update-order-status-modal';

@Component({
  selector: 'app-orders-table',
  imports: [
    NgClass, TableComponent, SlotDirective, ButtonComponent,
    PaginationTableComponent, ProgressBarComponent, FiltersOrderTableComponent,
    CurrencyPipe, DatePipe,
  ],
  templateUrl: './orders-table.component.html',
})
export class OrdersTableComponent {
  private readonly dialog = inject(MatDialog);
  readonly $orders = input.required<OrderDto[]>({ alias: 'orders' });
  readonly isLoading = input(false, { alias: 'isLoading' });
  readonly $pagination = input.required<PaginationMeta>({ alias: 'pagination' });

  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();
  @Output() searchTableChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<string>();
  @Output() retryData = new EventEmitter<void>();

  readonly headerData = ['Pedido', 'Mesa', 'Items', 'Total', 'Estado', 'Fecha'];
  readonly perPage = signal(10);

  viewDetail(item: OrderDto) { this.dialog.open(OrderDetailModalComponent, { width: '90%', data: item }); }
  changeStatus(item: OrderDto) { this.dialog.open(UpdateOrderStatusModalComponent, { width: '90%', data: item }); }
  onChangePage(p: number) { this.pageChange.emit(p); }
  onSearchTable(v: string) { this.searchTableChange.emit(v); }
  onStatusFilter(v: string) { this.statusFilterChange.emit(v); }
  onPerPageChange(e: Event) { const v = Number((e.target as HTMLSelectElement).value); this.perPage.set(v); this.perPageChange.emit(v); }
  retry() { this.retryData.emit(); }

  statusClasses(s: OrderStatus) {
    const m: Record<OrderStatus, string> = {
      received: 'bg-purple-500/20 text-purple-600',
      pending: 'bg-yellow-500/20 text-yellow-600',
      in_progress: 'bg-blue-500/20 text-blue-600',
      ready: 'bg-green-500/20 text-green-600',
      delivered: 'bg-teal-500/20 text-teal-600',
      completed: 'bg-green-600/20 text-green-700',
      cancelled: 'bg-red-500/20 text-red-600',
    };
    return m[s];
  }

  statusLabel(s: OrderStatus) {
    const m: Record<OrderStatus, string> = {
      received: 'Recibido', pending: 'Pendiente', in_progress: 'En preparación',
      ready: 'Listo', delivered: 'Entregado', completed: 'Completado', cancelled: 'Cancelado',
    };
    return m[s];
  }
}
