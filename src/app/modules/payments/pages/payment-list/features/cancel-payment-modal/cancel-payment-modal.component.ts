import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective } from 'src/ui';
import { CancelPaymentService, PaymentDto } from '../../data-access';

@Component({
  selector: 'app-cancel-payment-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './cancel-payment-modal.component.html',
})
export class CancelPaymentModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CancelPaymentModalComponent>);
  private readonly data = inject<PaymentDto>(MAT_DIALOG_DATA);
  private readonly cancelPaymentService = inject(CancelPaymentService);

  readonly $isLoading = this.cancelPaymentService.$isLoading;
  readonly $hasError = this.cancelPaymentService.$hasError;
  readonly $success = this.cancelPaymentService.$success;

  readonly payment = this.data;

  onConfirm() {
    this.cancelPaymentService.cancel(this.payment.id);
  }

  onCancel() {
    this.dialogRef.close();
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  getMethodLabel(method: string | null): string {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      debit: 'Débito',
      credit: 'Crédito',
      transfer: 'Transferencia',
      other: 'Otro',
    };
    return method ? labels[method] || method : 'N/A';
  }
}
