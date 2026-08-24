import { HttpClient } from '@angular/common/http';
import { Component, computed, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AvatarService } from 'src/app/core/services/avatar.service';
import { PaginationMeta } from 'src/app/core/standarized-response/standardized-pagination/pagination-meta.dto';
import { dummyData } from 'src/app/shared/dummy/user.dummy';
import { BadgeComponent } from 'src/ui/atoms';
import { TableComponent } from 'src/ui/templates/table';
import { PaginationTableComponent } from 'src/ui/molecules/pagination-table';
import { SlotDirective } from 'src/ui/utils';
import { User } from '../../../uikit/pages/table/model/user.model';

@Component({
  selector: 'app-table-page',
  imports: [FormsModule, BadgeComponent, TableComponent, PaginationTableComponent, SlotDirective],
  templateUrl: './table.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './table.page.css',
})
export class TablePage implements OnInit {
  readonly allUsers = signal<User[]>([]);

  readonly searchField = signal('');
  readonly statusField = signal('');
  readonly orderField = signal('');

  readonly currentPage = signal(1);
  readonly perPage = signal(10);

  readonly filteredUsers = computed(() => {
    const search = this.searchField().toLowerCase();
    const status = this.statusField();
    const order = this.orderField();

    return this.allUsers()
      .filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone.includes(search),
      )
      .filter((user) => {
        if (!status) return true;
        switch (status) {
          case '1':
            return user.status === 1;
          case '2':
            return user.status === 2;
          case '3':
            return user.status === 3;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        const defaultNewest = !order || order === '1';
        if (defaultNewest) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (order === '2') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return 0;
      });
  });

  readonly paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.perPage();
    return this.filteredUsers().slice(start, start + this.perPage());
  });

  readonly paginationMeta = computed<PaginationMeta>(() => {
    const totalItems = this.filteredUsers().length;
    const perPage = this.perPage();
    return {
      page: this.currentPage(),
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage) || 1,
    };
  });

  constructor(private readonly http: HttpClient, protected readonly avatarService: AvatarService) {
    this.http.get<User[]>('https://freetestapi.com/api/v1/users?limit=8').subscribe({
      next: (data) => this.allUsers.set(data),
      error: (error) => {
        this.allUsers.set(dummyData);
        const msg = 'An error occurred while fetching users. Loading dummy data as fallback.';
        toast.error(msg, {
          position: 'bottom-right',
          description: error.message,
          action: {
            label: 'Undo',
            onClick: () => console.log('Action!'),
          },
          actionButtonStyle: 'background-color:#DC2626; color:white;',
        });
      },
    });
  }

  ngOnInit() {}

  onSearchChange(value: string) {
    this.searchField.set(value);
    this.currentPage.set(1);
  }

  onStatusChange(value: string) {
    this.statusField.set(value);
    this.currentPage.set(1);
  }

  onOrderChange(value: string) {
    this.orderField.set(value);
    this.currentPage.set(1);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPerPageChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.perPage.set(value);
    this.currentPage.set(1);
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.allUsers.update((users) => users.map((user) => ({ ...user, selected: checked })));
  }
}
