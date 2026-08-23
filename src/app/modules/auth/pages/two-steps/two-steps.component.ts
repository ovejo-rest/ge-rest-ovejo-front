import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from 'src/ui';

@Component({
  selector: 'app-two-steps',
  templateUrl: './two-steps.component.html',
  styleUrls: ['./two-steps.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, RouterLink, ButtonComponent],
})
export class TwoStepsComponent {
  constructor() {}
  public inputs = Array(6);
}
