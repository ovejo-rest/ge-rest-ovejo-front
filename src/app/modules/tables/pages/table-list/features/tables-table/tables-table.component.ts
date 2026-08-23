import { Component, EventEmitter, input, Output, signal, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import {
  ButtonComponent, IconComponent, PaginationTableComponent,
  ProgressBarComponent, SlotDirective, TableComponent,
} from 'src/ui';
import { FiltersTableComponent } from '../../ui';
import { TableDto, TableStatus } from '../../data-access';
import { PaginationMeta } from 'src/app/core/standarized-response/standardized-pagination/pagination-meta.dto';
import { CreateTableModalComponent } from '../create-table-modal';
import { UpdateTableModalComponent } from '../update-table-modal';
import { DeleteTableModalComponent } from '../delete-table-modal';

@Component({
  selector: 'app-tables-table',
  imports: [
    NgClass, TableComponent, SlotDirective, ButtonComponent,
    PaginationTableComponent, ProgressBarComponent, FiltersTableComponent,
  ],
  templateUrl: './tables-table.component.html',
})
export class TablesTableComponent {
  private readonly dialog = inject(MatDialog);
  readonly $tables = input.required<TableDto[]>({ alias: 'tables' });
  readonly isLoading = input(false, { alias: 'isLoading' });
  readonly $pagination = input.required<PaginationMeta>({ alias: 'pagination' });

  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();
  @Output() searchNameChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<string>();
  @Output() retryData = new EventEmitter<void>();

  readonly headerData = ['Nombre', 'Capacidad', 'Sector', 'Estado', 'Acción'];
  readonly perPage = signal(10);

  createTable() { this.dialog.open(CreateTableModalComponent, { width: '90%' }); }
  updateTable(item: TableDto) { this.dialog.open(UpdateTableModalComponent, { width: '90%', data: item }); }
  deleteTable(item: TableDto) { this.dialog.open(DeleteTableModalComponent, { width: '90%', data: item }); }
  onChangePage(page: number) { this.pageChange.emit(page); }
  onSearchNameChange(value: string) { this.searchNameChange.emit(value); }
  onStatusFilterChange(value: string) { this.statusFilterChange.emit(value); }
  onPerPageChange(event: Event) { const v = Number((event.target as HTMLSelectElement).value); this.perPage.set(v); this.perPageChange.emit(v); }
  retry() { this.retryData.emit(); }

  statusClasses(status: TableStatus): string {
    const map: Record<TableStatus, string> = {
      available: 'bg-green-500/20 text-green-600',
      occupied: 'bg-red-500/20 text-red-600',
      reserved: 'bg-blue-500/20 text-blue-600',
      blocked: 'bg-muted text-muted-foreground',
    };
    return map[status];
  }

  statusLabel(status: TableStatus): string {
    const map: Record<TableStatus, string> = {
      available: 'Disponible',
      occupied: 'Ocupada',
      reserved: 'Reservada',
      blocked: 'Bloqueada',
    };
    return map[status];
  }
}
