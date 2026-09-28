// Ítem común del listado: sale de GET /contacts?type=customer (sin búsqueda) o de GET /customers?q= (con búsqueda).
export type CustomerListItemDto = Readonly<{
  id: number;
  name: string;
  mobile: string;
  email: string | null;
}>;

export type CustomerFiltersDto = Readonly<{
  page: number;
  perPage: number;
  q?: string;
}>;
