import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ButtonComponent,
  CaseTransformDirective,
  IconComponent,
  ModalCardComponent,
  SlotDirective,
  ToastService,
} from 'src/ui';
import { CreateRoleService, GetAllRolesService } from '../../data-access';

@Component({
  selector: 'app-create-new-role-modal',
  imports: [
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
    CaseTransformDirective,
  ],
  templateUrl: './create-new-role-modal.component.html',
})
export class CreateNewRoleModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $createRoleService = inject(CreateRoleService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllRolesService = inject(GetAllRolesService);

  protected readonly $isLoading = this.$createRoleService.$isLoading;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.$createRoleService.$isLoading()) {
        this.$toast.show(`Creando rol...`, 'warning');
      }
      if (this.$createRoleService.$success()) {
        this.$toast.show(`Rol '${this.form.get('code')?.value}' creado con éxito`, 'success');
        this.$getAllRolesService.retry();
        this.dialogRef.close();
      }
      if (this.$createRoleService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submitForm() {
    const code = this.form.get('code')!.value ?? '';
    const name = this.form.get('name')!.value ?? '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.$createRoleService.create({ code, name });
  }

  ngOnDestroy(): void {
    this.$createRoleService.reset();
  }
}
