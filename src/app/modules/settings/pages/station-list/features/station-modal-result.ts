import { PrinterDto } from '../../printer-list/data-access';
import { StationDto } from '../data-access';

export type StationModalResult = 'created' | 'updated' | 'deleted' | 'cancelled';

// Datos de los modales de crear/editar: la estación (al editar) y las impresoras para el selector.
export type StationModalData = Readonly<{
  station?: StationDto;
  printers: PrinterDto[];
}>;
