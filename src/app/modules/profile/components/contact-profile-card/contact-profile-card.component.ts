import { Component, effect, inject, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GetProfileDto } from '../../data-access';
import { CardComponent, SlotDirective, ButtonComponent } from 'src/ui';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateContactModalComponent } from '../../features';

@Component({
  selector: 'app-contact-profile-card',
  imports: [CardComponent, SlotDirective, ButtonComponent, ButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-profile-card.component.css',
})
export class ContactProfileCardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  profile = input.required<GetProfileDto>({ alias: 'profile' });

  constructor() {
    effect(() => {
      const p = this.profile();
      if (p) this.form.patchValue(p);
      this.form.disable();
    });
  }

  form = this.fb.group({
    regionName: [''],
    provinceName: [''],
    communeName: [''],
    city: [''],
    address: [''],
    phone: [''],
    cellphone: [''],
  });

  ngOnInit() {
    if (this.profile) {
      this.form.patchValue(this.profile());
    }
  }

  updateContact() {
    this.dialog.open(UpdateContactModalComponent, {
      width: '90%',
      data: this.profile(),
    });
  }
}
