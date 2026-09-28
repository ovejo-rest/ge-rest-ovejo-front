import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from 'src/ui';
import { CategoryDto } from '../../../categories/data-access';
import { ProductForm, suggestSku } from './product-form';

@Component({
  selector: 'app-product-form-fields',
  imports: [ReactiveFormsModule, NgClass, IconComponent],
  templateUrl: './product-form-fields.component.html',
})
export class ProductFormFieldsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly form = input.required<ProductForm>();
  readonly categories = input<CategoryDto[]>([]);
  // Solo al crear: al editar, el SKU existente no debe cambiar al renombrar.
  readonly autoSuggestSku = input(true);

  readonly $selectedCategoryId = signal<number | null>(null);
  readonly $subcategories = computed(() => {
    const parent = this.categories().find((category) => category.id === this.$selectedCategoryId());
    return parent?.subcategories ?? [];
  });

  readonly inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100';

  ngOnInit(): void {
    const { name, sku, categoryId, subCategoryId } = this.form().controls;
    this.$selectedCategoryId.set(categoryId.value);

    // Mientras el usuario no edite el SKU, se sugiere a partir del nombre.
    name.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (this.autoSuggestSku() && !sku.dirty) sku.setValue(value?.trim() ? suggestSku(value) : '');
    });

    categoryId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.$selectedCategoryId.set(value);
      subCategoryId.setValue(null);
    });
  }

  regenerateSku() {
    const { name, sku } = this.form().controls;
    sku.setValue(suggestSku(name.value ?? ''));
    sku.markAsDirty();
  }

  isInvalid(control: keyof ProductForm['controls']): boolean {
    const field = this.form().controls[control];
    return field.invalid && field.touched;
  }
}
