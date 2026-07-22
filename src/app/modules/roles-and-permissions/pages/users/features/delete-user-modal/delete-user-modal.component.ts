import { Component, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteUserService, GetAllUsersService, UserDto } from '../../data-access';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';

@Component({
  selector: 'app-delete-user-modal',
  imports: [IconComponent, SlotDirective, ButtonComponent, ModalCardComponent],
  templateUrl: './delete-user-modal.component.html',
})
export class DeleteUserModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<DeleteUserModalComponent>);
  protected readonly $deleteUserService = inject(DeleteUserService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllUsersService = inject(GetAllUsersService);

  protected readonly $isLoading = this.$deleteUserService.$isLoading;

  protected readonly data = inject(MAT_DIALOG_DATA) as UserDto;

  constructor() {
    this.$deleteUserService.reset();

    effect(() => {
      if (this.$deleteUserService.$isLoading()) {
        this.$toast.show(`Eliminando usuario...`, 'warning');
      }
      if (this.$deleteUserService.$success()) {
        this.$toast.show(`Usuario '${this.data.code}' eliminado con éxito`, 'success');
        this.$getAllUsersService.retry();
        this.dialogRef.close();
      }
      if (this.$deleteUserService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  getFullName(): string {
    return `${this.data.name} ${this.data.fatherLastName} ${this.data.motherLastName}`.trim();
  }

  submit() {
    this.$deleteUserService.delete({ userId: this.data.code });
  }

  ngOnDestroy(): void {
    this.$deleteUserService.reset();
  }
}
