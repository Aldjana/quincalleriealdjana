import { useState } from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating: number;
  featured?: boolean;
  stock?: number;
}

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
    
    setTimeout(() => {
      setShowCartNotification(false);
    }, 2000);
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-orange-600 mb-3">
            Sélection
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Produits populaires
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Outils professionnels choisis pour leur fiabilité et leur rapport qualité-prix.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {allProducts.slice(0, 8).map((product) => {
            const inStock = product.stock === undefined || product.stock > 0;
            return (
              <article
                key={product.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => viewProductDetail(product)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left"
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
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </button>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600/90">
                    {product.category}
                  </p>
                  <h3 className="mt-1.5 min-h-[2.75rem] text-base font-semibold leading-snug text-slate-900 line-clamp-2">
                    <button
                      type="button"
                      onClick={() => viewProductDetail(product)}
                      className="text-left transition-colors hover:text-orange-600"
                    >
                      {product.name}
                    </button>
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-0.5" aria-hidden>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-2 min-h-0 flex-1">
                    {product.description ? (
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{product.description}</p>
                    ) : null}
                  </div>

                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
                          {product.price.toLocaleString('fr-FR')}
                          <span className="ml-1 text-sm font-semibold text-slate-600">FCFA</span>
                        </p>
                        <p className="text-[11px] text-slate-400">Prix TTC indicatif</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                      <ShoppingCart className="h-4 w-4 shrink-0" strokeWidth={2} />
                      {inStock ? 'Ajouter au panier' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {showCartNotification && (
          <div className="fixed bottom-4 left-3 right-3 z-50 flex max-w-none items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
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
