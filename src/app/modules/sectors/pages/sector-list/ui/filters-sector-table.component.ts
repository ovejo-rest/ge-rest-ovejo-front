import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from 'src/ui';

@Component({
  selector: 'app-filters-sector-table',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="flex items-center gap-2">
      <div class="glass-input flex flex-1 items-center gap-2 rounded-md px-3 py-1.5">
        <app-icon class="text-muted-foreground h-4 w-4">search</app-icon>
        <input type="text" placeholder="Buscar por nombre..." class="bg-transparent text-sm outline-none flex-1" #searchInput (input)="onSearch(searchInput.value)" />
      </div>
    </div>
  `,
})
export class FiltersSectorTableComponent {
  @Output() searchNameChange = new EventEmitter<string>();
  onSearch(value: string) { this.searchNameChange.emit(value); }
}
