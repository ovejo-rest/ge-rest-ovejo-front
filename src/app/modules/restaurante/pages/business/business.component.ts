import { Component, inject } from '@angular/core';
import { ButtonComponent, CardComponent, HeaderDashboardComponent, IconComponent } from 'src/ui';
import { FindMyBusinessesService } from './data-access';
import { BusinessDetailComponent } from './features';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewBusinessModalComponent } from './features';
import { BusinessDetailSkeletonComponent } from './ui';

@Component({
  selector: 'app-business',
  imports: [
    HeaderDashboardComponent,
    ButtonComponent,
    IconComponent,
    BusinessDetailComponent,
    BusinessDetailSkeletonComponent,
    CardComponent,
  ],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css',
})
export class BusinessComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly $findMyBusinessesService = inject(FindMyBusinessesService);

  constructor() {
    this.$findMyBusinessesService.retry();
  }

  get business() {
    return this.$findMyBusinessesService.$businesses()?.[0];
  }

  get isLoading() {
    return this.$findMyBusinessesService.$isLoading();
  }

  retry() {
    this.$findMyBusinessesService.retry();
  }

  createNewBusiness() {
    this.dialog.open(CreateNewBusinessModalComponent, {
      width: '90%',
      data: {},
    });
  }
}
