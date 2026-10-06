import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { UpdateStationService, getStationErrorMessage } from '../../data-access';
import { createStationForm, StationFormFieldsComponent, toUpdateStationDto } from '../../ui';
import { StationModalData, StationModalResult } from '../station-modal-result';

@Component({
  selector: 'app-update-station-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, StationFormFieldsComponent],
  templateUrl: './update-station-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateStationModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<UpdateStationModalComponent, StationModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly updateService = inject(UpdateStationService);

  readonly data = inject<StationModalData>(MAT_DIALOG_DATA);
  readonly form = createStationForm(inject(FormBuilder), this.data.station);
  readonly $isLoading = this.updateService.$isLoading;

  constructor() {
    effect(() => {
      if (this.updateService.$success()) this.dialogRef.close('updated');
    });
    effect(() => {
      const status = this.updateService.$error();
      if (status) this.toast.show(getStationErrorMessage(status), 'error');
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Ingresa el nombre de la estación', 'warning');
      return;
    }
    this.updateService.update(toUpdateStationDto(this.form, this.data.station!));
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.updateService.reset();
  }
}
