import { Component, input, output } from '@angular/core';
import { ServiceStaffDto } from '../../data-access';

@Component({
  selector: 'app-filters-order-table',
  templateUrl: './filters-order-table.component.html',
})
export class FiltersOrderTableComponent {
  readonly staff = input<ServiceStaffDto[]>([]);
  readonly waiter = input<string | null>(null);
  readonly waiterChange = output<string | null>();

  onWaiterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.waiterChange.emit(value || null);
  }
}
