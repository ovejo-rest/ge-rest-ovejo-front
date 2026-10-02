import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonComponent, IconComponent } from 'src/ui';
import { GetProfileDto } from '../../data-access';

/** Datos de contacto en lectura; las filas vacías no se muestran. */
@Component({
  selector: 'app-contact-section',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './contact-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  readonly profile = input.required<GetProfileDto>();
  readonly edit = output<void>();

  protected readonly $rows = computed(() => {
    const p = this.profile();
    return [
      { icon: 'call', label: 'Teléfono', value: p.phone },
      { icon: 'smartphone', label: 'Celular', value: p.cellphone },
      { icon: 'home', label: 'Dirección', value: p.address },
      { icon: 'location_city', label: 'Ciudad', value: p.city },
      { icon: 'map', label: 'Comuna', value: p.communeName },
      { icon: 'map', label: 'Provincia', value: p.provinceName },
      { icon: 'public', label: 'Región', value: p.regionName },
    ].filter((row) => !!row.value?.toString().trim());
  });
}
