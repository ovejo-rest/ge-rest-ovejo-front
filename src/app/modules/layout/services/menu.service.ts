import { computed, inject, Injectable, OnDestroy, signal, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/constants/menu';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _showMobileSidebar = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();
  private _whoamiService = inject(WhoamiService);

  #filteredPagesMenu: Signal<MenuItem[]> = computed(() => {
    const permissions = this._whoamiService.$permissionsSet();
    const menus = this._pagesMenu();

    return menus
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!item.permission) return true;

          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              if (!child.permission) return true;
              return permissions.has(child.permission);
            });
            return filteredChildren.length > 0;
          }

          return permissions.has(item.permission);
        }),
      }))
      .filter((group) => group.items.length > 0);
  });

  constructor(private router: Router) {
    /** Set dynamic menu */
    this._pagesMenu.set(Menu.pages);

    let sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        /** Expand menu base on active route */
        this._pagesMenu().forEach((menu) => {
          let activeGroup = false;
          menu.items.forEach((subMenu) => {
            const active = this.isActive(subMenu.route);
            subMenu.expanded = active;
            subMenu.active = active;
            if (active) activeGroup = true;
            if (subMenu.children) {
              this.expand(subMenu.children);
            }
          });
          menu.active = activeGroup;
        });
      }
    });
    this._subscription.add(sub);
  }

  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu(): MenuItem[] {
    return this.#filteredPagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  get showMobileSidebar() {
    return this._showMobileSidebar();
  }

  set showMobileSidebar(value: boolean) {
    this._showMobileSidebar.set(value);
  }

  public toggleMobileSidebar() {
    this._showMobileSidebar.set(!this._showMobileSidebar());
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  public isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
