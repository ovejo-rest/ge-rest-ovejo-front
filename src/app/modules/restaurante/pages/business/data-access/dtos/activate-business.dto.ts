export type ActivateBusinessDto = Readonly<{
  id: number;
}>;

export type ActivateBusinessResponseDto = Readonly<{
  businessId: number;
  isActive: boolean;
}>;
