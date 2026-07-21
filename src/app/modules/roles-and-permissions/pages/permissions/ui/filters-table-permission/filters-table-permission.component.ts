import { Component, EventEmitter, Output, signal } from '@angular/core';
import { debounceTime, filter, Subject } from 'rxjs';
import { FilterTableDto } from 'src/ui/molecules/filters-table/dtos';
import { ButtonComponent, FiltersTableComponent } from 'src/ui';

@Component({
  selector: 'app-filters-table-permission',
  imports: [FiltersTableComponent, ButtonComponent],
  templateUrl: './filters-table-permission.component.html',
})
export class FiltersTablePermissionComponent {
  @Output() searchCodeChange = new EventEmitter<string>();
  @Output() searchNameChange = new EventEmitter<string>();

  filtersConfig = signal<FilterTableDto[]>([
    { key: 'code', type: 'text', placeholder: 'Buscar por código' },
    { key: 'name', type: 'text', placeholder: 'Buscar por nombre' },
  ]);

  filtersValues = signal<Record<string, string>>({
    code: '',
    name: '',
  });

  private searchCodeSubject = new Subject<string>();
  private searchNameSubject = new Subject<string>();

  constructor() {
    this.searchCodeSubject
      .pipe(
        debounceTime(300),
        filter((value) => value.length === 0 || value.length >= 4),
      )
      .subscribe((value) => {
        this.searchCodeChange.emit(value);
      });

    this.searchNameSubject
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

    this.searchCodeSubject.next(updatedValues['code'] || '');
    this.searchNameSubject.next(updatedValues['name'] || '');
  }

  clearFilters() {
    this.onFiltersChange({ code: '', name: '' });
  }
}
