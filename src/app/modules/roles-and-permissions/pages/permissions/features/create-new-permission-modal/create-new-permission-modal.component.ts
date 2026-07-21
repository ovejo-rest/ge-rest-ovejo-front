import { CommonModule } from '@angular/common';
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
import { CreatePermissionService, GetAllPermissionsService } from '../../data-access';
import { GetAllModulesService } from '../../../modules/data-access';

@Component({
  selector: 'app-create-new-permission-modal',
  imports: [
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
    CaseTransformDirective,
  ],
  templateUrl: './create-new-permission-modal.component.html',
})
export class CreateNewPermissionModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $createPermissionService = inject(CreatePermissionService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllPermissionsService = inject(GetAllPermissionsService);
  protected readonly $getAllModulesService = inject(GetAllModulesService);

  protected readonly $isLoading = this.$createPermissionService.$isLoading;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    moduleId: ['', [Validators.required]],
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  constructor() {
    this.$getAllModulesService.setParams({ perPage: 50 });

    effect(() => {
      if (this.$createPermissionService.$isLoading()) {
        this.$toast.show(`Creando permiso...`, 'warning');
      }
      if (this.$createPermissionService.$success()) {
        this.$toast.show(`Permiso creado con éxito`, 'success');
        this.$getAllPermissionsService.retry();
        this.dialogRef.close();
      }
      if (this.$createPermissionService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submitForm() {
    const moduleId = Number(this.form.get('moduleId')!.value);
    const code = this.form.get('code')!.value ?? '';
    const name = this.form.get('name')!.value ?? '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.$createPermissionService.create({ moduleId, code, name });
  }

  ngOnDestroy(): void {
    this.$createPermissionService.reset();
  }
}
