import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCase]',
  standalone: true,
})
export class CaseTransformDirective {
  @Input('appCase') caseType: 'upper' | 'lower' | 'capitalize' = 'upper';

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value == null) return;

    let transformed = value;

    switch (this.caseType) {
      case 'upper':
        transformed = value.toUpperCase();
        break;
      case 'lower':
        transformed = value.toLowerCase();
        break;
      case 'capitalize':
        transformed = value.replace(/\b\w/g, (char) => char.toUpperCase());
        break;
    }

    this.control.control?.setValue(transformed, { emitEvent: false });
  }
}
