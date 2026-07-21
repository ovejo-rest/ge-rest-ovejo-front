import { Component, EventEmitter, Output, signal } from '@angular/core';
import { debounceTime, filter, Subject } from 'rxjs';
import { FilterTableDto } from 'src/ui/molecules/filters-table/dtos';
import { ButtonComponent, FiltersTableComponent } from 'src/ui';
import { CheckPermissionDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-filters-table-user',
  imports: [FiltersTableComponent, ButtonComponent, CheckPermissionDirective],
  templateUrl: './filters-table-user.component.html',
})
export class FiltersTableUserComponent {
  @Output() searchNameChange = new EventEmitter<string>();

  filtersConfig = signal<FilterTableDto[]>([{ key: 'name', type: 'text', placeholder: 'Buscar por nombre' }]);

  filtersValues = signal<Record<string, string>>({
    name: '',
  });

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        filter((value) => value.length === 0 || value.length >= 4),
      )
      .subscribe((value) => {
        this.searchNameChange.emit(value);
      });
  }

  onFiltersChange(updatedValues: Record<string, string>) {
    this.filtersValues.set(updatedValues);
    this.searchSubject.next(updatedValues['name'] || '');
  }

  clearFilters() {
    this.filtersValues.set({ name: '' });
    this.searchSubject.next('');
  }
}
