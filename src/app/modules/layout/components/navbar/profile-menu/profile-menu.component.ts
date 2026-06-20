import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { finalize, Observable } from 'rxjs';
import { ThemeService } from '../../../../../core/services/theme.service';
import { IconComponent } from 'src/ui';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import { LoginOutputDto } from 'src/app/modules/auth/pages/dtos';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css'],
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgClass, RouterLink, AngularSvgIconModule, IconComponent],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.2s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  userLoginOn: boolean = false;
  userData: LoginOutputDto['userData'] | null = null;
  public isOpen = false;
  protected positions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ];
  public profileMenu = [
    {
      title: 'Your Profile',
      icon: 'account_circle',
      link: '/profile',
    },
    {
      title: 'Settings',
      icon: 'settings',
      link: '/settings',
    },
    // {
    //   title: 'Log out',
    //   icon: 'logout',
    //   link: '/auth',
    // },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#ea580c',
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];
  public themeDirection = ['ltr', 'rtl'];

  constructor(public themeService: ThemeService, private $authService: AuthService, private readonly _router: Router) {}

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }

  setDirection(value: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, direction: value };
    });
  }

  public logout() {
    (this.$authService.logout() as Observable<void>)
      .pipe(finalize(() => this._router.navigateByUrl('/auth/sign-in')))
      .subscribe();
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        this.userData = JSON.parse(storedUser);
        this.userLoginOn = true;
      } catch (error) {
        console.error('Error al parsear userData desde localStorage:', error);
        this.userData = null;
      }
    }
  }
}
