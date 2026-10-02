export type ProductVariationDto = Readonly<{
  id: number;
  name: string;
  productId: number;
  subSku: string | null;
  productVariationId: number;
  defaultPurchasePrice: number | null;
  dppIncTax: number;
  profitPercent: number;
  defaultSellPrice: number | null;
  sellPriceIncTax: number | null;
  isActive: boolean;
}>;

export type ProductDto = Readonly<{
  id: number;
  name: string;
  businessId: number;
  type: string | null;
  unitId: number | null;
  brandId: number | null;
  categoryId: number | null;
  subCategoryId: number | null;
  tax: number | null;
  taxType: string;
  sku: string;
  image: string | null;
  imageFileId?: string | null;
  // URL firmada (vence en 1 hora).
  imageUrl?: string | null;
  productDescription: string | null;
  isInactive: boolean;
  notForSelling: boolean;
  preparationTimeInMinutes: number | null;
  variations: ProductVariationDto[];
}>;

export type ProductFiltersDto = Readonly<{
  page: number;
  perPage: number;
  name?: string;
  categoryId?: number;
}>;
