import { Component, effect, inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeleteModuleService, GetAllModulesService, ModuleDto } from '../../data-access';

@Component({
  selector: 'app-delete-module-modal',
  imports: [ModalCardComponent, IconComponent, SlotDirective, ButtonComponent],
  templateUrl: './delete-module-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './delete-module-modal.component.css',
})
export class DeleteModuleModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef<DeleteModuleModalComponent>);
  protected readonly deleteModuleService = inject(DeleteModuleService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllModulesService = inject(GetAllModulesService);

  protected readonly $isLoading = this.deleteModuleService.$isLoading;

  protected readonly data = inject(MAT_DIALOG_DATA) as ModuleDto;

  constructor() {
    effect(() => {
      if (this.deleteModuleService.$isLoading()) {
        this.$toast.show(`Actualizando módulo...`, 'warning');
      }
      if (this.deleteModuleService.$success()) {
        this.$toast.show(`Módulo '${this.data.id}' eliminado con éxito`, 'success');
        this.$getAllModulesService.retry();
        this.dialogRef.close();
      }
      if (this.deleteModuleService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submit() {
    this.deleteModuleService.delete({ id: this.data.id });
  }

  ngOnDestroy(): void {
    this.deleteModuleService.reset();
  }
}
