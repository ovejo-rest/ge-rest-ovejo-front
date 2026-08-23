import { Component, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconComponent, ModalCardComponent, ProgressBarComponent, SlotDirective, ToastService } from 'src/ui';
import {
  CompleteBusinessSetupStepService,
  FindBusinessSetupStepsService,
  FindMyBusinessesService,
} from '../../data-access';
import { Step1BasicInfoFormComponent } from './step1-basic-info-form';
import { Step2TaxFormComponent } from './step2-tax-form';
import { Step3AccountingFormComponent } from './step3-accounting-form';
import { Step4InventoryFormComponent } from './step4-inventory-form';
import { Step5PosFormComponent } from './step5-pos-form';

export interface SetupBusinessModalData {
  businessId: number;
  businessName: string;
}

@Component({
  selector: 'app-setup-business-modal',
  imports: [
    ModalCardComponent,
    SlotDirective,
    IconComponent,
    ProgressBarComponent,
    Step1BasicInfoFormComponent,
    Step2TaxFormComponent,
    Step3AccountingFormComponent,
    Step4InventoryFormComponent,
    Step5PosFormComponent,
  ],
  templateUrl: './setup-business-modal.component.html',
})
export class SetupBusinessModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<SetupBusinessModalComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as SetupBusinessModalData;

  protected readonly $findBusinessSetupStepsService = inject(FindBusinessSetupStepsService);
  protected readonly $completeBusinessSetupStepService = inject(CompleteBusinessSetupStepService);
  protected readonly $findMyBusinessesService = inject(FindMyBusinessesService);
  private readonly $toast = inject(ToastService);

  protected readonly $steps = this.$findBusinessSetupStepsService.$steps;
  protected readonly $isLoading = this.$findBusinessSetupStepsService.$isLoading;

  protected readonly currentStep = signal(1);
  private readonly initialized = signal(false);

  constructor() {
    this.$findBusinessSetupStepsService.load(this.data.businessId);

    effect(() => {
      const current = this.$steps()?.currentStep;
      if (current !== undefined && !this.initialized()) {
        this.initialized.set(true);
        this.currentStep.set(current);
      }
    });
  }

  isCompleted(stepNumber: number): boolean {
    return this.$steps()?.steps.find((s) => s.stepNumber === stepNumber)?.completed ?? false;
  }

  circleClasses(stepNumber: number): string {
    if (this.isCompleted(stepNumber)) {
      return 'bg-green-500 text-white';
    }
    if (stepNumber === this.currentStep()) {
      return 'bg-primary text-primary-foreground ring-2 ring-primary/30';
    }
    return 'bg-muted text-muted-foreground';
  }

  connectorClasses(stepNumber: number): string {
    return this.isCompleted(stepNumber) ? 'bg-green-500' : 'bg-muted';
  }

  labelClasses(stepNumber: number): string {
    if (this.isCompleted(stepNumber)) {
      return 'text-green-600';
    }
    if (stepNumber === this.currentStep()) {
      return 'text-primary font-medium';
    }
    return 'text-muted-foreground';
  }

  onStepCompleted(stepNumber: number) {
    this.$completeBusinessSetupStepService.reset();

    const next = this.$steps()?.steps.find((s) => !s.completed && s.stepNumber > stepNumber);

    if (next) {
      this.currentStep.set(next.stepNumber);
      this.$findBusinessSetupStepsService.retry();
      return;
    }

    this.$toast.show('Configuración del negocio completada', 'success');
    this.$findMyBusinessesService.retry();
    this.dialogRef.close();
  }
}
