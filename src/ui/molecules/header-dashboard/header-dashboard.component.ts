import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header-dashboard',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header-dashboard.component.html',
})
export class HeaderDashboardComponent {
  readonly $title = input<string>(undefined, { alias: 'title' });

  readonly $subtitle = input<string>(undefined, { alias: 'subtitle' });

  clickedButton() {
    console.log('holas');
  }
}
