export type UpdateContactProfileDto = Readonly<{
  phone: string | null;
  cellphone: string;
  address: string;
  city: string;
  email: string | null;
  communeId: number;
}>;
