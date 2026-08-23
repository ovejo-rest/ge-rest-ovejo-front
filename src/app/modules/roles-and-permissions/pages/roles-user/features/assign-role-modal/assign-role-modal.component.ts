import { Component, effect, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { GetAllRolesService } from '../../../roles/data-access';
import { AssignRoleToUserService, UserRoleItemDto, GetAllUsersWithRolesService } from '../../data-access';

@Component({
  selector: 'app-assign-role-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    ButtonComponent,
    IconComponent,
    ModalCardComponent,
    SlotDirective,
  ],
  templateUrl: './assign-role-modal.component.html',
})
export class AssignRoleModalComponent {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $allRolesService = inject(GetAllRolesService);
  private readonly assignService = inject(AssignRoleToUserService);
  private readonly $toast = inject(ToastService);
  private readonly $usersService = inject(GetAllUsersWithRolesService);

  protected readonly data: { userId: string; userRoles: UserRoleItemDto[] } = inject(MAT_DIALOG_DATA);

  protected readonly allRoles = this.$allRolesService.$roles;
  protected readonly $loadingRoles = this.$allRolesService.$isLoading;
  protected readonly $saving = this.assignService.$isLoading;

  rolesControl = new FormControl<number[]>(this.data.userRoles.map((r) => r.id));

  constructor() {
    this.assignService.reset();
    this.$allRolesService.setParams({ perPage: 50 });

    effect(() => {
      if (this.assignService.$success()) {
        this.$toast.show('Roles asignados exitosamente', 'success');
        this.$usersService.retry();
        this.dialogRef.close();
      }
      if (this.assignService.$hasError()) {
        this.$toast.show('Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  get selectedRoleIds(): number[] {
    return this.rolesControl.value ?? [];
  }

  removeRole(roleId: number) {
    this.rolesControl.setValue(this.selectedRoleIds.filter((id) => id !== roleId));
  }

  save() {
    this.assignService.execute(this.data.userId, this.selectedRoleIds);
  }
}
