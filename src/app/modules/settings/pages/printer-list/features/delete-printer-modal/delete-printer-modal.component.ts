import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeletePrinterService, getPrinterErrorMessage, PrinterDto } from '../../data-access';
import { PrinterModalResult } from '../printer-modal-result';

@Component({
  selector: 'app-delete-printer-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './delete-printer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePrinterModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<DeletePrinterModalComponent, PrinterModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly deleteService = inject(DeletePrinterService);

  readonly printer = inject<PrinterDto>(MAT_DIALOG_DATA);
  readonly $isLoading = this.deleteService.$isLoading;

  constructor() {
    effect(() => {
      if (this.deleteService.$success()) this.dialogRef.close('deleted');
    });
    effect(() => {
      const status = this.deleteService.$error();
      if (status) this.toast.show(getPrinterErrorMessage(status), 'error');
    });
  }

  handleDelete() {
    this.deleteService.delete(this.printer.id);
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.deleteService.reset();
  }
}
