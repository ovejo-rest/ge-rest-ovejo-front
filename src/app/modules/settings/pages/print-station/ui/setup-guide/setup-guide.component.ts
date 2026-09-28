import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from 'src/ui';

@Component({
  selector: 'app-print-setup-guide',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <details class="glass rounded-[1rem] p-4">
      <summary class="text-foreground flex cursor-pointer items-center gap-2 font-semibold">
        <app-icon class="text-primary h-5 w-5">help_outline</app-icon>¿Cómo dejar este equipo imprimiendo?
      </summary>
      <ol class="text-foreground mt-3 list-decimal space-y-2 pl-5 text-sm">
        <li>
          Conecta la impresora a este equipo (USB) o a la misma red, e <b>instálala en el sistema</b> con el driver del
          fabricante. Déjala como <b>impresora predeterminada</b> y configura el papel en 80 mm (o 58 mm).
        </li>
        <li>
          Para que imprima sin mostrar el diálogo, abre Chrome con la opción de impresión silenciosa. En Windows, crea un
          acceso directo con:
          <code class="glass-row mt-1 block overflow-x-auto rounded px-2 py-1 font-mono text-xs">"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --kiosk-printing https://tu-backoffice/settings/print-station</code>
        </li>
        <li>Elige abajo qué impresora de REDOM atiende este equipo y presiona <b>Iniciar</b>.</li>
        <li>Deja esta pestaña abierta (puede quedar en segundo plano) y el equipo sin suspender.</li>
      </ol>
      <p class="mt-3 rounded-md bg-amber-500/10 p-2 text-xs text-amber-700">
        Usa <b>un solo equipo por impresora</b>: si dos equipos atienden la misma impresora, las comandas saldrán
        duplicadas.
      </p>
    </details>
  `,
})
export class PrintSetupGuideComponent {}
