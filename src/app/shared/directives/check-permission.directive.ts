import { DestroyRef, Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/pages/data-access';

@Directive({
  selector: '[appCheckPermission]',
})
export class CheckPermissionDirective implements OnInit {
  readonly #templateRef = inject(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);

  @Input({ alias: 'appCheckPermission' }) permission: string | string[] | undefined;

  ngOnInit(): void {
    if (!this.permission || (Array.isArray(this.permission) && this.permission.length === 0)) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
      return;
    }

    const permissions = Array.isArray(this.permission) ? this.permission : [this.permission];

    this.#authService
      .hasPermission(permissions)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap(() => this.#viewContainer.clear()),
        filter((hasAccess) => hasAccess),
        tap(() => this.#viewContainer.createEmbeddedView(this.#templateRef)),
      )
      .subscribe();
  }
}
