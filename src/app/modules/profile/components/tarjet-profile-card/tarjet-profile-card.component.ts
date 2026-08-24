import { Component, Input, input, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent, CardComponent, SlotDirective, DividerComponent } from 'src/ui';
import { GetProfileDto } from '../../data-access';

@Component({
  selector: 'app-tarjet-profile-card',
  imports: [CardComponent, SlotDirective, ButtonComponent, DividerComponent],
  templateUrl: './tarjet-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tarjet-profile-card.component.css',
})
export class TarjetProfileCardComponent {
  name = input.required<GetProfileDto['name']>({ alias: 'name' });
  email = input.required<GetProfileDto['email']>({ alias: 'email' });
  role = input.required<GetProfileDto['typeUserCode']>({ alias: 'typeUserCode' });
  @Input() profilePhotoPath: string | null | undefined = null;
}
