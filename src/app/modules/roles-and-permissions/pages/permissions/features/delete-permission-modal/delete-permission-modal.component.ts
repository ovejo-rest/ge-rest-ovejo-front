import { Component, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeletePermissionService, GetAllPermissionsService, PermissionDto } from '../../data-access';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';

@Component({
  selector: 'app-delete-permission-modal',
  imports: [IconComponent, SlotDirective, ButtonComponent, ModalCardComponent],
  templateUrl: './delete-permission-modal.component.html',
})
export class DeletePermissionModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<DeletePermissionModalComponent>);
  protected readonly $deletePermissionService = inject(DeletePermissionService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllPermissionsService = inject(GetAllPermissionsService);

  protected readonly $isLoading = this.$deletePermissionService.$isLoading;

  protected readonly data = inject(MAT_DIALOG_DATA) as PermissionDto;

  constructor() {
    effect(() => {
      if (this.$deletePermissionService.$isLoading()) {
        this.$toast.show(`Eliminando permiso...`, 'warning');
      }
      if (this.$deletePermissionService.$success()) {
        this.$toast.show(`Permiso '${this.data.id}' eliminado con éxito`, 'success');
        this.$getAllPermissionsService.retry();
        this.dialogRef.close();
      }
      if (this.$deletePermissionService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submit() {
    this.$deletePermissionService.delete({ id: this.data.id });
  }

  ngOnDestroy(): void {
    this.$deletePermissionService.reset();
  }
}
