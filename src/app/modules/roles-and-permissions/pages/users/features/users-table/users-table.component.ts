import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, input, Output, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
  PaginationTableComponent,
  ProgressBarComponent,
  SlotDirective,
  TableComponent,
} from 'src/ui';
import { FiltersTableUserComponent } from '../../ui';
import { MatDialog } from '@angular/material/dialog';
import { UserDto } from '../../data-access';
import { PaginationMeta } from 'src/app/core/standarized-response/standardized-pagination/pagination-meta.dto';
import { CreateUserModalComponent } from '../create-user-modal';
import { UpdateUserModalComponent } from '../update-user-modal';
import { DeleteUserModalComponent } from '../delete-user-modal';
import { CheckPermissionDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-users-table',
  imports: [
    NgClass,
    TableComponent,
    SlotDirective,
    ButtonComponent,
    IconComponent,
    PaginationTableComponent,
    ProgressBarComponent,
    FiltersTableUserComponent,
    CheckPermissionDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent {
  private readonly dialog = inject(MatDialog);
  readonly $users = input.required<UserDto[]>({ alias: 'users' });
  readonly isLoading = input<boolean | undefined>(false, { alias: 'isLoading' });

  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();
  @Output() searchNameChange = new EventEmitter<string>();
  @Output() retryData = new EventEmitter<void>();

  readonly $pagination = input.required<PaginationMeta>({ alias: 'pagination' });
  headerData = ['Nombre', 'Email', 'Estado', 'Acción'];
  readonly perPage = signal(10);

  createUser() {
    this.dialog.open(CreateUserModalComponent, {
      width: '90%',
      data: {},
    });
  }

  updateUser(item: UserDto) {
    this.dialog.open(UpdateUserModalComponent, {
      width: '90%',
      data: item,
    });
  }

  deleteUser(item: UserDto) {
    this.dialog.open(DeleteUserModalComponent, {
      width: '90%',
      data: item,
    });
  }

  getFullName(user: UserDto): string {
    return `${user.name} ${user.fatherLastName} ${user.motherLastName}`.trim();
  }

  onChangePage(page: number) {
    this.pageChange.emit(page);
  }

  onSearchNameChange(value: string) {
    this.searchNameChange.emit(value);
  }

  onPerPageChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.perPage.set(value);
    this.perPageChange.emit(value);
  }

  retry() {
    this.retryData.emit();
  }
}
