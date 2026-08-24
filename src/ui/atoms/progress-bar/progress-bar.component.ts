import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModeDto } from './enums';

@Component({
  selector: 'app-progress-bar',
  imports: [MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent {
  mode = input<ModeDto['mode']>('indeterminate', { alias: 'mode' });
  value = input<ModeDto['value']>(50, { alias: 'value' });
}
