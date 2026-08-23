import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeleteTableService, GetAllTablesService, TableDto } from '../../data-access';

@Component({
  selector: 'app-delete-table-modal',
  imports: [IconComponent, ButtonComponent, SlotDirective, ModalCardComponent],
  templateUrl: './delete-table-modal.component.html',
})
export class DeleteTableModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<TableDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(DeleteTableService);
  protected readonly $getAll = inject(GetAllTablesService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  constructor() {
    effect(() => {
      if (this.$service.$success()) { this.$toast.show('Mesa eliminada', 'success'); this.$getAll.retry(); this.dialogRef.close(); }
      if (this.$service.$hasError()) { this.$toast.show('Error al eliminar', 'error'); }
    });
  }

  confirm() { this.$service.delete(this.data.id); }
  ngOnDestroy(): void { this.$service.reset(); }
}
