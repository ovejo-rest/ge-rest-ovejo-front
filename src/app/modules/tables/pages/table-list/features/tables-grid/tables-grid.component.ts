import { Component, computed, input } from '@angular/core';
import { IconComponent, ProgressBarComponent } from 'src/ui';
import { TableDto, TableStatus } from '../../data-access';

interface SectorGroup {
  name: string;
  color: string;
  tables: TableDto[];
}

@Component({
  selector: 'app-tables-grid',
  imports: [IconComponent, ProgressBarComponent],
  templateUrl: './tables-grid.component.html',
})
export class TablesGridComponent {
  readonly $tables = input.required<TableDto[]>({ alias: 'tables' });
  readonly isLoading = input(false, { alias: 'isLoading' });

  readonly $sectors = computed<SectorGroup[]>(() => {
    const map = new Map<string, SectorGroup>();
    for (const t of this.$tables()) {
      const key = t.sectorName || 'Sin sector';
      if (!map.has(key)) map.set(key, { name: key, color: t.sectorColor || '#6E56CF', tables: [] });
      map.get(key)!.tables.push(t);
    }
    return Array.from(map.values());
  });

  statusClasses(status: TableStatus): string {
    const map: Record<TableStatus, string> = {
      available: 'border-green-500 bg-green-500/10 text-green-600',
      occupied: 'border-red-500 bg-red-500/10 text-red-600',
      reserved: 'border-blue-500 bg-blue-500/10 text-blue-600',
      blocked: 'border-muted bg-muted/20 text-muted-foreground',
    };
    return map[status];
  }

  statusIcon(status: TableStatus): string {
    const map: Record<TableStatus, string> = {
      available: 'check_circle',
      occupied: 'group',
      reserved: 'event',
      blocked: 'block',
    };
    return map[status];
  }
}
