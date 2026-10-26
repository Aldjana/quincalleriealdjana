import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, BadgePercent, Truck } from 'lucide-react';
import { SHOP, whatsappLink } from '../../config/shop';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

const FEATURES = [
  { icon: ShieldCheck, title: 'Qualité', text: 'Produits sélectionnés' },
  { icon: BadgePercent, title: 'Prix compétitifs', text: 'Les meilleurs du marché' },
  { icon: Truck, title: 'Livraison rapide', text: 'Partout au Sénégal' },
];

export const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-navy-50">
    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-6 lg:py-16">
      <div className="order-2 lg:order-1">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
          Depuis {SHOP.since} à votre service
        </p>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
          QUINCAILLERIE
          <span className="block text-brand-500">ALDJANA</span>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600 sm:text-xl">{SHOP.tagline}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-900 sm:text-base"
          >
            Voir nos produits
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={whatsappLink(`Bonjour ${SHOP.name}, je souhaite passer une commande.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 transition hover:border-whatsapp hover:text-whatsapp-dark sm:text-base"
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            Commander sur WhatsApp
          </a>
        </div>

        <ul className="mt-10 grid gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <Icon className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-slate-900">{title}</span>
                <span className="text-xs text-slate-500">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative order-1 lg:order-2">
        <div className="absolute -inset-4 -z-0 rounded-[2rem] bg-gradient-to-tr from-brand-100/60 via-transparent to-navy-100/70 blur-2xl" />
        <img
          src="/hero-outils.webp"
          alt="Casque de chantier, perceuse et outils sur un établi"
          width={598}
          height={393}
          fetchPriority="high"
          className="relative aspect-[3/2] w-full rounded-2xl object-cover shadow-xl shadow-navy-900/10 ring-1 ring-slate-200"
        />
      </div>
    </div>
  </section>
);
