import { FormBuilder, Validators } from '@angular/forms';
import { CreateStationDto, StationDto, StationType, UpdateStationDto } from '../../data-access';

export function createStationForm(fb: FormBuilder, station?: StationDto) {
  return fb.group({
    name: [station?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    type: [(station?.type ?? 'kitchen') as StationType, [Validators.required]],
    printerId: [station?.printerId ?? (null as number | null)],
    locationId: [station?.locationId ?? (null as number | null)],
    isActive: [station?.isActive ?? true],
  });
}

export type StationForm = ReturnType<typeof createStationForm>;

export function toCreateStationDto(form: StationForm): CreateStationDto {
  const value = form.getRawValue();
  return {
    name: value.name!.trim(),
    type: value.type!,
    printerId: value.printerId ?? undefined,
    locationId: value.locationId ?? undefined,
  };
}

export function toUpdateStationDto(form: StationForm, original: StationDto): UpdateStationDto {
  const value = form.getRawValue();
  return {
    id: original.id,
    ...toCreateStationDto(form),
    ...(value.isActive !== original.isActive && { isActive: !!value.isActive }),
  };
}
