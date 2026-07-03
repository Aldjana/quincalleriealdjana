import { type Product } from '../config/api';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1581093616143-1b29f99148d6?auto=format&fit=crop&w=1200&q=85';

export function getProductImages(product: Product): string[] {
  if (product.images?.length) {
    return product.images.filter(Boolean);
  }
  if (product.image) {
    return [product.image];
  }
  return [DEFAULT_IMAGE];
}

export function getProductMainImage(product: Product): string {
  return getProductImages(product)[0];
}

export function parseImageUrls(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);
}
