import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { UpdateCategoryService, CategoryDto, getCategoryErrorMessage } from '../../data-access';
import { CategoryModalResult } from '../category-modal-result';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-update-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ModalCardComponent, SlotDirective, NgClass],
  templateUrl: './update-category-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateCategoryModalComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<UpdateCategoryModalComponent, CategoryModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly updateService = inject(UpdateCategoryService);
  readonly category = inject<CategoryDto>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    name: [this.category.name, [Validators.required, Validators.minLength(2)]],
    shortCode: [this.category.shortCode || '', [Validators.maxLength(10)]],
    description: [this.category.description || ''],
  });

  readonly $isLoading = this.updateService.$isLoading;

  constructor() {
    effect(() => {
      if (this.updateService.$success()) {
        this.dialogRef.close('updated');
      }
    });

    effect(() => {
      const status = this.updateService.$error();
      if (status) {
        this.toast.show(getCategoryErrorMessage(status), 'error');
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Completa los campos obligatorios', 'warning');
      return;
    }
    const value = this.form.getRawValue();
    this.updateService.update({
      id: this.category.id,
      name: value.name || undefined,
      shortCode: value.shortCode?.trim() || undefined,
      description: value.description || undefined,
    });
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.updateService.reset();
  }
}
