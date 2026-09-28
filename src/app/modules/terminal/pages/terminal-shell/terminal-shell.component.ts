import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IconComponent, ToastService } from 'src/ui';
import { TerminalModeService } from 'src/app/core/services/terminal-mode';
import { PosTerminalComponent } from 'src/app/modules/pos/pages';
import { AdminExitModalComponent } from './features';

@Component({
  selector: 'app-terminal-shell',
  standalone: true,
  imports: [RouterLink, IconComponent, PosTerminalComponent],
  templateUrl: './terminal-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalShellComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly terminalMode = inject(TerminalModeService);

  readonly $config = this.terminalMode.$config;
  readonly $isReady = computed(() => this.$config().enabled && !!this.$config().locationId);
  readonly $isFullscreen = signal(!!document.fullscreenElement);

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      this.$isFullscreen.set(!!document.fullscreenElement);
    } catch {
      this.toast.show('El navegador no permite pantalla completa', 'warning');
    }
  }

  openAdmin() {
    this.dialog
      .open<AdminExitModalComponent, void, boolean>(AdminExitModalComponent, { width: '420px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((authorized) => {
        if (!authorized) return;
        this.terminalMode.disable();
        if (document.fullscreenElement) document.exitFullscreen().catch(() => null);
        this.toast.show('Modo terminal desactivado', 'success');
        this.router.navigate(['/settings/terminal']);
      });
  }
}
