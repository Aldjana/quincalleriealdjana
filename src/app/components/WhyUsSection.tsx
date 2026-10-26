import type { ReactNode } from 'react';
import { PackageCheck, Headset, Star, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { SHOP, phoneLink, whatsappLink } from '../../config/shop';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

const REASONS = [
  { icon: PackageCheck, title: 'Large choix de produits', text: "Tout ce qu'il vous faut" },
  { icon: Headset, title: 'Conseils experts', text: 'Une équipe à votre écoute' },
  { icon: Star, title: 'Satisfaction garantie', text: 'Des clients satisfaits' },
  { icon: Clock, title: 'Réponse rapide', text: 'Commande confirmée par téléphone' },
];

export const WhyUsSection = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-6">
    <div className="grid gap-6 rounded-2xl bg-navy-900 p-6 text-white sm:p-8 lg:grid-cols-[220px_1fr] lg:items-center lg:gap-10">
      <h2 className="text-2xl font-bold leading-tight">
        Pourquoi choisir
        <span className="block text-brand-400">{SHOP.name} ?</span>
      </h2>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
        {REASONS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3 lg:px-5 lg:first:pl-0">
            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-400" />
            <span>
              <span className="block text-sm font-semibold">{title}</span>
              <span className="text-sm text-slate-300">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>

    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <ContactItem icon={<MapPin className="h-6 w-6" />} title="Adresse" value={SHOP.address} />
      <ContactItem icon={<Phone className="h-6 w-6" />} title="Téléphone" value={SHOP.phoneDisplay} href={phoneLink()} />
      <ContactItem icon={<Mail className="h-6 w-6" />} title="Email" value={SHOP.email} href={`mailto:${SHOP.email}`} />
      <ContactItem
        icon={<WhatsAppIcon className="h-6 w-6" />}
        title="WhatsApp"
        value={SHOP.phoneDisplay}
        href={whatsappLink()}
        external
      />
    </ul>
  </section>
);

function ContactItem({
  icon,
  title,
  value,
  href,
  external,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="text-navy-700">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="block break-words text-sm text-slate-600">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="flex items-start gap-3 rounded-lg transition hover:text-brand-600"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-start gap-3">{content}</div>
      )}
    </li>
  );
}
