import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderDashboardComponent, ButtonComponent, IconComponent, CardComponent } from 'src/ui';
import { TablesTableComponent, TablesGridComponent, CreateTableModalComponent } from './features';
import { GetAllTablesService, CreateTableService, UpdateTableService, DeleteTableService } from './data-access';

@Component({
  selector: 'app-table-list',
  imports: [
    HeaderDashboardComponent, ButtonComponent, IconComponent, CardComponent,
    TablesTableComponent, TablesGridComponent,
  ],
  templateUrl: './table-list.component.html',
})
export class TableListComponent implements OnDestroy {
  private readonly dialog = inject(MatDialog);
  protected readonly $getAll = inject(GetAllTablesService);
  protected readonly $createService = inject(CreateTableService);
  protected readonly $updateService = inject(UpdateTableService);
  protected readonly $deleteService = inject(DeleteTableService);

  protected readonly $tables = this.$getAll.$tables;
  protected readonly $isLoading = this.$getAll.$isLoading;
  protected readonly $hasError = this.$getAll.$hasError;
  protected readonly $viewMode = signal<'table' | 'grid'>('grid');

  constructor() {
    effect(() => {
      if (this.$createService.$success()) this.$getAll.retry();
      if (this.$updateService.$success()) this.$getAll.retry();
      if (this.$deleteService.$success()) this.$getAll.retry();
    });
  }

  createTable() { this.dialog.open(CreateTableModalComponent, { width: '90%' }); }

  toggleView() { this.$viewMode.update((v) => (v === 'grid' ? 'table' : 'grid')); }

  onPageChange(page: number) { this.$getAll.setParams({ page }); }
  onPerPageChange(perPage: number) { this.$getAll.setParams({ perPage, page: 1 }); }
  onSearchNameChange(name: string) { this.$getAll.setParams({ name, page: 1 }); }
  onStatusFilterChange(status: string) { this.$getAll.setParams({ status: status || undefined, page: 1 }); }
  retry() { this.$getAll.retry(); }

  ngOnDestroy(): void {
    this.$createService.reset();
    this.$updateService.reset();
    this.$deleteService.reset();
  }
}
