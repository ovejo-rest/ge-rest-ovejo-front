import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from 'src/ui';

/** Esqueleto de "Mi perfil" con la misma grilla que la pantalla real. */
@Component({
  selector: 'app-profile-skeleton',
  imports: [SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-busy': 'true', 'aria-label': 'Cargando perfil' },
  template: `
    <div class="mt-2 grid gap-6 pb-10 lg:grid-cols-12 lg:gap-8">
      <div class="glass flex flex-col items-center gap-3 rounded-2xl px-5 py-8 lg:col-span-4">
        <div class="size-28 overflow-hidden rounded-full"><app-skeleton size="3xl" /></div>
        <app-skeleton size="xs" style="width: 70%" />
        <app-skeleton size="xs" style="width: 55%" />
        <app-skeleton size="xs" style="width: 40%" />
        <div class="mt-3 w-full"><app-skeleton size="md" /></div>
      </div>
      <div class="flex flex-col gap-6 lg:col-span-8 lg:gap-8">
        @for (section of [4, 4, 2]; track $index) {
        <div class="glass space-y-4 rounded-2xl p-6">
          <app-skeleton size="xs" style="width: 35%" />
          <div class="grid gap-4 sm:grid-cols-2">
            @for (row of [].constructor(section); track $index) {
            <app-skeleton size="sm" />
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class ProfileSkeletonComponent {}
