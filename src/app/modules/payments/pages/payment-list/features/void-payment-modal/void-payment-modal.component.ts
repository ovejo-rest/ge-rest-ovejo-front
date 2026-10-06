import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { formatCurrency } from 'src/app/modules/orders/pages/order-list/ui';
import { CancelPaymentService, getPaymentErrorMessage, PaymentDto } from '../../data-access';
import { paymentMethodLabel } from '../../ui';

export type VoidPaymentResult = 'voided' | 'dismissed';

@Component({
  selector: 'app-void-payment-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './void-payment-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidPaymentModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<VoidPaymentModalComponent, VoidPaymentResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly cancelService = inject(CancelPaymentService);

  readonly payment = inject<PaymentDto>(MAT_DIALOG_DATA);
  readonly $isLoading = this.cancelService.$isLoading;
  readonly formatCurrency = formatCurrency;
  readonly methodLabel = paymentMethodLabel;
  readonly reasons = ['Error de digitación', 'Método de pago incorrecto', 'Cliente cambió la forma de pago', 'Pago duplicado'];

  readonly reason = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(255)] });

  constructor() {
    effect(() => {
      if (this.cancelService.$success()) this.dialogRef.close('voided');
    });
    effect(() => {
      const status = this.cancelService.$error();
      if (status) this.toast.show(getPaymentErrorMessage(status), 'error');
    });
  }

  handleConfirm() {
    const reason = this.reason.value.trim();
    if (!reason) {
      this.reason.markAsTouched();
      this.toast.show('Indica el motivo de la anulación', 'warning');
      return;
    }
    this.cancelService.cancel({ id: this.payment.id, reason });
  }

  handleCancel() {
    this.dialogRef.close('dismissed');
  }

  ngOnDestroy(): void {
    this.cancelService.reset();
  }
}
