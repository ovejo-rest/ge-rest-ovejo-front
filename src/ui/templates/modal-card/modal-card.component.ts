import { NgTemplateOutlet } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import {
  booleanAttribute,
  Component,
  contentChildren,
  input,
} from '@angular/core';
import { DividerComponent } from 'src/ui/atoms';
import { SLOT, SlotAsRecordPipe } from 'src/ui/utils';

@Component({
  selector: 'app-modal-card',
  imports: [SlotAsRecordPipe, NgTemplateOutlet, DividerComponent],
  templateUrl: './modal-card.component.html',
  styleUrl: './modal-card.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ModalCardComponent {
  protected readonly $slots = contentChildren(SLOT);

  readonly $addBottomLine = input(false, {
    alias: 'addBottomLine',
    transform: booleanAttribute,
  });
}
