import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SlotDirective } from '../../utils/slot.directive';
import { ModalCardComponent } from '../../templates/modal-card/modal-card.component';
import { ButtonComponent } from '../button/button.component';

export type ConfirmModalData = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'primary' | 'danger';
};

@Component({
  selector: 'app-confirm-modal',
  imports: [ModalCardComponent, IconComponent, SlotDirective, ButtonComponent],
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<ConfirmModalComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as ConfirmModalData;

  confirm() {
    this.dialogRef.close(true);
  }
}
