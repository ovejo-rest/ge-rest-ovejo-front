import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { DeleteCategoryService, CategoryDto, getCategoryErrorMessage } from '../../data-access';
import { CategoryModalResult } from '../category-modal-result';

@Component({
  selector: 'app-delete-category-modal',
  standalone: true,
  imports: [ButtonComponent, ModalCardComponent, SlotDirective],
  templateUrl: './delete-category-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCategoryModalComponent implements OnDestroy {
  private readonly dialogRef = inject<MatDialogRef<DeleteCategoryModalComponent, CategoryModalResult>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly deleteService = inject(DeleteCategoryService);
  readonly category = inject<CategoryDto>(MAT_DIALOG_DATA);

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
        this.toast.show(getCategoryErrorMessage(status), 'error');
      }
    });
  }

  handleDelete() {
    this.deleteService.delete(this.category.id);
  }

  handleCancel() {
    this.dialogRef.close('cancelled');
  }

  ngOnDestroy(): void {
    this.deleteService.reset();
  }
}
