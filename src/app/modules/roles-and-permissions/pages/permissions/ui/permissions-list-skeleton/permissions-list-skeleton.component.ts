import { Component } from '@angular/core';

@Component({
  selector: 'app-permissions-list-skeleton',
  imports: [],
  template: `<div class="space-y-4 p-2">
    @for (skeleton of [1, 2, 3]; track skeleton) {
    <div class="glass-card h-32 w-full animate-pulse rounded-lg p-4">
      <div class="bg-muted/30 mb-4 h-5 w-1/3 rounded"></div>
      <div class="space-y-3">
        <div class="bg-muted/20 h-4 w-full rounded"></div>
        <div class="bg-muted/20 h-4 w-3/4 rounded"></div>
        <div class="bg-muted/20 h-4 w-1/2 rounded"></div>
      </div>
    </div>
    }
  </div>`,
})
export class PermissionsListSkeletonComponent {}
