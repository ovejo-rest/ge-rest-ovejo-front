import { Component } from '@angular/core';
import { CardComponent, SkeletonComponent } from 'src/ui';

@Component({
  selector: 'app-dashboard-skeleton',
  imports: [CardComponent, SkeletonComponent],
  template: `
    <div class="text-muted-foreground grid grid-cols-1 content-between gap-4 md:grid-cols-2 xl:grid-cols-4">
      @for (_ of [1, 2, 3, 4]; track $index) {
      <app-card>
        <div class="flex items-center gap-4">
          <app-skeleton size="lg" class="!h-12 !w-12 !rounded-full" />
          <div class="flex flex-1 flex-col gap-2">
            <app-skeleton size="sm" class="!h-4 !w-20" />
            <app-skeleton size="md" class="!h-6 !w-28" />
          </div>
        </div>
      </app-card>
      }
    </div>
    <div class="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div>
        <app-card>
          <app-skeleton size="xl" class="!h-64 !w-full" />
        </app-card>
      </div>
      <div class="lg:col-span-3">
        <app-card>
          <div class="space-y-3">
            @for (_ of [1, 2, 3, 4, 5]; track $index) {
            <div class="flex items-center gap-3">
              <app-skeleton size="md" class="!h-8 !w-8 !rounded-full" />
              <div class="flex flex-1 flex-col gap-1">
                <app-skeleton size="sm" class="!h-4 !w-40" />
                <app-skeleton size="xs" class="!h-3 !w-24" />
              </div>
              <app-skeleton size="sm" class="!h-5 !w-16" />
            </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class DashboardSkeletonComponent {}
