import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AlertType } from './enums/alert.enum';
import { NgClass } from '@angular/common';
import { IconComponent } from 'src/ui/atoms';
import { ButtonComponent } from '../button';

@Component({
  selector: 'app-alert',
  imports: [NgClass, IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  readonly $type = input<AlertType>(AlertType.INFO, { alias: 'type' });
  @Input() $show: boolean = true;
  @Output() showChange = new EventEmitter<void>();

  close() {
    this.$show = false;
    this.showChange.emit();
  }
}
