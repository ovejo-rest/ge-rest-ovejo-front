import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateCustomerService } from 'src/app/modules/orders/pages/order-create/data-access';

// created: id del cliente nuevo · existing: id del cliente que ya tenía ese teléfono.
export type CreateCustomerModalResult = Readonly<{ kind: 'created' | 'existing'; id: number }>;

@Component({
  selector: 'app-create-customer-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ModalCardComponent, SlotDirective],
  templateUrl: './create-customer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCustomerModalComponent {
  private readonly dialogRef = inject<MatDialogRef<CreateCustomerModalComponent, CreateCustomerModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly createService = inject(CreateCustomerService);

  readonly $isSaving = signal(false);
  readonly $existing = signal<{ id: number; name: string } | null>(null);
  readonly inputClass = 'glass-input w-full rounded-md px-3 py-2';

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    mobile: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)]],
    email: ['', [Validators.email]],
  });

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Ingresa nombre, un teléfono válido y revisa el email', 'warning');
      return;
    }
    const { name, mobile, email } = this.form.getRawValue();
    this.$isSaving.set(true);
    this.createService.create({ name: name.trim(), mobile: mobile.trim(), email: email.trim() || undefined }).subscribe({
      next: (customer) => this.dialogRef.close({ kind: 'created', id: customer.id }),
      error: (error: HttpErrorResponse) => {
        this.$isSaving.set(false);
        const existing = this.createService.getExistingCustomer(error);
        if (existing) {
          this.$existing.set(existing);
          return;
        }
        this.toast.show('No se pudo crear el cliente', 'error');
      },
    });
  }

  openExisting(id: number) {
    this.dialogRef.close({ kind: 'existing', id });
  }

  handleCancel() {
    this.dialogRef.close();
  }
}
