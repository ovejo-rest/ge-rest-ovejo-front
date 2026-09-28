import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
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
    this.updateService.update(toUpdateProductDto(this.form, this.product));
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.updateService.reset();
  }
}
