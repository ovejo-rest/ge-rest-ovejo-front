import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../atoms';

@Component({
  selector: 'app-empty-state',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly $icon = input<string>('inbox', { alias: 'icon' });

  readonly $title = input.required<string>({ alias: 'title' });

  readonly $description = input<string>(undefined, { alias: 'description' });
}
