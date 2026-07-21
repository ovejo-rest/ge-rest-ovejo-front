import { Component } from '@angular/core';
import { CardComponent, DividerComponent, SkeletonComponent, SlotDirective } from 'src/ui';

@Component({
  selector: 'app-tarjet-profile-card-skeleton',
  imports: [CardComponent, SkeletonComponent, DividerComponent, SlotDirective],
  template: `<app-card>
    <div class="flex flex-col items-center pt-4 pb-4">
      <div class="size-34 overflow-hidden rounded-full">
        <app-skeleton size="xl" />
      </div>
      <div class="mt-2 w-1/2">
        <app-skeleton size="xs" />
      </div>
      <div class="mt-1 w-1/3">
        <app-skeleton size="xs" />
      </div>
    </div>
    <app-divider />
    <div class="mt-2 mb-2 flex justify-center">
      <div class="w-2/3">
        <app-skeleton size="xs" />
      </div>
    </div>
    <ng-template app-slot="footer">
      <div class="flex justify-center">
        <div class="w-2/3">
          <app-skeleton size="sm" />
        </div>
      </div>
    </ng-template>
  </app-card>`,
})
export class TarjetProfileCardSkeletonComponent {}
