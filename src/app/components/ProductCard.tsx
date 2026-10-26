import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getProductId, type Product } from '../../config/api';
import { getProductImages } from '../../utils/productImages';
import { formatPrice } from '../../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const isInStock = (product: Product) => product.stock === undefined || product.stock > 0;

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const inStock = isInStock(product);
  const href = `/product/${getProductId(product)}`;

  const handleAdd = () => {
    addToCart(product);
    showToast({ type: 'success', title: 'Ajouté au panier', description: product.name });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
      <Link to={href} className="relative block aspect-square overflow-hidden bg-slate-50">
        <img
          src={getProductImages(product)[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.featured && (
            <span className="rounded-md bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-white">Top vente</span>
          )}
          {!inStock && (
            <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-white">Rupture</span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-slate-900 sm:text-[15px]">
          <Link to={href} className="hover:text-brand-600">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="whitespace-nowrap text-[15px] font-bold tabular-nums text-navy-800 sm:text-lg">{formatPrice(product.price)}</p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            aria-label={`Ajouter ${product.name} au panier`}
            title={inStock ? 'Ajouter au panier' : 'Indisponible'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
};

export const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="aspect-square animate-pulse bg-slate-100" />
    <div className="space-y-2 p-4">
      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
    </div>
  </div>
);
