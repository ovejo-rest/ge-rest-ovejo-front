import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ToastTypeEnum } from './enums';
import { NgClass } from '@angular/common';
import { IconComponent } from 'src/ui/atoms';
import { ToastService } from './data-access';

@Component({
  selector: 'app-toast',
  imports: [NgClass, IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
