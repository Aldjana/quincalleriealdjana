import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-700">
      <SearchX className="h-8 w-8" />
    </span>
    <h1 className="mt-5 text-2xl font-bold text-navy-900">Page introuvable</h1>
    <p className="mt-2 text-slate-600">Cette page n'existe pas ou a été déplacée.</p>
    <div className="mt-6 flex gap-3">
      <Link to="/" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">
        Accueil
      </Link>
      <Link to="/products" className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
        Voir les produits
      </Link>
    </div>
  </div>
);
