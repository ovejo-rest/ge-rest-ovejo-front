import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-users-list-skeleton',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tr>
      @for (row of [1,2,3,4,5]; track row) {
      <td colspan="4" class="px-2 py-1">
        <div class="bg-muted/20 h-4 w-full animate-pulse rounded"></div>
      </td>
      }
    </tr>
  `,
})
export class UsersListSkeletonComponent {}
