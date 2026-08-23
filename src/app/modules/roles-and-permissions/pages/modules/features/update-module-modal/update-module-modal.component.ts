import { Component, effect, inject, OnDestroy } from '@angular/core';
import { GetAllModulesDto, GetAllModulesService, UpdateModuleService } from '../../data-access';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CaseTransformDirective } from 'src/ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-module-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
    CaseTransformDirective,
    IconComponent,
  ],
  templateUrl: './update-module-modal.component.html',
  styleUrl: './update-module-modal.component.css',
})
export class UpdateModuleModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef<UpdateModuleModalComponent>);
  protected readonly updateModuleService = inject(UpdateModuleService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllModulesService = inject(GetAllModulesService);

  protected readonly $isLoading = this.updateModuleService.$isLoading;
  protected readonly data = inject(MAT_DIALOG_DATA) as GetAllModulesDto;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    id: [{ value: '', disabled: true }, [Validators.required]],
    newName: ['', [Validators.required]],
  });

  constructor() {
    this.form.patchValue({
      id: this.data.id.toString(),
      newName: this.data.name,
    });

    effect(() => {
      if (this.updateModuleService.$isLoading()) {
        this.$toast.show(`Actualizando módulo...`, 'warning');
      }
      if (this.updateModuleService.$success()) {
        this.$toast.show(`Módulo '${this.form.get('id')?.value}' actualizado con éxito`, 'success');
        this.$getAllModulesService.retry();
        this.dialogRef.close();
      }
      if (this.updateModuleService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submitForm() {
    const newName = this.form.get('newName')!.value ?? '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.updateModuleService.update({ id: this.data.id, newName });
  }

  ngOnDestroy(): void {
    this.updateModuleService.reset();
  }
}
