import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}

export const SectionHeading = ({ title, subtitle, linkTo, linkLabel }: SectionHeadingProps) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {linkTo && linkLabel && (
      <Link
        to={linkTo}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);
