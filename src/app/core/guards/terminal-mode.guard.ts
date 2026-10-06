import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TerminalModeService } from '../services/terminal-mode';

// Con el modo terminal activo, el backoffice no es accesible desde este equipo.
export const terminalModeGuard: CanActivateFn = () => {
  const terminalMode = inject(TerminalModeService);
  return terminalMode.isEnabled() ? inject(Router).parseUrl('/terminal') : true;
};
