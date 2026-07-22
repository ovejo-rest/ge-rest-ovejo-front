import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  imports: [],
  templateUrl: './toggle.component.html',
})
export class ToggleComponent {
  readonly $checked = input<boolean>(false, { alias: 'checked' });
  readonly $disabled = input<boolean>(false, { alias: 'disabled' });

  readonly $changed = output<boolean>({ alias: 'changed' });

  onChange(event: Event) {
    this.$changed.emit((event.target as HTMLInputElement).checked);
  }
}
