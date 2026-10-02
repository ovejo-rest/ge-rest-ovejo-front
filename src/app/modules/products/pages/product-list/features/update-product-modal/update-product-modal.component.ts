import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FileUploadService, getUploadErrorMessage, ImageSelection } from 'src/app/core/services/file-upload';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { GetAllCategoriesService } from '../../../categories/data-access';
import { ProductDto, UpdateProductService, getProductErrorMessage } from '../../data-access';
import { createProductForm, ProductFormFieldsComponent, toUpdateProductDto } from '../../ui';
import { ProductModalResult } from '../product-modal-result';

@Component({
  selector: 'app-update-product-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, ProductFormFieldsComponent],
  templateUrl: './update-product-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProductModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<UpdateProductModalComponent, ProductModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly updateService = inject(UpdateProductService);

  readonly $categories = inject(GetAllCategoriesService).$categories;
  readonly product = inject<ProductDto>(MAT_DIALOG_DATA);
  readonly form = createProductForm(inject(FormBuilder), this.product);
  readonly #upload = inject(FileUploadService);
  readonly $isUploading = this.#upload.$isUploading;
  readonly $uploadProgress = this.#upload.$progress;
  readonly #isSaving = signal(false);
  // Subiendo la imagen o guardando el producto.
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
        this.toast.show(getProductErrorMessage(status), 'error');
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
      const imageFileId = await this.#upload.resolveSelection(this.#image, 'products');
      this.updateService.update({
        ...toUpdateProductDto(this.form, this.product),
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
