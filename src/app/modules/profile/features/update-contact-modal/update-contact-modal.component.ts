import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ButtonComponent,
  ConfirmModalComponent,
  ConfirmModalData,
  IconComponent,
  ModalCardComponent,
  SlotDirective,
  ToastService,
} from 'src/ui';
import { GetProfileDto, UpdateContactProfileService } from '../../data-access';
import { GetRegionsService } from 'src/app/core/services/address/get-regions.service';
import { GetProvincesByRegionIdService } from 'src/app/core/services/address/get-provinces-by-region-id.service';
import { GetCommunesByProvincesIdService } from 'src/app/core/services/address/get-communes-by-provinces-id.service';

@Component({
  selector: 'app-update-contact-modal',
  imports: [ModalCardComponent, FormsModule, ReactiveFormsModule, ButtonComponent, SlotDirective, IconComponent],
  templateUrl: './update-contact-modal.component.html',
  styleUrl: './update-contact-modal.component.css',
})
export class UpdateContactModalComponent implements OnInit {
  protected readonly $getRegionsService = inject(GetRegionsService);
  protected readonly $getProvincesByRegionIdService = inject(GetProvincesByRegionIdService);
  protected readonly $getCommunesByProvincesIdService = inject(GetCommunesByProvincesIdService);

  private fb = inject(FormBuilder);
  protected readonly data = inject(MAT_DIALOG_DATA) as GetProfileDto;
  protected readonly dialogRef = inject(MatDialogRef<UpdateContactModalComponent>);
  protected readonly dialog = inject(MatDialog);
  private readonly $updateContact = inject(UpdateContactProfileService);
  private readonly $toast = inject(ToastService);

  form = this.fb.group({
    regionName: ['', Validators.required],
    provinceName: [''],
    communeName: [''],
    city: [''],
    address: ['', Validators.required],
    phone: [''],
    cellphone: [''],
  });

  #initState = { regions: false, provinces: false };

  constructor() {
    this.$updateContact.reset();

    effect(() => {
      const regions = this.$getRegionsService.$regions();
      if (regions && this.data && !this.#initState.regions) {
        this.#initState.regions = true;
        const region = regions.find((r) => r.name === this.data.regionName);
        if (region) {
          this.$getProvincesByRegionIdService.loadProvinces(region.id);
        }
      }
    });

    effect(() => {
      const provinces = this.$getProvincesByRegionIdService.$provincesById();
      if (provinces && this.data && this.#initState.regions && !this.#initState.provinces) {
        this.#initState.provinces = true;
        const province = provinces.find((p) => p.name === this.data.provinceName);
        if (province) {
          this.$getCommunesByProvincesIdService.loadCommunes(province.id);
        }
      }
    });

    effect(() => {
      const communes = this.$getCommunesByProvincesIdService.$communesById();
      if (communes && this.data && this.#initState.regions && !this.#initState.provinces) {
        this.#initState.provinces = true;
        const province = communes.find((p) => p.name === this.data.communeName);
        if (province) {
          this.$getCommunesByProvincesIdService.loadCommunes(province.id);
        }
      }
    });

    this.form.get('regionName')!.valueChanges.subscribe((name) => {
      const region = this.$getRegionsService.$regions()?.find((r) => r.name === name);
      if (region) {
        this.$getProvincesByRegionIdService.loadProvinces(region.id);
        this.form.patchValue({ provinceName: '', communeName: '' });
      }
    });

    this.form.get('provinceName')!.valueChanges.subscribe((name) => {
      const province = this.$getProvincesByRegionIdService.$provincesById()?.find((p) => p.name === name);
      if (province) {
        this.$getCommunesByProvincesIdService.loadCommunes(province.id);
        this.form.patchValue({ communeName: '' });
      }
    });

    effect(() => {
      if (this.$updateContact.$isLoading()) {
        this.$toast.show(`Modificando contacto`, 'warning');
      }
      if (this.$updateContact.$success()) {
        this.$toast.show(`Contacto modificado con éxito`, 'success');
        this.dialogRef.close();
      }
      if (this.$updateContact.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data, { emitEvent: false });
    }
  }

  updateContact() {
    const commune = this.$getCommunesByProvincesIdService
      .$communesById()
      ?.find((c) => c.name === this.form.value.communeName);

    this.dialog
      .open(ConfirmModalComponent, {
        data: {
          title: 'Modificar contacto',
          message: '¿Está seguro que desea modificar contacto?',
          confirmText: 'Modificar',
          cancelText: 'Cancelar',
          tone: 'primary',
        } satisfies ConfirmModalData,
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;

        const { phone, cellphone, address, city } = this.form.value;
        this.$updateContact.update(1, {
          phone: phone!,
          cellphone: cellphone!,
          address: address!,
          city: city!,
          email: '',
          communeId: commune?.id!,
        });
      });
  }
}
