import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from 'src/ui';

@Component({
  selector: 'app-inactive-table-skeleton',
  imports: [SkeletonComponent],
  template: `
    <div class="grid h-auto w-full grid-cols-5 gap-x-2">
      <div class="col-span-5 flex justify-end">
        <div class="w-1/4"><app-skeleton /></div>
      </div>
      <div class="col-span-5 mt-2.5"><app-skeleton /></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InactiveTableSkeletonComponent {}
