import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { createQrDataUrl } from './qr-image';

@Component({
  selector: 'app-table-qr-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if ($dataUrl(); as src) {
    <img [src]="src" [alt]="alt()" class="h-auto w-full rounded-lg bg-white p-2" />
    } @else {
    <div class="bg-muted/30 aspect-square w-full animate-pulse rounded-lg"></div>
    }
  `,
})
export class TableQrCodeComponent {
  readonly value = input.required<string>();
  readonly alt = input('Código QR');

  readonly $dataUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const value = this.value();
      this.$dataUrl.set(null);
      createQrDataUrl(value).then((url) => {
        if (this.value() === value) this.$dataUrl.set(url);
      });
    });
  }
}
