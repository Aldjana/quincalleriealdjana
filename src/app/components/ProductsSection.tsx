import type { Product } from '../../config/api';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { SectionHeading } from './ui/SectionHeading';

interface ProductsSectionProps {
  allProducts: Product[];
  isLoading?: boolean;
}

export const ProductsSection = ({ allProducts, isLoading = false }: ProductsSectionProps) => {
  // Produits vedettes en premier, puis les plus récents
  const popular = [...allProducts].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 10);

  return (
    <section className="bg-slate-50 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading title="Produits populaires" linkTo="/products" linkLabel="Voir tous les produits" />
        {isLoading && popular.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : popular.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
            Nos produits arrivent bientôt.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {popular.map((product) => (
              <ProductCard key={product._id ?? product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
