import { Link } from 'react-router-dom';
import type { Product } from '../../config/api';
import { getCategories, getCategoryIcon } from '../../utils/categories';
import { SectionHeading } from './ui/SectionHeading';

export const CategoriesSection = ({ products }: { products: Product[] }) => {
  const categories = getCategories(products).slice(0, 6);
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-6">
      <SectionHeading title="Nos catégories" linkTo="/products" linkLabel="Toutes les catégories" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {categories.map(({ name, count }) => {
          const Icon = getCategoryIcon(name);
          return (
            <Link
              key={name}
              to={`/products?categorie=${encodeURIComponent(name)}`}
              className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-md"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                <Icon className="h-7 w-7" />
              </span>
              <span className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">{name}</span>
              <span className="mt-0.5 text-xs text-slate-500">
                {count} produit{count > 1 ? 's' : ''}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};


