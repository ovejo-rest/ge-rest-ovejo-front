import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { GetAllTablesService } from 'src/app/modules/tables/pages/table-list/data-access';
import { CustomerDto } from 'src/app/modules/orders/pages/order-create/data-access';
import { CustomerSelectorComponent } from 'src/app/modules/orders/pages/order-create/features';
import { BookingService, getBookingErrorMessage } from '../../data-access';
import { BookingFormFieldsComponent, createBookingForm, toCreateBookingDto } from '../../ui';
import { BookingModalResult, CreateBookingModalData } from '../booking-modal-result';

@Component({
  selector: 'app-create-booking-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, BookingFormFieldsComponent, CustomerSelectorComponent],
  templateUrl: './create-booking-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBookingModalComponent {
  private readonly dialogRef = inject<MatDialogRef<CreateBookingModalComponent, BookingModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly bookingService = inject(BookingService);
  private readonly tablesService = inject(GetAllTablesService);

  readonly data = inject<CreateBookingModalData>(MAT_DIALOG_DATA);
  readonly form = createBookingForm(inject(FormBuilder), { date: this.data.date });
  readonly $tables = this.tablesService.$tables;
  readonly $customer = signal<CustomerDto | null>(null);
  readonly $isSaving = signal(false);

  constructor() {
    this.tablesService.setParams(this.data.locationId);
  }

  handleSubmit() {
    const customer = this.$customer();
    if (!customer) {
      this.toast.show('Busca o crea el cliente de la reserva', 'warning');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Completa la fecha, la hora y las personas', 'warning');
      return;
    }
    this.$isSaving.set(true);
    this.bookingService.create(toCreateBookingDto(this.form, customer.id, this.data.locationId)).subscribe({
      next: () => this.dialogRef.close('created'),
      error: (error: HttpErrorResponse) => {
        this.$isSaving.set(false);
        this.toast.show(getBookingErrorMessage(error), 'error');
      },
    });
  }

  handleCancel() {
    this.dialogRef.close();
  }
}
