import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessLocationSelector } from './business-location-selector';

@Component({
  selector: 'app-filters-sector-table',
  imports: [FormsModule, BusinessLocationSelector],
  template: `
    <div class="flex items-center gap-2">
      <!-- Sucursal -->
      <div class="w-56">
        <app-business-location-selector (selectedLocationChange)="onLocationSelected($event)" />
      </div>
    </div>
  `,
})
export class FiltersSectorTableComponent {
  @Output() searchNameChange = new EventEmitter<string>();
  @Output() locationIdChange = new EventEmitter<number>();

  onSearch(value: string) {
    this.searchNameChange.emit(value);
  }

  onLocationSelected(id: number) {
    this.locationIdChange.emit(id);
  }
}
