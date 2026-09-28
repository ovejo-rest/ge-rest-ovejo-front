import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreatePrinterService, getPrinterErrorMessage } from '../../data-access';
import { createPrinterForm, PrinterFormFieldsComponent, printerFormError, toCreatePrinterDto } from '../../ui';
import { PrinterModalResult } from '../printer-modal-result';

@Component({
  selector: 'app-create-printer-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, PrinterFormFieldsComponent],
  templateUrl: './create-printer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePrinterModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<CreatePrinterModalComponent, PrinterModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly createService = inject(CreatePrinterService);

  readonly form = createPrinterForm(inject(FormBuilder));
  readonly $isLoading = this.createService.$isLoading;

  constructor() {
    effect(() => {
      if (this.createService.$success()) this.dialogRef.close('created');
    });
    effect(() => {
      const status = this.createService.$error();
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
    this.createService.create(toCreatePrinterDto(this.form));
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.createService.reset();
  }
}
