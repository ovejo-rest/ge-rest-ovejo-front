import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonComponent, ProgressBarComponent, SlotDirective, TableComponent } from 'src/ui';
import { CategoryDto } from '../../data-access';

type CategoryRow = { category: CategoryDto; level: number };

@Component({
  selector: 'app-categories-table',
  standalone: true,
  imports: [TableComponent, SlotDirective, ButtonComponent, ProgressBarComponent],
  templateUrl: './categories-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesTableComponent {
  readonly categories = input.required<CategoryDto[]>();
  readonly isLoading = input(false);
  readonly onUpdate = output<CategoryDto>();
  readonly onDelete = output<CategoryDto>();

  readonly headerData = ['Nombre', 'Código corto', 'Descripción'];
  readonly $rows = computed(() => this.flattenCategories(this.categories()));

  handleUpdate(category: CategoryDto) {
    this.onUpdate.emit(category);
  }

  handleDelete(category: CategoryDto) {
    this.onDelete.emit(category);
  }

  private flattenCategories(categories: CategoryDto[], level = 0): CategoryRow[] {
    return categories.flatMap((category) => [
      { category, level },
      ...this.flattenCategories(category.subcategories ?? [], level + 1),
    ]);
  }
}
