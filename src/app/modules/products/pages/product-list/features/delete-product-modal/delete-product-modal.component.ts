import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeleteProductService, getProductErrorMessage, ProductDto } from '../../data-access';
import { ProductModalResult } from '../product-modal-result';

@Component({
  selector: 'app-delete-product-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './delete-product-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProductModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<DeleteProductModalComponent, ProductModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly deleteService = inject(DeleteProductService);

  readonly product = inject<ProductDto>(MAT_DIALOG_DATA);
  readonly $isLoading = this.deleteService.$isLoading;

  constructor() {
    effect(() => {
      if (this.deleteService.$success()) {
        this.dialogRef.close('deleted');
      }
    });

    effect(() => {
      const status = this.deleteService.$error();
      if (status) {
        this.toast.show(getProductErrorMessage(status), 'error');
      }
    });
  }

  handleDelete() {
    this.deleteService.delete(this.product.id);
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.deleteService.reset();
  }
}
