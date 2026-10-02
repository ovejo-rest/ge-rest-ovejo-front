export type UpdateProductVariationDto = Readonly<{
  // Sin id, el backend crea la variación; con id, la actualiza.
  id?: number;
  name?: string;
  sellPriceIncTax?: number;
  isActive?: boolean;
}>;

export type UpdateProductDto = Readonly<{
  id: number;
  name?: string;
  sku?: string;
  categoryId?: number;
  subCategoryId?: number;
  taxType?: 'inclusive' | 'exclusive';
  // undefined = no tocar, null = quitar.
  imageFileId?: string | null;
  productDescription?: string;
  isInactive?: boolean;
  preparationTimeInMinutes?: number;
  variations?: UpdateProductVariationDto[];
}>;
