import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { PaginationMeta } from 'src/app/core/standarized-response/standardized-pagination/pagination-meta.dto';
import { IconComponent } from 'src/ui/atoms';

@Component({
  selector: 'app-pagination-table',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pagination-table.component.html',
})
export class PaginationTableComponent {
  $pagination = input.required<PaginationMeta>({ alias: 'pagination' });

  pageChange = output<number>({ alias: 'pageChange' });

  get fromItem(): number {
    const { page, perPage } = this.$pagination();
    return (page - 1) * perPage + 1;
  }

  get toItem(): number {
    const { page, perPage, totalItems } = this.$pagination();
    return Math.min(page * perPage, totalItems);
  }

  get totalPages(): number {
    const pagination = this.$pagination();
    return pagination.totalPages ?? Math.ceil(pagination.totalItems / pagination.perPage);
  }

  get pages(): number[] {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page !== this.$pagination().page && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  previousPage() {
    const currentPage = this.$pagination().page;
    if (currentPage > 1) {
      this.pageChange.emit(currentPage - 1);
    }
  }

  nextPage() {
    const currentPage = this.$pagination().page;
    if (currentPage < this.totalPages) {
      this.pageChange.emit(currentPage + 1);
    }
  }
}
