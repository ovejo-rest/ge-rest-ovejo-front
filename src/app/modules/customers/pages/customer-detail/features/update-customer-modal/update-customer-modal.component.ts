import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { ApiErrorCode, readApiError } from 'src/app/core/utils';
import { formatRut, rutValidator } from 'src/app/shared/validators';
import { CustomerDetailDto, CustomerService, UpdateCustomerDto } from '../../data-access';

@Component({
  selector: 'app-update-customer-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ModalCardComponent, SlotDirective],
  templateUrl: './update-customer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateCustomerModalComponent {
  private readonly dialogRef = inject<MatDialogRef<UpdateCustomerModalComponent, boolean>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly customerService = inject(CustomerService);

  readonly customer = inject<CustomerDetailDto>(MAT_DIALOG_DATA);
  readonly $isSaving = signal(false);
  readonly inputClass = 'glass-input w-full rounded-md px-3 py-2';

  readonly form = inject(FormBuilder).nonNullable.group({
    name: [this.customer.name, [Validators.required, Validators.minLength(2)]],
    mobile: [this.customer.mobile, [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)]],
    email: [this.customer.email ?? '', [Validators.email]],
    taxNumber: [this.customer.taxNumber ?? '', [rutValidator]],
    addressLine1: [this.customer.addressLine1 ?? ''],
    city: [this.customer.city ?? ''],
  });

  formatTaxNumber() {
    const control = this.form.controls.taxNumber;
    if (control.value && control.valid) control.setValue(formatRut(control.value));
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show(this.form.controls.taxNumber.invalid ? 'El RUT no es válido' : 'Revisa nombre, teléfono y email', 'warning');
      return;
    }
    const changes = this.buildChanges();
    if (!Object.keys(changes).length) {
      this.dialogRef.close(false);
      return;
    }
    this.$isSaving.set(true);
    this.customerService.update(this.customer.id, changes).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: HttpErrorResponse) => {
        this.$isSaving.set(false);
        this.toast.show(this.errorMessage(error), 'error');
      },
    });
  }

  handleCancel() {
    this.dialogRef.close(false);
  }

  private errorMessage(error: HttpErrorResponse): string {
    const { code, details } = readApiError(error);
    // 409 con el cliente que ya tiene ese teléfono en `details` ({ customerId, name }).
    if (code === ApiErrorCode.CUSTOMER_PHONE_EXISTS) {
      const name = typeof details['name'] === 'string' && details['name'] ? details['name'] : 'otro cliente';
      return `El teléfono ya está registrado para ${name}.`;
    }
    return error.status === HttpStatusCode.NotFound ? 'El cliente ya no existe' : 'No se pudo guardar el cliente';
  }

  private buildChanges(): UpdateCustomerDto {
    const value = this.form.getRawValue();
    const original = this.customer;
    const changed = (key: keyof typeof value, current: string | null) => value[key].trim() !== (current ?? '');
    return {
      ...(changed('name', original.name) && { name: value.name.trim() }),
      ...(changed('mobile', original.mobile) && { mobile: value.mobile.trim() }),
      ...(changed('email', original.email) && { email: value.email.trim() }),
      ...(changed('taxNumber', original.taxNumber) && { taxNumber: value.taxNumber.trim() }),
      ...(changed('addressLine1', original.addressLine1) && { addressLine1: value.addressLine1.trim() }),
      ...(changed('city', original.city) && { city: value.city.trim() }),
    };
  }
}
