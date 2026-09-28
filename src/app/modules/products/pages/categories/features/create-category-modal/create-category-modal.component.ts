import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateCategoryService, GetAllCategoriesService, getCategoryErrorMessage } from '../../data-access';
import { CategoryModalResult } from '../category-modal-result';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-create-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ModalCardComponent, SlotDirective, NgClass],
  templateUrl: './create-category-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryModalComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<CreateCategoryModalComponent, CategoryModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly createService = inject(CreateCategoryService);
  private readonly getAllService = inject(GetAllCategoriesService);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    shortCode: ['', [Validators.maxLength(10)]],
    description: [''],
    parentId: [0],
  });

  // Solo las categorías principales pueden ser padre; la lista ya viene en árbol desde el API.
  readonly $parentOptions = computed(() => this.getAllService.$categories() ?? []);

  readonly $isLoading = this.createService.$isLoading;

  constructor() {
    effect(() => {
      if (this.createService.$success()) {
        this.dialogRef.close('created');
      }
    });

    effect(() => {
      const status = this.createService.$error();
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
    this.createService.create({
      name: value.name!,
      shortCode: value.shortCode?.trim() || undefined,
      description: value.description || undefined,
      parentId: value.parentId || 0,
    });
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.createService.reset();
  }
}
