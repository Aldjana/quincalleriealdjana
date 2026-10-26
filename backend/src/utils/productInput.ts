export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1581093616143-1b29f99148d6?auto=format&fit=crop&w=800&q=85';

export interface ProductInput {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  rating?: number;
  image?: string;
  images?: string[];
  description?: string;
  featured?: boolean;
  active?: boolean;
}

type Result = { ok: true; data: ProductInput } | { ok: false; error: string };

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function toImageList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((url): url is string => typeof url === 'string')
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, 10);
}

/**
 * Ne garde que les champs autorisés et les valide.
 * `partial` = mise à jour : seuls les champs fournis sont contrôlés.
 */
export function parseProductInput(body: unknown, { partial }: { partial: boolean }): Result {
  const src = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const data: ProductInput = {};

  for (const key of ['name', 'category', 'description'] as const) {
    if (src[key] === undefined) continue;
    if (typeof src[key] !== 'string') return { ok: false, error: `${key} doit être un texte.` };
    data[key] = (src[key] as string).trim();
  }

  for (const key of ['price', 'stock', 'rating'] as const) {
    const n = toNumber(src[key]);
    if (n === undefined) continue;
    if (Number.isNaN(n) || n < 0) return { ok: false, error: `${key} doit être un nombre positif.` };
    if (key === 'rating' && n > 5) return { ok: false, error: 'rating doit être compris entre 0 et 5.' };
    data[key] = key === 'stock' ? Math.floor(n) : n;
  }

  if (src.featured !== undefined) data.featured = Boolean(src.featured);
  if (src.active !== undefined) data.active = Boolean(src.active);

  // Images : `images` prime sur `image`, et `image` reste toujours la première
  if (src.images !== undefined || src.image !== undefined) {
    const images = toImageList(src.images);
    if (images.length === 0 && typeof src.image === 'string' && src.image.trim()) {
      images.push(src.image.trim());
    }
    const resolved = images.length > 0 ? images : [DEFAULT_IMAGE];
    data.image = resolved[0];
    data.images = resolved;
  }

  if (!partial) {
    if (!data.name || !data.category || data.price === undefined) {
      return { ok: false, error: 'name, category et price sont obligatoires.' };
    }
    data.stock ??= 0;
    data.rating ??= 4.5;
    data.description ??= '';
    data.featured ??= false;
    data.active ??= true;
    if (!data.images) {
      data.image = DEFAULT_IMAGE;
      data.images = [DEFAULT_IMAGE];
    }
  } else if (data.name === '' || data.category === '') {
    return { ok: false, error: 'name et category ne peuvent pas être vides.' };
  }

  return { ok: true, data };
}
