import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom, interval } from 'rxjs';
import { ButtonComponent, HeaderDashboardComponent, ToastService } from 'src/ui';
import { kitchenTicketHtml, PaperWidth, printHtml, testTicketHtml } from 'src/app/shared/utils/printing';
import { GetAllPrintersService } from '../printer-list/data-access';
import { PendingPrintJobDto, PrintJobsService, PrintStationConfigService } from './data-access';
import { PrintLogComponent, PrintLogEntry, PrintSetupGuideComponent } from './ui';

const POLL_MS = 4000;
const MAX_LOG = 30;

// Mantiene la pantalla encendida mientras la estación está activa (si el navegador lo permite).
type WakeLockSentinelLike = { release: () => Promise<void> };

@Component({
  selector: 'app-print-station',
  standalone: true,
  imports: [HeaderDashboardComponent, ButtonComponent, PrintLogComponent, PrintSetupGuideComponent],
  templateUrl: './print-station.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintStationComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly printersService = inject(GetAllPrintersService);
  private readonly printJobs = inject(PrintJobsService);
  private readonly configService = inject(PrintStationConfigService);

  readonly $config = this.configService.$config;
  readonly $printers = computed(() => this.printersService.$printers() ?? []);
  readonly $printer = computed(() => this.$printers().find((printer) => printer.id === this.$config().printerId) ?? null);
  readonly $isRunning = computed(() => this.$config().enabled && !!this.$printer());
  readonly $isProcessing = signal(false);
  readonly $lastCheck = signal<Date | null>(null);
  readonly $connectionError = signal(false);
  readonly $log = signal<PrintLogEntry[]>([]);
  readonly $printedCount = signal(0);
  readonly $failedCount = signal(0);
  readonly paperWidths: PaperWidth[] = [80, 58];

  #wakeLock: WakeLockSentinelLike | null = null;

  constructor() {
    effect(() => {
      if (this.$isRunning()) this.requestWakeLock();
      else this.releaseWakeLock();
    });
    this.destroyRef.onDestroy(() => this.releaseWakeLock());
  }

  ngOnInit(): void {
    this.printersService.load();
    interval(POLL_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.poll());
  }

  selectPrinter(event: Event) {
    const printerId = Number((event.target as HTMLSelectElement).value) || null;
    this.configService.update({ printerId, enabled: false });
  }

  selectPaper(paperWidth: PaperWidth) {
    this.configService.update({ paperWidth });
  }

  start() {
    if (!this.$printer()) {
      this.toast.show('Elige la impresora que atiende este equipo', 'warning');
      return;
    }
    this.configService.update({ enabled: true });
    this.toast.show(`Imprimiendo comandas de ${this.$printer()!.name}`, 'success');
    this.poll();
  }

  stop() {
    this.configService.update({ enabled: false });
  }

  async printTest() {
    try {
      await printHtml(testTicketHtml(this.$printer()?.name ?? 'Predeterminada del equipo'), this.$config().paperWidth);
      this.addLog({ title: 'Prueba de impresión', detail: 'Ticket local, no pasa por el backend', result: 'test' });
    } catch {
      this.toast.show('El navegador no pudo imprimir', 'error');
    }
  }

  // Revisa la cola y procesa las comandas una por una, en orden.
  async poll() {
    const printer = this.$printer();
    if (!this.$isRunning() || !printer || this.$isProcessing()) return;
    this.$isProcessing.set(true);
    try {
      const jobs = await firstValueFrom(this.printJobs.findPending(printer.id));
      this.$connectionError.set(false);
      this.$lastCheck.set(new Date());
      for (const job of jobs) {
        if (!this.$isRunning()) break;
        await this.printJob(job);
      }
    } catch {
      this.$connectionError.set(true);
    } finally {
      this.$isProcessing.set(false);
    }
  }

  formatTime(date: Date | null): string {
    return date ? date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
  }

  private async printJob(job: PendingPrintJobDto) {
    const title = `${job.tableName ?? 'Sin mesa'} · ${job.invoiceNo ?? '#' + job.id}`;
    const detail = `${job.stationName ?? 'Comanda'} · ${job.items.length} ${job.items.length === 1 ? 'producto' : 'productos'}`;
    try {
      await printHtml(kitchenTicketHtml(job), this.$config().paperWidth);
      await firstValueFrom(this.printJobs.updateStatus({ id: job.id, status: 'printed' }));
      this.$printedCount.update((count) => count + 1);
      this.addLog({ title, detail, result: 'printed' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al imprimir';
      await firstValueFrom(this.printJobs.updateStatus({ id: job.id, status: 'failed', errorMessage: message })).catch(() => null);
      this.$failedCount.update((count) => count + 1);
      this.addLog({ title, detail: message, result: 'failed' });
    }
  }

  private addLog(entry: Omit<PrintLogEntry, 'id' | 'at'>) {
    this.$log.update((log) => [{ ...entry, id: crypto.randomUUID(), at: new Date() }, ...log].slice(0, MAX_LOG));
  }

  private async requestWakeLock() {
    try {
      const wakeLock = (navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> } }).wakeLock;
      this.#wakeLock = (await wakeLock?.request('screen')) ?? null;
    } catch {
      this.#wakeLock = null;
    }
  }

  private releaseWakeLock() {
    this.#wakeLock?.release().catch(() => null);
    this.#wakeLock = null;
  }
}
