import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { getPrinterErrorMessage, PrinterDto, UpdatePrinterService } from '../../data-access';
import { createPrinterForm, PrinterFormFieldsComponent, printerFormError, toUpdatePrinterDto } from '../../ui';
import { PrinterModalResult } from '../printer-modal-result';

@Component({
  selector: 'app-update-printer-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, PrinterFormFieldsComponent],
  templateUrl: './update-printer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePrinterModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<UpdatePrinterModalComponent, PrinterModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly updateService = inject(UpdatePrinterService);

  readonly printer = inject<PrinterDto>(MAT_DIALOG_DATA);
  readonly form = createPrinterForm(inject(FormBuilder), this.printer);
  readonly $isLoading = this.updateService.$isLoading;

  constructor() {
    effect(() => {
      if (this.updateService.$success()) this.dialogRef.close('updated');
    });
    effect(() => {
      const status = this.updateService.$error();
      if (status) this.toast.show(getPrinterErrorMessage(status), 'error');
    });
  }

  handleSubmit() {
    const error = printerFormError(this.form);
    if (error) {
      this.form.markAllAsTouched();
      this.toast.show(error, 'warning');
      return;
    }
    this.updateService.update(toUpdatePrinterDto(this.form, this.printer));
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.updateService.reset();
  }
}
