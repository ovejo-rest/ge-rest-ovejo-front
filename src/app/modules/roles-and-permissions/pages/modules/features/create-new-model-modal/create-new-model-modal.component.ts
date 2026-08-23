import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CaseTransformDirective } from 'src/ui';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import {
  CreateModuleService,
  GetAllModulesService,
} from 'src/app/modules/roles-and-permissions/pages/modules/data-access';

@Component({
  selector: 'app-create-new-model-modal',
  imports: [
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
    CaseTransformDirective,
  ],
  templateUrl: './create-new-model-modal.component.html',
  styleUrl: './create-new-model-modal.component.css',
})
export class CreateNewModelModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly createModuleService = inject(CreateModuleService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllModulesService = inject(GetAllModulesService);

  protected readonly $isLoading = this.createModuleService.$isLoading;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.createModuleService.$isLoading()) {
        this.$toast.show(`Creando módulo...`, 'warning');
      }
      if (this.createModuleService.$success()) {
        this.$toast.show(`Rol '${this.form.get('code')?.value}' creado con éxito`, 'success');
        this.$getAllModulesService.retry();
        this.dialogRef.close();
      }
      if (this.createModuleService.$hasError()) {
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

    this.createModuleService.create({ code, name });
  }

  ngOnDestroy(): void {
    this.createModuleService.reset();
  }
}
