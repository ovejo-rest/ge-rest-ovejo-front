import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective } from 'src/ui';
import { CreatePaymentService, PaymentMethod } from '../../data-access';

@Component({
  selector: 'app-create-payment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ModalCardComponent, SlotDirective],
  templateUrl: './create-payment-modal.component.html',
})
export class CreatePaymentModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreatePaymentModalComponent>);
  private readonly createPaymentService = inject(CreatePaymentService);

  readonly $isLoading = this.createPaymentService.$isLoading;
  readonly $hasError = this.createPaymentService.$hasError;
  readonly $success = this.createPaymentService.$success;

  readonly paymentMethods = Object.values(PaymentMethod);

  form = this.fb.group({
    transactionId: [null, [Validators.required, Validators.min(1)]],
    amount: [null, [Validators.required, Validators.min(0)]],
    method: [PaymentMethod.CASH, [Validators.required]],
    note: [''],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.createPaymentService.create({
      transactionId: value.transactionId!,
      amount: value.amount!,
      method: value.method as PaymentMethod,
      note: value.note || undefined,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  getMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      debit: 'Débito',
      credit: 'Crédito',
      transfer: 'Transferencia',
      other: 'Otro',
    };
    return labels[method] || method;
  }
}
