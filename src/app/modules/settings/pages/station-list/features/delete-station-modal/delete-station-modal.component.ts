import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeleteStationService, getStationErrorMessage, StationDto } from '../../data-access';
import { StationModalResult } from '../station-modal-result';

@Component({
  selector: 'app-delete-station-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './delete-station-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteStationModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<DeleteStationModalComponent, StationModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly deleteService = inject(DeleteStationService);

  readonly station = inject<StationDto>(MAT_DIALOG_DATA);
  readonly $isLoading = this.deleteService.$isLoading;

  constructor() {
    effect(() => {
      if (this.deleteService.$success()) this.dialogRef.close('deleted');
    });
    effect(() => {
      const status = this.deleteService.$error();
      if (status) this.toast.show(getStationErrorMessage(status), 'error');
    });
  }

  handleDelete() {
    this.deleteService.delete(this.station.id);
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.deleteService.reset();
  }
}
