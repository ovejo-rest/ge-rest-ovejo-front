import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent {}
