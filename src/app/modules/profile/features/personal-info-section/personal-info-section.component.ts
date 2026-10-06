import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';
import { ButtonComponent, IconComponent, ToastService } from 'src/ui';
import { GetProfileDto, GetProfileService, ProfileActionsService, UpdateUserNameDto } from '../../data-access';

type NameField = keyof UpdateUserNameDto;

/** Nombre y apellidos editables en línea; email y RUT solo lectura. */
@Component({
  selector: 'app-personal-info-section',
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './personal-info-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoSectionComponent {
  readonly #toast = inject(ToastService);
  readonly #actions = inject(ProfileActionsService);
  readonly #profileService = inject(GetProfileService);
  readonly #whoami = inject(WhoamiService);

  readonly profile = input.required<GetProfileDto>();
  readonly userCode = input.required<string>();

  protected readonly $editing = signal(false);
  protected readonly $saving = signal(false);
  // 403/409: el usuario aún no tiene negocio y no puede editarse; queda en solo lectura.
  protected readonly $canEdit = signal(true);
  protected submitted = false;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    fatherLastName: ['', [Validators.required, Validators.maxLength(60)]],
    motherLastName: ['', [Validators.maxLength(60)]],
  });

  protected startEdit() {
    const p = this.profile();
    this.form.reset({ name: p.name ?? '', fatherLastName: p.fatherLastName ?? '', motherLastName: p.motherLastName ?? '' });
    this.submitted = false;
    this.$editing.set(true);
  }

  protected cancel() {
    this.$editing.set(false);
  }

  protected save() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.#toast.show('Revisa los campos marcados', 'warning');
      return;
    }

    // Solo los campos que cambiaron.
    const value = this.form.getRawValue();
    const p = this.profile();
    const changes: Partial<Record<NameField, string>> = {};
    (['name', 'fatherLastName', 'motherLastName'] as NameField[]).forEach((field) => {
      const next = value[field].trim();
      if (next !== (p[field] ?? '')) changes[field] = next;
    });
    if (!Object.keys(changes).length) return this.$editing.set(false);

    this.$saving.set(true);
    this.#actions.updateName(this.userCode(), changes).subscribe({
      next: () => {
        this.#profileService.patch(changes);
        this.#whoami.patchUser(changes);
        this.$saving.set(false);
        this.$editing.set(false);
        this.#toast.show('Datos actualizados', 'success');
      },
      error: (error: HttpErrorResponse) => {
        this.$saving.set(false);
        if (error.status === HttpStatusCode.Forbidden || error.status === HttpStatusCode.Conflict) {
          this.$canEdit.set(false);
          this.$editing.set(false);
          this.#toast.show('Podrás editar tus datos cuando tengas un negocio.', 'warning');
          return;
        }
        this.#toast.show(error.status === 0 ? 'Sin conexión con el servidor.' : 'No se pudieron guardar los cambios.', 'error');
      },
    });
  }

  protected invalid(field: NameField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted);
  }
}
