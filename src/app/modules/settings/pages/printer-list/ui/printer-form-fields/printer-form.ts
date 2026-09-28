import { FormBuilder, Validators } from '@angular/forms';
import { CreatePrinterDto, PrinterDto, PrinterStatus, PrinterType, UpdatePrinterDto } from '../../data-access';

const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
// Puerto estándar de las impresoras térmicas de red (RAW / JetDirect).
export const DEFAULT_PRINTER_PORT = 9100;

export function createPrinterForm(fb: FormBuilder, printer?: PrinterDto) {
  return fb.group({
    name: [printer?.name ?? '', [Validators.required, Validators.maxLength(255)]],
    type: [(printer?.type ?? 'network') as PrinterType],
    ipAddress: [printer?.ipAddress ?? '', [Validators.pattern(IPV4)]],
    port: [printer?.port ?? (DEFAULT_PRINTER_PORT as number | null), [Validators.min(1), Validators.max(65535)]],
    locationId: [printer?.locationId ?? (null as number | null)],
    active: [printer ? printer.status === 'ACTIVE' : true],
  });
}

export type PrinterForm = ReturnType<typeof createPrinterForm>;

// La IP solo es obligatoria para impresoras de red.
export function printerFormError(form: PrinterForm): string | null {
  const { type, ipAddress } = form.getRawValue();
  if (form.controls.name.invalid) return 'Ingresa el nombre de la impresora';
  if (type === 'network' && !ipAddress?.trim()) return 'Ingresa la IP de la impresora de red';
  if (form.controls.ipAddress.invalid) return 'La IP no es válida (ejemplo: 192.168.1.50)';
  if (form.controls.port.invalid) return 'El puerto debe estar entre 1 y 65535';
  return null;
}

export function toCreatePrinterDto(form: PrinterForm): CreatePrinterDto {
  const value = form.getRawValue();
  const isNetwork = value.type === 'network';
  return {
    name: value.name!.trim(),
    type: value.type!,
    ipAddress: isNetwork ? value.ipAddress!.trim() : undefined,
    port: isNetwork ? (value.port ?? DEFAULT_PRINTER_PORT) : undefined,
    locationId: value.locationId ?? undefined,
  };
}

export function toUpdatePrinterDto(form: PrinterForm, original: PrinterDto): UpdatePrinterDto {
  const { name, type, ipAddress, port, locationId } = toCreatePrinterDto(form);
  const status: PrinterStatus = form.getRawValue().active ? 'ACTIVE' : 'INACTIVE';
  return {
    id: original.id,
    name,
    type,
    ipAddress,
    port,
    locationId,
    ...(status !== original.status && { status }),
  };
}
