import { StationType } from '../data-access';

export type StationTypeOption = Readonly<{ value: StationType; label: string; icon: string }>;

export const STATION_TYPES: StationTypeOption[] = [
  { value: 'kitchen', label: 'Cocina', icon: 'restaurant' },
  { value: 'bar', label: 'Bar', icon: 'local_bar' },
  { value: 'grill', label: 'Parrilla', icon: 'outdoor_grill' },
  { value: 'coffee', label: 'Cafetería', icon: 'local_cafe' },
];

export function stationTypeOption(type: StationType): StationTypeOption {
  return STATION_TYPES.find((option) => option.value === type) ?? STATION_TYPES[0];
}
