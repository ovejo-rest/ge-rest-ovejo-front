import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { HeaderDashboardComponent, ButtonComponent, IconComponent, CardComponent } from 'src/ui';

import { TablesTableComponent, TablesGridComponent, CreateTableModalComponent, SectorTabsComponent } from './features';

import { GetAllTablesService, CreateTableService, UpdateTableService, DeleteTableService } from './data-access';

import { BusinessLocationSelector } from 'src/app/modules/sectors/pages/sector-list/ui';
import { GetAllSectorsService } from 'src/app/modules/sectors/pages/sector-list/data-access';

@Component({
  selector: 'app-table-list',

  imports: [
    HeaderDashboardComponent,
    ButtonComponent,
    IconComponent,
    CardComponent,
    TablesTableComponent,
    TablesGridComponent,
    BusinessLocationSelector,
    SectorTabsComponent,
  ],

  templateUrl: './table-list.component.html',
})
export class TableListComponent implements OnDestroy {
  private readonly dialog = inject(MatDialog);

  protected readonly $getAll = inject(GetAllTablesService);
  protected readonly $sectorsService = inject(GetAllSectorsService);

  protected readonly $createService = inject(CreateTableService);
  protected readonly $updateService = inject(UpdateTableService);
  protected readonly $deleteService = inject(DeleteTableService);

  protected readonly $tables = this.$getAll.$tables;
  protected readonly $sectors = this.$sectorsService.$sectors;

  protected readonly $isLoading = this.$getAll.$isLoading;
  protected readonly $hasError = this.$getAll.$hasError;

  protected readonly $viewMode = signal<'table' | 'grid'>('grid');
  protected readonly $selectedSectorId = signal<number | null>(null);

  protected readonly $filteredTables = computed(() => {
    const tables = this.$tables();
    const sectorId = this.$selectedSectorId();
    if (sectorId === null) return tables;
    return tables.filter((t) => t.sectorId === sectorId);
  });

  constructor() {
    effect(() => {
      if (this.$createService.$success()) {
        this.$getAll.retry();
      }

      if (this.$updateService.$success()) {
        this.$getAll.retry();
      }

      if (this.$deleteService.$success()) {
        this.$getAll.retry();
      }
    });
  }

  createTable() {
    this.dialog.open(CreateTableModalComponent, {
      width: '90%',
    });
  }

  toggleView() {
    this.$viewMode.update((v) => (v === 'grid' ? 'table' : 'grid'));
  }

  onLocationSelected(locationId: number) {
    this.$getAll.setParams(locationId);
    this.$sectorsService.setParams({ locationId });
    this.$selectedSectorId.set(null);
  }

  onSectorSelected(sectorId: number | null) {
    this.$selectedSectorId.set(sectorId);
  }

  retry() {
    this.$getAll.retry();
  }

  ngOnDestroy(): void {
    this.$createService.reset();
    this.$updateService.reset();
    this.$deleteService.reset();
  }
}
