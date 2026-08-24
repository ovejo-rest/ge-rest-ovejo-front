import { Component } from '@angular/core';
import { CardComponent, SkeletonComponent, SkeletonSize, SlotDirective } from 'src/ui';

@Component({
  selector: 'app-business-detail-skeleton',
  imports: [CardComponent, SlotDirective, SkeletonComponent],
  templateUrl: './business-detail-skeleton.component.html',
})
export class BusinessDetailSkeletonComponent {
  protected readonly SkeletonSize = SkeletonSize;
}
