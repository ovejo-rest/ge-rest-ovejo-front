import { Component, inject } from '@angular/core';
import { HeaderDashboardComponent, CardComponent, AreaChartComponent, ButtonComponent, IconComponent } from 'src/ui';
import { KpiCardComponent, RecentOrdersTableComponent } from './features';
import { DashboardSkeletonComponent } from './ui';
import { GetDashboardMetricsService } from './data-access';
@Component({
  selector: 'app-admin',
  imports: [
    HeaderDashboardComponent, CardComponent, AreaChartComponent,
    ButtonComponent, IconComponent,
    KpiCardComponent, RecentOrdersTableComponent, DashboardSkeletonComponent,
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  protected readonly $metricsService = inject(GetDashboardMetricsService);

  protected readonly $metrics = this.$metricsService.$metrics;
  protected readonly $isLoading = this.$metricsService.$isLoading;
  protected readonly $hasError = this.$metricsService.$hasError;
}
