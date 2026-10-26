import { useEffect, useState } from 'react';
import { productsAPI, getProductId, type Product } from '../config/api';

const CACHE_KEY = 'cached_products';

// Cache partagé entre toutes les pages : une seule requête réseau par visite
let memoryCache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;
const listeners = new Set<(products: Product[]) => void>();

function readStorage(): Product[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStorage(products: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch {
    /* quota dépassé ou stockage bloqué : le cache mémoire suffit */
  }
}

function getCached(): Product[] | null {
  if (!memoryCache) memoryCache = readStorage();
  return memoryCache;
}

function refresh(): Promise<Product[]> {
  if (!inflight) {
    inflight = productsAPI
      .getAll()
      .then((products) => {
        memoryCache = products;
        writeStorage(products);
        listeners.forEach((listener) => listener(products));
        return products;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

let refreshedThisSession = false;

/**
 * Affiche immédiatement le cache (mémoire ou localStorage) puis
 * rafraîchit en arrière-plan une fois par session (stale-while-revalidate).
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => getCached() ?? []);
  const [isLoading, setIsLoading] = useState(() => getCached() === null);
  const [error, setError] = useState<string | null>(null);
  // true quand les données viennent du serveur (et non du cache local)
  const [isFresh, setIsFresh] = useState(refreshedThisSession);

  useEffect(() => {
    listeners.add(setProducts);

    if (!refreshedThisSession || getCached() === null) {
      refresh()
        .then(() => {
          refreshedThisSession = true;
          setIsFresh(true);
          setError(null);
        })
        .catch((err: unknown) => {
          console.error('Erreur au chargement des produits :', err);
          setError('Impossible de charger les produits pour le moment.');
        })
        .finally(() => setIsLoading(false));
    }

    return () => {
      listeners.delete(setProducts);
    };
  }, []);

  return { products, isLoading, error, isFresh };
}

/** Un produit : servi depuis le cache si possible, sinon chargé depuis l'API. */
export function useProduct(id: string | undefined) {
  const findCached = () => (id ? getCached()?.find((p) => getProductId(p) === id) ?? null : null);
  const [product, setProduct] = useState<Product | null>(findCached);
  const [isLoading, setIsLoading] = useState(() => findCached() === null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const cached = findCached();
    setProduct(cached);
    setIsLoading(cached === null);

    productsAPI
      .getById(id)
      .then((data) => !cancelled && setProduct(data))
      .catch((err) => {
        console.error('Erreur au chargement du produit :', err);
      })
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { product, isLoading };
}
