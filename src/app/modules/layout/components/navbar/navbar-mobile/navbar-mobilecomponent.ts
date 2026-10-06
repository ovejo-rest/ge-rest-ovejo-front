import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu/navbar-mobile-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass } from '@angular/common';
import { IconComponent, RedomLogoComponent } from 'src/ui';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RedomLogoComponent, NgClass, AngularSvgIconModule, NavbarMobileMenuComponent, IconComponent],
})
export class NavbarMobileComponent {
  constructor(public menuService: MenuService) {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}
