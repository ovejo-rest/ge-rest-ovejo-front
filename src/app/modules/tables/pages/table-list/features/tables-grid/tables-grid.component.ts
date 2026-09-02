import { Component, computed, input } from '@angular/core';
import { IconComponent, ProgressBarComponent } from 'src/ui';
import { TableDto, TableStatus } from '../../data-access';
import { SectorDto } from 'src/app/modules/sectors/pages/sector-list/data-access';

interface SectorGroup {
  name: string;
  sectorId: number | null;
  tables: TableDto[];
}

@Component({
  selector: 'app-tables-grid',
  imports: [IconComponent, ProgressBarComponent],
  templateUrl: './tables-grid.component.html',
})
export class TablesGridComponent {
  readonly $tables = input.required<TableDto[]>({ alias: 'tables' });
  readonly $sectors = input<SectorDto[]>([], { alias: 'sectors' });
  readonly isLoading = input(false, { alias: 'isLoading' });

  readonly $groups = computed<SectorGroup[]>(() => {
    const sectors = this.$sectors();
    const sectorMap = new Map<number, string>();
    for (const s of sectors) {
      sectorMap.set(s.id, s.name);
    }

    const groups = new Map<string, SectorGroup>();
    for (const t of this.$tables()) {
      const key = t.sectorId !== null ? `sector-${t.sectorId}` : 'no-sector';
      if (!groups.has(key)) {
        const name = t.sectorId !== null ? (sectorMap.get(t.sectorId) ?? `Sector ${t.sectorId}`) : 'Sin sector';
        groups.set(key, { name, sectorId: t.sectorId, tables: [] });
      }
      groups.get(key)!.tables.push(t);
    }
    return Array.from(groups.values());
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
