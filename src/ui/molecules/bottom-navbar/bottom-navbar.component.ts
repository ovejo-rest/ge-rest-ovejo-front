import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BottomNavbarEnum } from './enums';
import { IconComponent } from 'src/ui/atoms';

@Component({
  selector: 'app-bottom-navbar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './bottom-navbar.component.html',
})
export class BottomNavbarComponent {
  public buttonNavbar: BottomNavbarEnum[] = [];

  constructor() {
    this.buttonNavbar = [
      {
        icon: 'home',
        title: 'Home',
        action: 'holas',
      },
      {
        icon: 'person',
        title: 'Perfil',
        action: 'holitas',
      },
    ];
  }

  action(action: string) {
    console.log(`Hola ${action}`);
  }
}
