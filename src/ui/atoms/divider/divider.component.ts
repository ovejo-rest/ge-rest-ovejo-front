import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-divider',
  imports: [MatDividerModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './divider.component.html',
})
export class DividerComponent {}
