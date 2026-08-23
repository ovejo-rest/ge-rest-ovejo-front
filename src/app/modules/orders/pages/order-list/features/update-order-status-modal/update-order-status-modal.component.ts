import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { OrderDto, OrderStatus, UpdateOrderStatusService, GetAllOrdersService } from '../../data-access';

@Component({
  selector: 'app-update-order-status-modal',
  imports: [IconComponent, ButtonComponent, SlotDirective, ModalCardComponent],
  templateUrl: './update-order-status-modal.component.html',
})
export class UpdateOrderStatusModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<OrderDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(UpdateOrderStatusService);
  protected readonly $getAll = inject(GetAllOrdersService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  readonly transitions: { status: OrderStatus; label: string; icon: string }[] = [
    { status: 'received', label: 'Recibido', icon: 'inbox' },
    { status: 'pending', label: 'Pendiente', icon: 'hourglass_empty' },
    { status: 'in_progress', label: 'En preparación', icon: 'cooking' },
    { status: 'ready', label: 'Listo', icon: 'check_circle' },
    { status: 'delivered', label: 'Entregado', icon: 'local_shipping' },
    { status: 'completed', label: 'Completado', icon: 'task_alt' },
    { status: 'cancelled', label: 'Cancelado', icon: 'cancel' },
  ];

  constructor() {
    effect(() => {
      if (this.$service.$success()) { this.$toast.show('Estado actualizado', 'success'); this.$getAll.retry(); this.dialogRef.close(); }
      if (this.$service.$hasError()) { this.$toast.show('Error al actualizar', 'error'); }
    });
  }

  select(status: OrderStatus) { this.$service.update(this.data.id, status); }
  ngOnDestroy(): void { this.$service.reset(); }
}
