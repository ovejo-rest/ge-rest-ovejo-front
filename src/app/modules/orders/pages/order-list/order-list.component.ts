import { Component, effect, inject, OnDestroy } from '@angular/core';
import { HeaderDashboardComponent, ButtonComponent, IconComponent } from 'src/ui';
import { OrdersTableComponent } from './features';
import { GetAllOrdersService, UpdateOrderStatusService } from './data-access';

@Component({
  selector: 'app-order-list',
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, OrdersTableComponent],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnDestroy {
  protected readonly $getAll = inject(GetAllOrdersService);
  protected readonly $updateStatus = inject(UpdateOrderStatusService);

  protected readonly $orders = this.$getAll.$orders;
  protected readonly $isLoading = this.$getAll.$isLoading;
  protected readonly $hasError = this.$getAll.$hasError;

  constructor() {
    effect(() => { if (this.$updateStatus.$success()) this.$getAll.retry(); });
  }

  onPageChange(p: number) { this.$getAll.setParams({ page: p }); }
  onPerPageChange(pp: number) { this.$getAll.setParams({ perPage: pp, page: 1 }); }
  onSearchTable(v: string) { this.$getAll.setParams({ tableName: v, page: 1 }); }
  onStatusFilter(v: string) { this.$getAll.setParams({ status: v || undefined, page: 1 }); }
  retry() { this.$getAll.retry(); }

  ngOnDestroy(): void { this.$updateStatus.reset(); }
}
