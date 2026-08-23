import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective } from 'src/ui';
import { OrderDto, OrderStatus } from '../../data-access';

@Component({
  selector: 'app-order-detail-modal',
  imports: [IconComponent, ButtonComponent, SlotDirective, ModalCardComponent, CurrencyPipe, DatePipe],
  templateUrl: './order-detail-modal.component.html',
})
export class OrderDetailModalComponent {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<OrderDto>(MAT_DIALOG_DATA);

  statusClasses(s: OrderStatus) {
    const m: Record<OrderStatus, string> = {
      received: 'bg-purple-500/20 text-purple-600', pending: 'bg-yellow-500/20 text-yellow-600',
      in_progress: 'bg-blue-500/20 text-blue-600', ready: 'bg-green-500/20 text-green-600',
      delivered: 'bg-teal-500/20 text-teal-600', completed: 'bg-green-600/20 text-green-700',
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
