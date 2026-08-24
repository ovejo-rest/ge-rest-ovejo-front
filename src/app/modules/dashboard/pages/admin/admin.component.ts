import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PrincipalIndicatorsEnum } from './interface';
import { RouterLink } from '@angular/router';
import { AreaChartComponent, ButtonComponent, CardComponent, HeaderDashboardComponent, IconComponent } from 'src/ui';
import { UsersDashboardTableComponent } from './ui';

@Component({
  selector: 'app-admin',
  imports: [
    HeaderDashboardComponent,
    CardComponent,
    RouterLink,
    ButtonComponent,
    IconComponent,
    UsersDashboardTableComponent,
    AreaChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  indicators: Array<PrincipalIndicatorsEnum>;

  constructor() {
    this.indicators = [
      {
        name: 'Indicador 1',
        action: 'action1',
        numbers: 10009,
      },
      {
        name: 'Indicador 2',
        action: 'action3',
        numbers: 200,
      },
      {
        name: 'Indicador 3',
        action: 'action3',
        numbers: 300,
      },
      {
        name: 'Indicador 4',
        action: 'action4',
        numbers: 400,
      },
    ];
  }
}
