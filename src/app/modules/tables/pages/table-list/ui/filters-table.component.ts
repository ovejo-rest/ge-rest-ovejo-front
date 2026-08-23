import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from 'src/ui';

@Component({
  selector: 'app-filters-table',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <div class="glass-input flex flex-1 items-center gap-2 rounded-md px-3 py-1.5">
        <app-icon class="text-muted-foreground h-4 w-4">search</app-icon>
        <input type="text" placeholder="Buscar por nombre..." class="bg-transparent text-sm outline-none flex-1" #searchInput (input)="onSearch(searchInput.value)" />
      </div>
      <select class="glass-input rounded-md px-3 py-1.5 text-sm" #statusSelect (change)="onStatusChange(statusSelect.value)">
        <option value="">Todos los estados</option>
        <option value="available">Disponible</option>
        <option value="occupied">Ocupada</option>
        <option value="reserved">Reservada</option>
        <option value="blocked">Bloqueada</option>
      </select>
    </div>
  `,
})
export class FiltersTableComponent {
  @Output() searchNameChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  onSearch(value: string) { this.searchNameChange.emit(value); }
  onStatusChange(value: string) { this.statusChange.emit(value); }
}
