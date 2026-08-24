import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderDashboardComponent, ButtonComponent, IconComponent } from 'src/ui';
import { BusinessLocationListComponent } from './features/business-location-list';
import {
  CreateBusinessLocationModalComponent,
  UpdateBusinessLocationModalComponent,
  DeleteBusinessLocationModalComponent,
} from './features';
import {
  GetAllBusinessLocationsService,
  CreateBusinessLocationService,
  UpdateBusinessLocationService,
  DeleteBusinessLocationService,
  BusinessLocationDto,
} from './data-access';

@Component({
  selector: 'app-business-location',
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, BusinessLocationListComponent],
  templateUrl: './business-location.component.html',
  styleUrl: './business-location.component.css',
})
export class BusinessLocationComponent implements OnDestroy {
  private readonly dialog = inject(MatDialog);
  protected readonly $getAll = inject(GetAllBusinessLocationsService);
  protected readonly $createService = inject(CreateBusinessLocationService);
  protected readonly $updateService = inject(UpdateBusinessLocationService);
  protected readonly $deleteService = inject(DeleteBusinessLocationService);

  protected readonly $locations = this.$getAll.$locations;
  protected readonly $isLoading = this.$getAll.$isLoading;
  protected readonly $hasError = this.$getAll.$hasError;

  constructor() {
    effect(() => {
      if (this.$createService.$success()) this.$getAll.retry();
      if (this.$updateService.$success()) this.$getAll.retry();
      if (this.$deleteService.$success()) this.$getAll.retry();
    });
  }

  createBusinessLocation() {
    this.dialog.open(CreateBusinessLocationModalComponent, { width: '90%' });
  }

  updateBusinessLocation(item: BusinessLocationDto) {
    this.dialog.open(UpdateBusinessLocationModalComponent, { width: '90%', data: item });
  }

  deleteBusinessLocation(item: BusinessLocationDto) {
    this.dialog.open(DeleteBusinessLocationModalComponent, { width: '90%', data: item });
  }

  retry() {
    this.$getAll.retry();
  }

  ngOnDestroy(): void {
    this.$createService.reset();
    this.$updateService.reset();
    this.$deleteService.reset();
  }
}
