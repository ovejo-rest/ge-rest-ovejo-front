import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent, EmptyStateComponent, HeaderDashboardComponent, IconComponent, ToastService } from 'src/ui';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';
import { GetAllPrintersService, getPrinterErrorMessage, PrinterDto } from './data-access';
import {
  CreatePrinterModalComponent,
  DeletePrinterModalComponent,
  PrinterModalResult,
  PrintersTableComponent,
  UpdatePrinterModalComponent,
} from './features';

@Component({
  selector: 'app-printer-list',
  standalone: true,
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, EmptyStateComponent, PrintersTableComponent],
  templateUrl: './printer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrinterListComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly getAllService = inject(GetAllPrintersService);
  private readonly locationsService = inject(GetAllBusinessLocationsService);

  readonly $printers = computed(() => this.getAllService.$printers() ?? []);
  readonly $isLoading = computed(() => this.getAllService.$isLoading() ?? false);
  readonly $errorMessage = computed(() => {
    const status = this.getAllService.$error();
    return status ? getPrinterErrorMessage(status) : null;
  });
  readonly $isEmpty = computed(
    () => !this.$isLoading() && !this.$errorMessage() && this.getAllService.$printers() !== undefined && !this.$printers().length,
  );
  readonly $locationNames = computed(() =>
    Object.fromEntries((this.locationsService.$locations() ?? []).map((location) => [location.id, location.name])),
  );

  ngOnInit(): void {
    this.getAllService.load();
  }

  handleRetry() {
    this.getAllService.load();
  }

  handleCreate() {
    this.open(CreatePrinterModalComponent, undefined, '560px');
  }

  handleUpdate(printer: PrinterDto) {
    this.open(UpdatePrinterModalComponent, printer, '560px');
  }

  handleDelete(printer: PrinterDto) {
    this.open(DeletePrinterModalComponent, printer, '480px');
  }

  private open<T>(component: ComponentType<T>, data: PrinterDto | undefined, width: string) {
    this.dialog
      .open<T, PrinterDto | undefined, PrinterModalResult>(component, { width, maxWidth: '95vw', disableClose: true, data })
      .afterClosed()
      .subscribe((result) => {
        const messages: Partial<Record<PrinterModalResult, string>> = {
          created: 'Impresora creada',
          updated: 'Impresora actualizada',
          deleted: 'Impresora eliminada',
        };
        const message = result ? messages[result] : undefined;
        if (!message) return;
        this.toast.show(message, 'success');
        this.getAllService.load();
      });
  }
}
