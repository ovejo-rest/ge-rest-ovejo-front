import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetAllRolesDto, GetAllRolesService, UpdateRoleService } from '../../data-access';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-role-modal',
  imports: [IconComponent, ModalCardComponent, ButtonComponent, FormsModule, ReactiveFormsModule, SlotDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './update-role-modal.component.html',
})
export class UpdateRoleModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<UpdateRoleModalComponent>);
  protected readonly $updateRoleService = inject(UpdateRoleService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllRolesService = inject(GetAllRolesService);

  protected readonly $isLoading = this.$updateRoleService.$isLoading;
  protected readonly data = inject(MAT_DIALOG_DATA) as GetAllRolesDto;

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
      if (this.$updateRoleService.$isLoading()) {
        this.$toast.show(`Actualizando rol...`, 'warning');
      }
      if (this.$updateRoleService.$success()) {
        this.$toast.show(`Rol '${this.form.get('id')?.value}' actualizado con éxito`, 'success');
        this.$getAllRolesService.retry();
        this.dialogRef.close();
      }
      if (this.$updateRoleService.$hasError()) {
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

    this.$updateRoleService.update({ id: this.data.id, name });
  }

  ngOnDestroy(): void {
    this.$updateRoleService.reset();
  }
}
