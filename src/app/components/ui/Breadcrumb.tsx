import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items }: { items: { label: string; to?: string }[] }) => (
  <nav aria-label="Fil d'Ariane" className="mb-5 flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-slate-500">
    {items.map((item, index) => (
      <span key={item.label} className="flex min-w-0 items-center gap-1.5">
        {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
        {item.to ? (
          <Link to={item.to} className="shrink-0 transition hover:text-brand-600">
            {item.label}
          </Link>
        ) : (
          <span className="truncate font-medium text-slate-800">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);
