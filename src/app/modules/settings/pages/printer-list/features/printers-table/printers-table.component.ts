import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent, SkeletonComponent } from 'src/ui';
import { PrinterDto } from '../../data-access';

@Component({
  selector: 'app-printers-table',
  standalone: true,
  imports: [IconComponent, SkeletonComponent],
  templateUrl: './printers-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintersTableComponent {
  readonly printers = input.required<PrinterDto[]>();
  readonly loading = input(false);
  readonly locationNames = input<Record<number, string>>({});

  readonly edit = output<PrinterDto>();
  readonly delete = output<PrinterDto>();

  readonly skeletonRows = [1, 2, 3];

  connection(printer: PrinterDto): string {
    return printer.type === 'usb' ? 'USB' : `${printer.ipAddress ?? '—'}:${printer.port ?? 9100}`;
  }
}
