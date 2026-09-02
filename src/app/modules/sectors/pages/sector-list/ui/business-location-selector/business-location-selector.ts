import { Component, effect, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';

@Component({
  selector: 'app-business-location-selector',
  imports: [FormsModule],
  template: `
    @if ($isLoading()) {

    <div class="bg-muted h-[42px] w-full animate-pulse rounded-lg"></div>

    } @else {

    <select
      class="glass-input w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
      [(ngModel)]="selectedLocationId"
      (ngModelChange)="onLocationChange($event)">
      @for (location of ($locations() ?? []); track location.id) {
      <option [ngValue]="location.id">
        {{ location.name }}
      </option>
      }
    </select>
    }
  `,
})
export class BusinessLocationSelector {
  protected readonly $getAll = inject(GetAllBusinessLocationsService);

  protected readonly $locations = this.$getAll.$locations;

  protected readonly $isLoading = this.$getAll.$isLoading;

  protected readonly $hasError = this.$getAll.$hasError;

  selectedLocationId: number | null = null;

  selectedLocationChange = output<number>();

  constructor() {
    effect(() => {
      const locations = this.$locations();

      if (locations?.length && this.selectedLocationId === null) {
        const firstLocation = locations[0];

        this.selectedLocationId = firstLocation.id;

        this.selectedLocationChange.emit(firstLocation.id);
      }
    });
  }

  onLocationChange(id: number) {
    if (id) {
      this.selectedLocationId = id;
      this.selectedLocationChange.emit(id);
    }
  }
}
