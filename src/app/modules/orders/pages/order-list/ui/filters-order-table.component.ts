import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from 'src/ui';

@Component({
  selector: 'app-filters-order-table',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <div class="glass-input flex flex-1 items-center gap-2 rounded-md px-3 py-1.5">
        <app-icon class="text-muted-foreground h-4 w-4">search</app-icon>
        <input type="text" placeholder="Buscar por mesa..." class="bg-transparent text-sm outline-none flex-1" #searchInput (input)="onSearch(searchInput.value)" />
      </div>
      <select class="glass-input rounded-md px-3 py-1.5 text-sm" #statusSelect (change)="onStatus(statusSelect.value)">
        <option value="">Todos</option>
        <option value="received">Recibido</option>
        <option value="pending">Pendiente</option>
        <option value="in_progress">En preparación</option>
        <option value="ready">Listo</option>
        <option value="delivered">Entregado</option>
        <option value="completed">Completado</option>
        <option value="cancelled">Cancelado</option>
      </select>
    </div>
  `,
})
export class FiltersOrderTableComponent {
  @Output() searchTableChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  onSearch(v: string) { this.searchTableChange.emit(v); }
  onStatus(v: string) { this.statusChange.emit(v); }
}
