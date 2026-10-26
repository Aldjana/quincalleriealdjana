import { Wrench } from 'lucide-react';

export const Logo = ({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) => (
  <span className="flex items-center gap-2.5">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 shadow-sm ring-2 ring-brand-500/80 sm:h-11 sm:w-11">
      <Wrench className="h-5 w-5 text-brand-500 sm:h-6 sm:w-6" strokeWidth={2.5} />
    </span>
    {!compact && (
      <span className="leading-none">
        <span
          className={`block text-[15px] font-extrabold tracking-tight sm:text-lg ${inverted ? 'text-white' : 'text-navy-900'}`}
        >
          QUINCAILLERIE
        </span>
        <span className="block text-[15px] font-extrabold tracking-tight text-brand-500 sm:text-lg">ALDJANA</span>
      </span>
    )}
  </span>
);
