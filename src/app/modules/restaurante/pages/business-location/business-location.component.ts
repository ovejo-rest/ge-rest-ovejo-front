import { Component, inject } from '@angular/core';
import { HeaderDashboardComponent, ButtonComponent, IconComponent, CardComponent } from 'src/ui';
import { BusinessLocationListComponent } from './features/business-location-list';
import { MatDialog } from '@angular/material/dialog.d-Dvsbu-0E';
import { CreateBusinessLocationModalComponent } from './features';

@Component({
  selector: 'app-business-location',
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, BusinessLocationListComponent],
  templateUrl: './business-location.component.html',
  styleUrl: './business-location.component.css',
})
export class BusinessLocationComponent {
  private readonly dialog = inject(MatDialog);

  createBusinessLocation() {
    this.dialog.open(CreateBusinessLocationModalComponent, {
      width: '90%',
      data: {},
    });
  }
}
