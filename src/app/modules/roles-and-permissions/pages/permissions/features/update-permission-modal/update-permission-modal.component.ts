import { Component, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetAllPermissionsDto, GetAllPermissionsService, UpdatePermissionService } from '../../data-access';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-permission-modal',
  imports: [IconComponent, ModalCardComponent, ButtonComponent, FormsModule, ReactiveFormsModule, SlotDirective],
  templateUrl: './update-permission-modal.component.html',
})
export class UpdatePermissionModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<UpdatePermissionModalComponent>);
  protected readonly $updatePermissionService = inject(UpdatePermissionService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllPermissionsService = inject(GetAllPermissionsService);

  protected readonly $isLoading = this.$updatePermissionService.$isLoading;
  protected readonly data = inject(MAT_DIALOG_DATA) as GetAllPermissionsDto;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    id: [{ value: '', disabled: true }, [Validators.required]],
    name: ['', [Validators.required]],
  });

  constructor() {
    this.form.patchValue({
      id: this.data.id.toString(),
      name: this.data.name,
    });

    effect(() => {
      if (this.$updatePermissionService.$isLoading()) {
        this.$toast.show(`Actualizando permiso...`, 'warning');
      }
      if (this.$updatePermissionService.$success()) {
        this.$toast.show(`Permiso '${this.form.get('id')?.value}' actualizado con éxito`, 'success');
        this.$getAllPermissionsService.retry();
        this.dialogRef.close();
      }
      if (this.$updatePermissionService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submitForm() {
    const name = this.form.get('name')!.value ?? '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.$updatePermissionService.update({ id: this.data.id, name });
  }

  ngOnDestroy(): void {
    this.$updatePermissionService.reset();
  }
}
