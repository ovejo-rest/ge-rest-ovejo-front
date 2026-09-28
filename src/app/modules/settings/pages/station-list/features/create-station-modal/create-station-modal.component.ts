import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateStationService, getStationErrorMessage } from '../../data-access';
import { createStationForm, StationFormFieldsComponent, toCreateStationDto } from '../../ui';
import { StationModalData, StationModalResult } from '../station-modal-result';

@Component({
  selector: 'app-create-station-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, StationFormFieldsComponent],
  templateUrl: './create-station-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<CreateStationModalComponent, StationModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly createService = inject(CreateStationService);

  readonly data = inject<StationModalData>(MAT_DIALOG_DATA);
  readonly form = createStationForm(inject(FormBuilder), this.data.station);
  readonly $isLoading = this.createService.$isLoading;

  constructor() {
    effect(() => {
      if (this.createService.$success()) this.dialogRef.close('created');
    });
    effect(() => {
      const status = this.createService.$error();
      if (status) this.toast.show(getStationErrorMessage(status), 'error');
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Ingresa el nombre de la estación', 'warning');
      return;
    }
    this.createService.create(toCreateStationDto(this.form));
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.createService.reset();
  }
}
