import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
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
    this.createService.create(toCreateProductDto(this.form));
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.createService.reset();
  }
}
