import { Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from 'src/ui';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';
import { PrinterDto } from '../../../printer-list/data-access';
import { STATION_TYPES } from '../station-types';
import { StationForm } from './station-form';

@Component({
  selector: 'app-station-form-fields',
  imports: [ReactiveFormsModule, NgClass, IconComponent],
  templateUrl: './station-form-fields.component.html',
})
export class StationFormFieldsComponent {
  readonly form = input.required<StationForm>();
  readonly printers = input<PrinterDto[]>([]);
  readonly showStatus = input(false);

  readonly $locations = inject(GetAllBusinessLocationsService).$locations;
  readonly types = STATION_TYPES;
  readonly inputClass = 'glass-input w-full rounded-md px-3 py-2';
}
