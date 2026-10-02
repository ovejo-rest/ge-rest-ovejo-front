import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadService, getUploadErrorMessage, ImageSelection } from 'src/app/core/services/file-upload';
import { ButtonComponent, ImagePickerComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { UpdateCategoryService, CategoryDto, getCategoryErrorMessage } from '../../data-access';
import { CategoryModalResult } from '../category-modal-result';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-update-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ModalCardComponent, SlotDirective, NgClass, ImagePickerComponent],
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

  readonly #upload = inject(FileUploadService);
  readonly $isUploading = this.#upload.$isUploading;
  readonly $uploadProgress = this.#upload.$progress;
  readonly #isSaving = signal(false);
  readonly $isLoading = computed(() => this.#isSaving() || !!this.updateService.$isLoading());
  #image: ImageSelection = { kind: 'keep' };

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
    this.#save();
  }

  onImageChange(selection: ImageSelection) {
    this.#image = selection;
  }

  // Sin tocar la imagen no se envía el campo; quitarla envía null.
  async #save() {
    this.#isSaving.set(true);
    try {
      const imageFileId = await this.#upload.resolveSelection(this.#image, 'categories');
      const value = this.form.getRawValue();
      this.updateService.update({
        id: this.category.id,
        name: value.name || undefined,
        shortCode: value.shortCode?.trim() || undefined,
        description: value.description || undefined,
        ...(imageFileId !== undefined ? { imageFileId } : {}),
      });
    } catch (error) {
      this.toast.show(getUploadErrorMessage(error), 'error');
    } finally {
      this.#isSaving.set(false);
    }
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.updateService.reset();
  }
}
