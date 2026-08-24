import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { BadgeType } from './enums';

@Component({
  selector: 'app-badge',
  imports: [NgClass],
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  readonly $text = input<string | null>(null, { alias: 'text' });
  readonly $type = input<BadgeType>(BadgeType.INFO, { alias: 'type' });
  readonly $glass = input(false, { alias: 'glass' });
  readonly $rounded = input<'full' | 'md'>('full', { alias: 'rounded' });
}
