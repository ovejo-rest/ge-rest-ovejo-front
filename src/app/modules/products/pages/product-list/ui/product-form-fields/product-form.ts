import { FormBuilder, Validators } from '@angular/forms';
import { CreateProductDto, ProductDto, UpdateProductDto } from '../../data-access';

// Variación única para productos sin variaciones reales (convención del backend).
const DEFAULT_VARIATION_NAME = 'DUMMY';

export function createProductForm(fb: FormBuilder, product?: ProductDto) {
  const variation = product?.variations[0];
  return fb.group({
    name: [product?.name ?? '', [Validators.required, Validators.minLength(2)]],
    sku: [product?.sku ?? '', [Validators.required, Validators.maxLength(30)]],
    categoryId: [product?.categoryId ?? (null as number | null)],
    subCategoryId: [product?.subCategoryId ?? (null as number | null)],
    price: [variation?.sellPriceIncTax ?? (null as number | null), [Validators.required, Validators.min(0)]],
    productDescription: [product?.productDescription ?? ''],
    preparationTimeInMinutes: [
      product?.preparationTimeInMinutes ?? (null as number | null),
      [Validators.min(0), Validators.max(600)],
    ],
    available: [product ? !product.isInactive : true],
  });
}

export type ProductForm = ReturnType<typeof createProductForm>;

export function suggestSku(name: string): string {
  const words = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word.slice(0, 4));
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return [...(words.length ? words : ['PROD']), suffix].join('-');
}

function toBasePayload(form: ProductForm) {
  const value = form.getRawValue();
  return {
    name: value.name!.trim(),
    sku: value.sku!.trim().toUpperCase(),
    categoryId: value.categoryId ?? undefined,
    subCategoryId: value.subCategoryId ?? undefined,
    taxType: 'inclusive' as const,
    productDescription: value.productDescription?.trim() || undefined,
    isInactive: !value.available,
    preparationTimeInMinutes: value.preparationTimeInMinutes ?? undefined,
    price: value.price ?? 0,
  };
}

export function toCreateProductDto(form: ProductForm): CreateProductDto {
  const { price, ...product } = toBasePayload(form);
  return { ...product, variations: [{ name: DEFAULT_VARIATION_NAME, sellPriceIncTax: price }] };
}

export function toUpdateProductDto(form: ProductForm, original: ProductDto): UpdateProductDto {
  const { price, ...product } = toBasePayload(form);
  const variation = original.variations[0];
  return {
    id: original.id,
    ...product,
    variations: [
      variation
        ? { id: variation.id, sellPriceIncTax: price }
        : { name: DEFAULT_VARIATION_NAME, sellPriceIncTax: price },
    ],
  };
}
