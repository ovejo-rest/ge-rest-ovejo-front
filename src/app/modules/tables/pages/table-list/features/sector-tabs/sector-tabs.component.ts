import { Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { SectorDto } from 'src/app/modules/sectors/pages/sector-list/data-access';

@Component({
  selector: 'app-sector-tabs',
  imports: [NgClass],
  templateUrl: './sector-tabs.component.html',
})
export class SectorTabsComponent {
  readonly $sectors = input<SectorDto[]>([], { alias: 'sectors' });
  readonly selectedSectorId = output<number | null>();

  protected readonly $activeTab = signal<number | null>(null);

  selectTab(sectorId: number | null) {
    this.$activeTab.set(sectorId);
    this.selectedSectorId.emit(sectorId);
  }
}
