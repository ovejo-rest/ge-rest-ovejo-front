import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { SkeletonSize, SkeletonSizeClass } from './enums';

@Component({
  selector: 'app-skeleton',
  imports: [],
  template: `<div [class]="'skeleton rounded ' + $sizeClass()"></div> `,
  styles: `
  :host{
    width: 100%;
    display: block ;
  }
  
  .skeleton{
    animation: skeleton-loading 1s linear infinite alternate;
  }
  
  @keyframes skeleton-loading{
    0% {
      background-color: hsla(180, 2%, 92%,1);
    }
    100% {
      background-color: hsla(240, 20%, 99%,1);
    }
  }

  .dark .skeleton {
    animation: skeleton-loading-dark 1s linear infinite alternate;
  }

  @keyframes skeleton-loading-dark {
    0% {
      background-color: hsla(240, 10%, 20%, 1);
    }
    100% {
      background-color: hsla(240, 10%, 30%, 1);
    }
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkeletonComponent {
  readonly $size = input<SkeletonSize>(SkeletonSize.XS, {
    alias: 'size',
  });

  protected readonly $sizeClass = computed<SkeletonSizeClass>(() => SkeletonSizeClass[this.$size()]);
}
