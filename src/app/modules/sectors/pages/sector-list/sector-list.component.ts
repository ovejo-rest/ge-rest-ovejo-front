import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderDashboardComponent, ButtonComponent, IconComponent, ToastService } from 'src/ui';
import { SectorsTableComponent, CreateSectorModalComponent } from './features';
import { GetAllSectorsService, CreateSectorService, UpdateSectorService, DeleteSectorService } from './data-access';

@Component({
  selector: 'app-sector-list',
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, SectorsTableComponent],
  templateUrl: './sector-list.component.html',
})
export class SectorListComponent implements OnDestroy {
  private readonly dialog = inject(MatDialog);
  protected readonly $getAll = inject(GetAllSectorsService);
  protected readonly $createService = inject(CreateSectorService);
  protected readonly $updateService = inject(UpdateSectorService);
  protected readonly $deleteService = inject(DeleteSectorService);
  private readonly $toast = inject(ToastService);

  protected readonly $sectors = this.$getAll.$sectors;
  protected readonly $isLoading = this.$getAll.$isLoading;
  protected readonly $hasError = this.$getAll.$hasError;

  constructor() {
    console.log(this.$sectors);
    effect(() => {
      if (this.$createService.$success()) this.$getAll.retry();
      if (this.$updateService.$success()) this.$getAll.retry();
      if (this.$deleteService.$success()) this.$getAll.retry();
    });
  }

  createSector() {
    this.dialog.open(CreateSectorModalComponent, { width: '90%' });
  }

  onPageChange(page: number) {
    this.$getAll.setParams({ page });
  }
  onPerPageChange(perPage: number) {
    this.$getAll.setParams({ perPage, page: 1 });
  }
  onSearchNameChange(name: string) {
    this.$getAll.setParams({ name, page: 1 });
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
