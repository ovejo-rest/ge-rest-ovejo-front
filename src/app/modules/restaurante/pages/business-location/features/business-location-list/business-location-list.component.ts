import { Component, input, output } from '@angular/core';
import { ButtonComponent, ProgressBarComponent, TableComponent, SlotDirective } from 'src/ui';
import { BusinessLocationDto } from '../../data-access';

@Component({
  selector: 'app-business-location-list',
  imports: [TableComponent, SlotDirective, ButtonComponent, ProgressBarComponent],
  templateUrl: './business-location-list.component.html',
  styleUrl: './business-location-list.component.css',
})
export class BusinessLocationListComponent {
  readonly $locations = input.required<BusinessLocationDto[]>({ alias: 'locations' });
  readonly isLoading = input(false, { alias: 'isLoading' });

  readonly update = output<BusinessLocationDto>();
  readonly delete = output<BusinessLocationDto>();

  readonly headerData = ['Nombre', 'Ciudad', 'País', 'Dirección', 'Acción'];

  onUpdate(item: BusinessLocationDto) { this.update.emit(item); }
  onDelete(item: BusinessLocationDto) { this.delete.emit(item); }
}
