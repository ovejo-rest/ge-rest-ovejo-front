export type SetupStepDto = Readonly<{
  stepNumber: number;
  name: string;
  label: string;
  previousStepId: number | null;
  nextStepId: number | null;
  completed: boolean;
  completedAt: string | null;
}>;

export type FindBusinessSetupStepsResponseDto = Readonly<{
  steps: SetupStepDto[];
  currentStep: number;
  allStepsCompleted: boolean;
}>;
