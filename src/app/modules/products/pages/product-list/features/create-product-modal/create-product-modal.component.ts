import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FileUploadService, getUploadErrorMessage, ImageSelection } from 'src/app/core/services/file-upload';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { GetAllCategoriesService } from '../../../categories/data-access';
import { CreateProductService, getProductErrorMessage } from '../../data-access';
import { createProductForm, ProductFormFieldsComponent, toCreateProductDto } from '../../ui';
import { ProductModalResult } from '../product-modal-result';

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective, ProductFormFieldsComponent],
  templateUrl: './create-product-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<CreateProductModalComponent, ProductModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly createService = inject(CreateProductService);

  readonly $categories = inject(GetAllCategoriesService).$categories;
  readonly form = createProductForm(inject(FormBuilder));
  readonly #upload = inject(FileUploadService);
  readonly $isUploading = this.#upload.$isUploading;
  readonly $uploadProgress = this.#upload.$progress;
  readonly #isSaving = signal(false);
  // Subiendo la imagen o guardando el producto.
  readonly $isLoading = computed(() => this.#isSaving() || !!this.createService.$isLoading());
  #image: ImageSelection = { kind: 'keep' };

  constructor() {
    effect(() => {
      if (this.createService.$success()) {
        this.dialogRef.close('created');
      }
    });

    effect(() => {
      const status = this.createService.$error();
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

  // La imagen se sube recién al guardar; si falla, el producto no se crea.
  async #save() {
    this.#isSaving.set(true);
    try {
      const imageFileId = await this.#upload.resolveSelection(this.#image, 'products');
      this.createService.create({ ...toCreateProductDto(this.form), ...(imageFileId ? { imageFileId } : {}) });
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
    this.createService.reset();
  }
}
