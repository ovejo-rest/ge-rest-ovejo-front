import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { DividerComponent, IconComponent } from 'src/ui/atoms';
import { SLOT, SlotAsRecordPipe } from 'src/ui/utils';

@Component({
  selector: 'app-modal',
  imports: [SlotAsRecordPipe, NgTemplateOutlet, DividerComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly $slots = contentChildren(SLOT);
  @Output() close = new EventEmitter<void>();

  emitClose() {
    this.close.emit();
  }
}
