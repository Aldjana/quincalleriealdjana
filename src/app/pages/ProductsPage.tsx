import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { getCategories } from '../../utils/categories';
import { normalize } from '../../utils/format';
import { ProductCard, ProductCardSkeleton, isInStock } from '../components/ProductCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';

const PAGE_SIZE = 12;

const SORTS = [
  { id: 'pertinence', label: 'Pertinence' },
  { id: 'prix-asc', label: 'Prix croissant' },
  { id: 'prix-desc', label: 'Prix décroissant' },
  { id: 'nom', label: 'Nom (A-Z)' },
];

export const ProductsPage = () => {
  const { products, isLoading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('categorie') ?? '';
  const sort = params.get('tri') ?? 'pertinence';
  const query = params.get('q') ?? '';
  const inStockOnly = params.get('stock') === '1';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [search, setSearch] = useState(query);
  useEffect(() => {
    setSearch(query);
  }, [query]);

  const updateParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('page' in changes)) next.delete('page');
    setParams(next, { replace: true });
  };

  // Recherche appliquée après une courte pause de saisie
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== query) updateParams({ q: search.trim() || null });
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const categories = useMemo(() => getCategories(products), [products]);

  const filtered = useMemo(() => {
    const term = normalize(query);
    const result = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!inStockOnly || isInStock(p)) &&
        (!term || normalize(`${p.name} ${p.category} ${p.description ?? ''}`).includes(term))
    );
    if (sort === 'prix-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'prix-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'nom') result.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return result;
  }, [products, category, query, sort, inStockOnly]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilters = [category, inStockOnly, query].filter(Boolean).length;

  const goToPage = (n: number) => {
    updateParams({ page: n > 1 ? String(n) : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtersPanel = (
    <div className="space-y-6">
      <FilterGroup title="Catégories">
        <FilterOption label="Toutes les catégories" count={products.length} active={!category} onClick={() => updateParams({ categorie: null })} />
        {categories.map((c) => (
          <FilterOption
            key={c.name}
            label={c.name}
            count={c.count}
            active={category === c.name}
            onClick={() => updateParams({ categorie: c.name })}
          />
        ))}
      </FilterGroup>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => updateParams({ stock: e.target.checked ? '1' : null })}
          className="h-4 w-4 rounded accent-brand-500"
        />
        Disponible uniquement
      </label>

      {activeFilters > 0 && (
        <button
          type="button"
          onClick={() => setParams({}, { replace: true })}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: category || 'Produits' }]} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{category || 'Nos produits'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading && products.length === 0
              ? 'Chargement…'
              : `${filtered.length} produit${filtered.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              aria-label="Rechercher un produit"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-base outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/15 sm:text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => updateParams({ tri: e.target.value === 'pertinence' ? null : e.target.value })}
            aria-label="Trier les produits"
            className="hidden h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-navy-500 sm:block"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="relative flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {activeFilters > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Catégories rapides (mobile) */}
      {categories.length > 0 && (
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
          <Chip label="Tout" active={!category} onClick={() => updateParams({ categorie: null })} />
          {categories.map((c) => (
            <Chip key={c.name} label={c.name} active={category === c.name} onClick={() => updateParams({ categorie: c.name })} />
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-xl border border-slate-200 bg-white p-5">{filtersPanel}</div>
        </aside>

        <div className="min-w-0">
          {error && products.length === 0 ? (
            <EmptyState title="Impossible de charger les produits" text="Vérifiez votre connexion puis actualisez la page." />
          ) : isLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              title="Aucun produit trouvé"
              text="Essayez un autre mot-clé ou retirez des filtres."
              action={
                <button
                  type="button"
                  onClick={() => setParams({}, { replace: true })}
                  className="mt-4 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-900"
                >
                  Voir tous les produits
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {visible.map((product) => (
                  <ProductCard key={product._id ?? product.id} product={product} />
                ))}
              </div>
              {pageCount > 1 && (
                <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      aria-current={n === currentPage ? 'page' : undefined}
                      className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                        n === currentPage ? 'bg-navy-800 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Panneau de filtres mobile */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-lg font-semibold text-navy-900">Filtres</p>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Fermer" className="rounded-lg p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterGroup title="Trier par">
                {SORTS.map((s) => (
                  <FilterOption
                    key={s.id}
                    label={s.label}
                    active={sort === s.id}
                    onClick={() => updateParams({ tri: s.id === 'pertinence' ? null : s.id })}
                  />
                ))}
              </FilterGroup>
              <div className="mt-6">{filtersPanel}</div>
            </div>
            <div className="border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-lg bg-navy-800 py-3 text-sm font-semibold text-white"
              >
                Voir {filtered.length} produit{filtered.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-navy-900">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function FilterOption({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
          active ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <span className="truncate">{label}</span>
        {count !== undefined && <span className="shrink-0 text-xs text-slate-400">{count}</span>}
      </button>
    </li>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 bg-white text-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-16 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
      {action}
    </div>
  );
}
