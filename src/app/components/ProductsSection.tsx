import { useState } from 'react';
import { Star, ShoppingCart, ShoppingBag, Check } from 'lucide-react';
import { type Product } from '../../config/api';
import { ProductGallery } from './ProductGallery';

interface ProductsSectionProps {
  allProducts: Product[];
  viewProductDetail: (product: Product) => void;
  addToCart: (product: Product) => void;
}

export const ProductsSection = ({
  allProducts,
  viewProductDetail,
  addToCart,
}: ProductsSectionProps) => {
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="mb-12 text-center sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm">Sélection</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Produits populaires</h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Outils professionnels choisis pour leur fiabilité et leur rapport qualité-prix.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allProducts.slice(0, 8).map((product) => {
            const inStock = product.stock === undefined || product.stock > 0;
            return (
              <article
                key={product._id || product.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => viewProductDetail(product)}
                  className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-slate-100 text-left sm:h-72 lg:h-80"
                >
                  <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${
                        inStock
                          ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80'
                          : 'bg-rose-50 text-rose-800 ring-1 ring-rose-200/80'
                      }`}
                    >
                      {inStock ? (
                        <>
                          <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                          Dispo
                        </>
                      ) : (
                        'Rupture'
                      )}
                    </span>
                    {product.featured ? (
                      <span className="inline-flex items-center rounded-full bg-orange-500/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                        Top vente
                      </span>
                    ) : null}
                  </div>
                  <ProductGallery product={product} variant="compact" />
                </button>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600/90">{product.category}</p>
                  <h3 className="mt-1.5 min-h-[2.75rem] line-clamp-2 text-base font-semibold leading-snug text-slate-900">
                    <button type="button" onClick={() => viewProductDetail(product)} className="text-left transition-colors hover:text-orange-600">
                      {product.name}
                    </button>
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                            i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium tabular-nums text-slate-500">{product.rating.toFixed(1)}</span>
                  </div>

                  {product.description && (
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">{product.description}</p>
                  )}

                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <p className="text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
                      {product.price.toLocaleString('fr-FR')}
                      <span className="ml-1 text-sm font-semibold text-slate-600">FCFA</span>
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <ShoppingCart className="h-4 w-4 shrink-0" strokeWidth={2} />
                        Panier
                      </button>
                      <button
                        type="button"
                        onClick={() => viewProductDetail(product)}
                        disabled={!inStock}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={2} />
                        Commander
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => viewProductDetail(product)}
                      className="mt-2 w-full text-center text-xs font-semibold text-orange-600 transition hover:text-orange-700"
                    >
                      Voir la fiche détaillée
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {showCartNotification && (
          <div className="fixed bottom-4 left-3 right-3 z-50 flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ajouté au panier</p>
              <p className="text-xs text-slate-500">Vous pouvez finaliser depuis le panier.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
