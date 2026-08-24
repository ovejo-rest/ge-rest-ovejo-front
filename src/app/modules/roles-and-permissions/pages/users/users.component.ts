import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent, HeaderDashboardComponent, IconComponent, CaseTransformDirective } from 'src/ui';
import { GetAllUsersService } from './data-access';
import { CreateUserModalComponent, UsersTableComponent } from './features';
import { MatDialog } from '@angular/material/dialog';
import { CheckPermissionDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-users',
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, UsersTableComponent, CheckPermissionDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './users.component.html',
})
export class UsersComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly $service = inject(GetAllUsersService);

  page = 1;

  constructor() {
    this.$service.retry();
  }

  retry() {
    this.$service.retry();
  }

  createUser() {
    this.dialog.open(CreateUserModalComponent, {
      width: '90%',
      data: {},
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.$service.setParams({ page });
  }

  onPerPageChange(perPage: number) {
    this.$service.setParams({ perPage, page: 1 });
  }

  onSearchNameChange(name: string) {
    this.$service.setParams({ name, page: 1 });
  }
}
