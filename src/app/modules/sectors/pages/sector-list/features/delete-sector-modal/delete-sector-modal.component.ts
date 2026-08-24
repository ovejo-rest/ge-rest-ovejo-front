import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeleteSectorService, GetAllSectorsService, SectorDto } from '../../data-access';

@Component({
  selector: 'app-delete-sector-modal',
  imports: [IconComponent, ButtonComponent, SlotDirective, ModalCardComponent],
  templateUrl: './delete-sector-modal.component.html',
})
export class DeleteSectorModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<SectorDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(DeleteSectorService);
  protected readonly $getAll = inject(GetAllSectorsService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  constructor() {
    effect(() => {
      if (this.$service.$success()) { this.$toast.show('Sector eliminado', 'success'); this.$getAll.retry(); this.dialogRef.close(); }
      if (this.$service.$hasError()) { this.$toast.show('Error al eliminar', 'error'); }
    });
  }

  confirm() { this.$service.delete(this.data.id); }
  ngOnDestroy(): void { this.$service.reset(); }
}
