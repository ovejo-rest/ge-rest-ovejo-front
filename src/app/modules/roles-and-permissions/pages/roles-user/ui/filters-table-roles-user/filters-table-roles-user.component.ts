import { Component, EventEmitter, Output, signal } from '@angular/core';
import { debounceTime, filter, Subject } from 'rxjs';
import { FilterTableDto } from 'src/ui/molecules/filters-table/dtos';
import { ButtonComponent, FiltersTableComponent } from 'src/ui';

@Component({
  selector: 'app-filters-table-roles-user',
  imports: [FiltersTableComponent, ButtonComponent],
  templateUrl: './filters-table-roles-user.component.html',
})
export class FiltersTableRolesUserComponent {
  @Output() searchFullNameChange = new EventEmitter<string>();

  filtersConfig = signal<FilterTableDto[]>([
    { key: 'fullName', type: 'text', placeholder: 'Buscar por nombre completo' },
  ]);

  filtersValues = signal<Record<string, string>>({
    fullName: '',
  });

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        filter((value) => value.length === 0 || value.length >= 4),
      )
      .subscribe((value) => {
        this.searchFullNameChange.emit(value);
      });
  }

  onFiltersChange(updatedValues: Record<string, string>) {
    this.filtersValues.set(updatedValues);
    this.searchSubject.next(updatedValues['fullName'] || '');
  }

  clearFilters() {
    this.filtersValues.set({ fullName: '' });
    this.searchSubject.next('');
  }
}
