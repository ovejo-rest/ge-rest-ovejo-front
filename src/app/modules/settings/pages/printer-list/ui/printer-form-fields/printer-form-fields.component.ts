import { Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from 'src/ui';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';
import { PrinterForm } from './printer-form';

@Component({
  selector: 'app-printer-form-fields',
  imports: [ReactiveFormsModule, NgClass, IconComponent],
  templateUrl: './printer-form-fields.component.html',
})
export class PrinterFormFieldsComponent {
  readonly form = input.required<PrinterForm>();
  readonly showStatus = input(false);

  readonly $locations = inject(GetAllBusinessLocationsService).$locations;
  readonly inputClass = 'glass-input w-full rounded-md px-3 py-2';

  isInvalid(control: keyof PrinterForm['controls']): boolean {
    const field = this.form().controls[control];
    return field.invalid && field.touched;
  }
}
