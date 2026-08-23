import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRut]',
  standalone: true,
})
export class RutFormatDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 9);

    if (digits.length <= 1) {
      this.setValue(digits);
      return;
    }

    const body = digits.slice(0, -1);
    const dv = digits.slice(-1);
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;

    this.setValue(formatted);
  }

  private setValue(value: string) {
    this.control.control?.setValue(value, { emitEvent: false });
  }
}
