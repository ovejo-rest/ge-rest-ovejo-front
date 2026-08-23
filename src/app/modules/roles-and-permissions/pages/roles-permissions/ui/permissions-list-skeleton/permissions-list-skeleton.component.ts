import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-permissions-list-skeleton',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div class="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
    @for (skeleton of [1, 2, 3, 4]; track skeleton) {
    <div class="glass-card w-full animate-pulse rounded-lg p-4">
      <div class="bg-muted/30 mb-4 h-5 w-1/3 rounded"></div>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="bg-muted/20 h-4 w-3/5 rounded"></div>
          <div class="bg-muted/20 h-6 w-11 rounded-full"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="bg-muted/20 h-4 w-2/5 rounded"></div>
          <div class="bg-muted/20 h-6 w-11 rounded-full"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="bg-muted/20 h-4 w-1/2 rounded"></div>
          <div class="bg-muted/20 h-6 w-11 rounded-full"></div>
        </div>
      </div>
    </div>
    }
  </div>`,
})
export class PermissionsListSkeletonComponent {}
