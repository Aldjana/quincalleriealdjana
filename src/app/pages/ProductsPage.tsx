import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Star, ShoppingBag } from 'lucide-react';
import { getProductId, type Product } from '../../config/api';
import { useProducts } from '../../hooks/useProducts';
import { useOrder } from '../../hooks/useOrder';
import { ProductGallery } from '../components/ProductGallery';
import { OrderFormModal } from '../components/OrderFormModal';
import { useCart } from '../context/CartContext';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products: allProducts, isLoading } = useProducts();
  const { placeOrder, isSubmitting } = useOrder();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const viewProductDetail = (product: Product) => navigate(`/product/${getProductId(product)}`);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allProducts;
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    );
  }, [allProducts, searchTerm]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <header className="mb-6 rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-4 shadow-sm backdrop-blur sm:mb-8 sm:px-5 sm:py-5 md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Catalogue</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tous les produits</h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Outils et équipements sélectionnés pour les professionnels et les particuliers exigeants.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Rechercher un produit…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-3 text-base text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 sm:text-sm"
                />
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                <Filter className="h-4 w-4 text-slate-500" />
                Filtres
              </button>
            </div>
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="text-slate-600">Aucun produit ne correspond à votre recherche.</p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const inStock = product.stock === undefined || product.stock > 0;
              return (
                <article
                  key={getProductId(product)}
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
                        {inStock ? 'En stock' : 'Rupture'}
                      </span>
                      {product.featured ? (
                        <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                          Top vente
                        </span>
                      ) : null}
                    </div>
                    <ProductGallery product={product} variant="compact" />
                  </button>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600/90">{product.category}</p>
                    <h2 className="mt-1.5 min-h-[2.75rem] line-clamp-2 text-base font-semibold leading-snug text-slate-900">
                      <button
                        type="button"
                        onClick={() => viewProductDetail(product)}
                        className="text-left transition-colors hover:text-orange-600"
                      >
                        {product.name}
                      </button>
                    </h2>

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

                    <div className="mt-4 border-t border-slate-100 pt-4">
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
                          onClick={() => setSelectedProduct(product)}
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
        )}

        {selectedProduct && (
          <OrderFormModal
            title={`Commander : ${selectedProduct.name}`}
            isSubmitting={isSubmitting}
            onClose={() => setSelectedProduct(null)}
            onSubmit={(customer) => placeOrder(customer, [{ product: selectedProduct, quantity: 1 }])}
          />
        )}

        {showCartNotification && (
          <div className="fixed left-3 right-3 top-20 z-[10001] flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Ajouté au panier</p>
              <p className="text-xs text-slate-500">Ouvrez le panier pour finaliser.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
