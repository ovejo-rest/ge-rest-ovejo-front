import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { IconComponent } from '../icon';

const AVATAR_COLORS = ['#ea580c', '#0891b2', '#7c3aed', '#16a34a', '#db2777', '#ca8a04', '#2563eb', '#dc2626'];

/**
 * Imagen con respaldo: si no hay URL (o falla) muestra iniciales o un ícono.
 * Las URLs del backend son firmadas y vencen en 1 hora: `expired` avisa (una vez por URL)
 * para que el contenedor vuelva a pedir el recurso.
 */
@Component({
  selector: 'app-image-thumb',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative inline-flex shrink-0 overflow-hidden', '[class.rounded-full]': '$round()', '[class.rounded-lg]': '!$round()' },
  template: `
    @if ($src() && !$failed()) {
      <img [src]="$src()" [alt]="$alt()" class="size-full object-cover" loading="lazy" decoding="async" (error)="onError()" />
    } @else if ($initials()) {
      <span
        class="flex size-full select-none items-center justify-center font-semibold text-white"
        [style.backgroundColor]="$color()"
        [style.fontSize.%]="$initialsScale()"
        role="img"
        [attr.aria-label]="$alt()">
        {{ $initials() }}
      </span>
    } @else {
      <span class="bg-muted text-muted-foreground flex size-full items-center justify-center" role="img" [attr.aria-label]="$alt()">
        <app-icon class="text-[1.15em]">{{ $icon() }}</app-icon>
      </span>
    }
  `,
})
export class ImageThumbComponent {
  readonly $src = input<string | null | undefined>(null, { alias: 'src' });
  readonly $alt = input<string>('', { alias: 'alt' });
  readonly $round = input(false, { alias: 'round', transform: booleanAttribute });
  readonly $icon = input<string>('image', { alias: 'icon' });
  /** Nombre para generar iniciales y color (avatar). Sin nombre se usa el ícono. */
  readonly $name = input<string | null | undefined>(null, { alias: 'name' });
  readonly $initialsScale = input<number>(100, { alias: 'initialsScale' });

  readonly expired = output<void>();

  protected readonly $failed = signal(false);

  protected readonly $initials = computed(() =>
    (this.$name() ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join(''),
  );

  protected readonly $color = computed(() => {
    const name = this.$name() ?? '';
    let hash = 0;
    for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  });

  constructor() {
    // Nueva URL → se vuelve a intentar mostrar.
    effect(() => {
      this.$src();
      this.$failed.set(false);
    });
  }

  protected onError() {
    this.$failed.set(true);
    this.expired.emit();
  }
}
