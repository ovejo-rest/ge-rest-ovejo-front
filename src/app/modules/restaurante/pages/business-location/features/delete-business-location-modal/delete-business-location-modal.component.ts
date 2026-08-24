import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { BusinessLocationDto, DeleteBusinessLocationService } from '../../data-access';

@Component({
  selector: 'app-delete-business-location-modal',
  imports: [IconComponent, ButtonComponent, SlotDirective, ModalCardComponent],
  templateUrl: './delete-business-location-modal.component.html',
})
export class DeleteBusinessLocationModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<BusinessLocationDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(DeleteBusinessLocationService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  constructor() {
    effect(() => {
      if (this.$service.$success()) {
        this.$toast.show('Sucursal eliminada', 'success');
        this.dialogRef.close({ success: true });
      }
      if (this.$service.$hasError()) {
        this.$toast.show('Error al eliminar', 'error');
      }
    });
  }

  confirm() {
    this.$service.delete(this.data.id);
  }

  ngOnDestroy(): void {
    this.$service.reset();
  }
}
