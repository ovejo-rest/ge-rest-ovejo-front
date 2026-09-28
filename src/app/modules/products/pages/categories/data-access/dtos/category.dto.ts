export type CategoryDto = Readonly<{
  id: number;
  name: string;
  shortCode: string | null;
  parentId: number;
  categoryType: string | null;
  description: string | null;
  slug: string | null;
  subcategories?: CategoryDto[];
}>;

export type CreateCategoryDto = Readonly<{
  name: string;
  shortCode?: string;
  parentId?: number;
  description?: string;
}>;

export type UpdateCategoryDto = Readonly<{
  id: number;
  name?: string;
  shortCode?: string;
  description?: string;
}>;
