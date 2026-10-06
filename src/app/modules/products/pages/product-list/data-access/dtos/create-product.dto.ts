export type CreateProductVariationDto = Readonly<{
  name: string;
  sellPriceIncTax: number;
  isActive?: boolean;
}>;

export type CreateProductDto = Readonly<{
  name: string;
  sku: string;
  categoryId?: number;
  subCategoryId?: number;
  taxType?: 'inclusive' | 'exclusive';
  imageFileId?: string;
  productDescription?: string;
  isInactive?: boolean;
  preparationTimeInMinutes?: number;
  variations?: CreateProductVariationDto[];
}>;
