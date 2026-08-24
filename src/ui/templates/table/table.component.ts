import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, ChangeDetectionStrategy } from '@angular/core';
import { DividerComponent } from 'src/ui/atoms';
import { SLOT, SlotAsRecordPipe } from 'src/ui/utils';

@Component({
  selector: 'app-table',
  imports: [SlotAsRecordPipe, NgTemplateOutlet, DividerComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './table.component.html',
})
export class TableComponent {
  protected readonly $slots = contentChildren(SLOT);
}
