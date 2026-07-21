import { Component } from '@angular/core';
import { CardComponent, SlotDirective } from 'src/ui';

@Component({
  selector: 'app-contact-profile-card-skeleton',
  imports: [CardComponent, SlotDirective],
  template: `<app-card>
    <ng-template app-slot="header">
      <div class="bg-muted mt-2 mb-2 h-7 w-40 animate-pulse rounded"></div>
    </ng-template>

    <div class="grid grid-cols-4 gap-4 p-2">
      <div class="col-span-4 md:col-span-2">
        <div class="bg-muted mb-1 h-4 w-16 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
      <div class="col-span-4 md:col-span-2">
        <div class="bg-muted mb-1 h-4 w-16 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
      <div class="col-span-4 md:col-span-2">
        <div class="bg-muted mb-1 h-4 w-20 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
      <div class="col-span-4 md:col-span-2">
        <div class="bg-muted mb-1 h-4 w-12 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
      <div class="col-span-4">
        <div class="bg-muted mb-1 h-4 w-16 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
      <div class="col-span-2">
        <div class="bg-muted mb-1 h-4 w-16 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
      <div class="col-span-2">
        <div class="bg-muted mb-1 h-4 w-16 animate-pulse rounded"></div>
        <div class="bg-muted h-9 w-full animate-pulse rounded"></div>
      </div>
    </div>

    <ng-template app-slot="footer">
      <div class="bg-muted h-9 w-40 animate-pulse rounded"></div>
    </ng-template>
  </app-card> `,
})
export class ContactProfileCardSkeletonComponent {}
