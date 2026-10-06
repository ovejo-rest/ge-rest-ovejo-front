import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Icon } from '../ui/icon';
import { BRAND_COLORS, BrandColor, LandingTheme } from '../ui/theme';

/** Demostración: el visitante prueba los colores con los que cada restaurante personaliza la app. */
@Component({
  selector: 'lnd-brand-colors',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="tu-marca" class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28" aria-labelledby="brand-title">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p class="text-primary text-sm font-semibold uppercase tracking-wider">Tu marca</p>
          <h2 id="brand-title" class="mt-2 text-3xl font-semibold sm:text-4xl">La app con los colores de tu restaurante</h2>
          <p class="text-muted-foreground mt-4">
            Elige el color de tu marca y todo tu equipo lo verá en el POS, la cocina y el panel. Además, cada persona puede usar el modo claro u oscuro, o dejar el de su dispositivo.
          </p>

          <p class="mt-8 text-sm font-medium">Pruébalo aquí:</p>
          <div class="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Color de marca de ejemplo">
            @for (color of colors; track color.name) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="theme.color() === color.name"
              [attr.aria-label]="color.label"
              [title]="color.label"
              class="flex size-11 items-center justify-center rounded-full text-white shadow-sm ring-offset-2 ring-offset-[var(--background)] transition-transform hover:scale-110"
              [class.ring-2]="theme.color() === color.name"
              [class.ring-foreground]="theme.color() === color.name"
              [style.backgroundColor]="color.hex"
              (click)="pick(color.name)">
              @if (theme.color() === color.name) { <lnd-icon name="check" class="size-5" /> }
            </button>
            }
          </div>
          <p class="text-muted-foreground mt-3 text-xs" aria-live="polite">Color de ejemplo: {{ currentLabel() }}</p>
        </div>

        <!-- Vista previa (ilustración) -->
        <div class="lnd-card rounded-[1.75rem] p-5 sm:p-6" aria-hidden="true">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="bg-primary flex size-9 items-center justify-center rounded-xl p-2 text-white"><lnd-icon name="logo" class="size-5" /></span>
              <span class="font-semibold">Tu restaurante</span>
            </div>
            <span class="bg-primary/15 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">Mesa 4</span>
          </div>
          <div class="mt-5 space-y-2">
            @for (line of lines; track line.item) {
            <div class="flex items-center justify-between rounded-xl border border-border/60 bg-[color-mix(in_srgb,var(--background)_60%,transparent)] px-3 py-2.5 text-sm">
              <span><span class="text-primary font-semibold">{{ line.qty }}×</span> {{ line.item }}</span>
              <span class="text-muted-foreground">{{ line.price }}</span>
            </div>
            }
          </div>
          <div class="mt-4 flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Total</span>
            <span class="text-lg font-semibold">$ 15.900</span>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <span class="rounded-full border border-border py-2.5 text-center text-sm font-semibold">Agregar</span>
            <span class="bg-primary rounded-full py-2.5 text-center text-sm font-semibold text-white">Enviar a cocina</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BrandColors {
  protected readonly theme = inject(LandingTheme);
  protected readonly colors = BRAND_COLORS;
  protected readonly currentLabel = computed(() => BRAND_COLORS.find((c) => c.name === this.theme.color())?.label ?? '');
  protected readonly lines = [
    { qty: 2, item: 'Completo italiano', price: '$ 7.800' },
    { qty: 1, item: 'Papas fritas', price: '$ 3.500' },
    { qty: 2, item: 'Limonada menta', price: '$ 4.600' },
  ];

  pick(color: BrandColor) {
    this.theme.color.set(color);
  }
}
