import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { finalize, Observable } from 'rxjs';
import { ThemeService } from '../../../../../core/services/theme.service';
import { IconComponent, ImageThumbComponent } from 'src/ui';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css'],
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgClass, RouterLink, AngularSvgIconModule, IconComponent, ImageThumbComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.2s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))]),
    ]),
  ],
})
export class ProfileMenuComponent {
  readonly #whoami = inject(WhoamiService);

  // Whoami (o el login) en memoria: refleja al instante cambios de foto y nombre.
  protected readonly $user = computed(() => {
    const user = this.#whoami.$currentUser() ?? this.#storedUser();
    if (!user) return null;
    const fullName = [user.name, user.fatherLastName, user.motherLastName].filter(Boolean).join(' ');
    return { ...user, fullName, shortName: [user.name, user.fatherLastName].filter(Boolean).join(' ') };
  });
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
      title: 'Mi perfil',
      icon: 'account_circle',
      link: '/profile',
    },
    {
      title: 'Configuración',
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

  constructor(
    public themeService: ThemeService,
    private $authService: AuthService,
    private readonly _router: Router,
  ) {}

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

  // La URL firmada venció (1 hora): se vuelve a pedir whoami.
  // Máximo una vez por minuto, por si la imagen falla por otro motivo.
  #lastPhotoRefresh = 0;
  protected refreshPhoto() {
    if (Date.now() - this.#lastPhotoRefresh < 60_000) return;
    this.#lastPhotoRefresh = Date.now();
    this.#whoami.refetch();
  }

  #storedUser(): { code: string; name: string; fatherLastName: string; motherLastName: string | null; email: string; profileImageUrl?: string | null } | null {
    try {
      return JSON.parse(localStorage.getItem('userData') ?? 'null');
    } catch {
      return null;
    }
  }
}
