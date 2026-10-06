import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { IconComponent } from 'src/ui';
import { CategoryDto } from '../../../categories/data-access';

export type ProductTableFilters = Readonly<{ search: string; categoryId: number | null }>;

@Component({
  selector: 'app-filters-product-table',
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './filters-product-table.component.html',
})
export class FiltersProductTableComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = input<CategoryDto[]>([]);
  readonly initialFilters = input<ProductTableFilters>({ search: '', categoryId: null });
  readonly filtersChange = output<ProductTableFilters>();

  readonly form = this.fb.group({
    search: [''],
    categoryId: [null as number | null],
  });

  ngOnInit(): void {
    this.form.setValue(this.initialFilters(), { emitEvent: false });

    this.form.controls.search.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emit());

    this.form.controls.categoryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emit());
  }

  get hasFilters(): boolean {
    const { search, categoryId } = this.form.getRawValue();
    return !!search?.trim() || categoryId !== null;
  }

  clear() {
    this.form.setValue({ search: '', categoryId: null }, { emitEvent: false });
    this.emit();
  }

  private emit() {
    const { search, categoryId } = this.form.getRawValue();
    this.filtersChange.emit({ search: search?.trim() ?? '', categoryId });
  }
}
