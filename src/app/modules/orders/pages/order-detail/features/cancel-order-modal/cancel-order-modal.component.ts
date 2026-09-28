import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { getOrderErrorMessage } from '../../../order-list/data-access';
import { formatCurrency } from '../../../order-list/ui';
import { CancelOrderService, OrderDetailDto } from '../../data-access';
import { OrderModalResult } from '../order-modal-result';

@Component({
  selector: 'app-cancel-order-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './cancel-order-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelOrderModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<CancelOrderModalComponent, OrderModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly cancelService = inject(CancelOrderService);

  readonly order = inject<OrderDetailDto>(MAT_DIALOG_DATA);
  readonly $isLoading = this.cancelService.$isLoading;
  readonly formatCurrency = formatCurrency;

  constructor() {
    effect(() => {
      if (this.cancelService.$success()) {
        this.dialogRef.close('cancelled-order');
      }
    });

    effect(() => {
      const status = this.cancelService.$error();
      if (status) {
        this.toast.show(getOrderErrorMessage(status), 'error');
      }
    });
  }

  handleConfirm() {
    this.cancelService.cancel(this.order.transactionId);
  }

  handleCancel() {
    this.dialogRef.close('dismissed');
  }

  ngOnDestroy(): void {
    this.cancelService.reset();
  }
}
