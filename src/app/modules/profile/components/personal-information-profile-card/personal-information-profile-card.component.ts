import { Component, effect, inject, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CardComponent, SlotDirective } from 'src/ui';
import { GetProfileDto } from '../../data-access';

@Component({
  selector: 'app-personal-information-profile-card',
  imports: [CardComponent, SlotDirective, ButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './personal-information-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './personal-information-profile-card.component.css',
})
export class PersonalInformationProfileCardComponent implements OnInit {
  private fb = inject(FormBuilder);

  profile = input.required<GetProfileDto>({ alias: 'profile' });

  constructor() {
    effect(() => {
      const p = this.profile();
      if (p) this.form.patchValue(p);
    });
  }

  form = this.fb.group({
    name: [''],
    fatherLastName: [''],
    motherLastName: [''],
    rut: [''],
    email: [''],
    phone: [''],
    cellphone: [''],
    address: [''],
    city: [''],
    communeName: [''],
  });

  ngOnInit() {
    if (this.profile) {
      this.form.patchValue(this.profile());
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    console.log(this.form.get('motherLastName')!.value!);
    // emitir evento o llamar servicio de update
  }
}
