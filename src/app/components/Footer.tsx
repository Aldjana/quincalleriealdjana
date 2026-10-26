import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { SHOP, phoneLink, whatsappLink } from '../../config/shop';
import { Logo } from './ui/Logo';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

export const Footer = () => (
  <footer className="bg-navy-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
      <div className="space-y-4">
        <Logo inverted />
        <p className="text-sm leading-relaxed text-slate-400">
          Votre partenaire depuis {SHOP.since} pour l'outillage, la quincaillerie et les matériaux de construction.
        </p>
        <div className="flex gap-3">
          {SHOP.social.facebook && (
            <a href={SHOP.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-lg bg-white/5 p-2 hover:bg-white/10">
              <Facebook className="h-5 w-5" />
            </a>
          )}
          {SHOP.social.instagram && (
            <a href={SHOP.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-lg bg-white/5 p-2 hover:bg-white/10">
              <Instagram className="h-5 w-5" />
            </a>
          )}
          <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-lg bg-white/5 p-2 hover:bg-white/10">
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Navigation</h3>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/" className="hover:text-brand-400">Accueil</Link></li>
          <li><Link to="/products" className="hover:text-brand-400">Tous les produits</Link></li>
          <li><Link to="/cart" className="hover:text-brand-400">Mon panier</Link></li>
          <li><Link to="/contact" className="hover:text-brand-400">Contact</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
            {SHOP.address}
          </li>
          <li>
            <a href={phoneLink()} className="flex gap-2.5 hover:text-brand-400">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              {SHOP.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${SHOP.email}`} className="flex gap-2.5 break-all hover:text-brand-400">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              {SHOP.email}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Horaires</h3>
        <ul className="space-y-3 text-sm">
          {SHOP.hours.map((slot) => (
            <li key={slot.days} className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>
                <span className="block text-white">{slot.days}</span>
                {slot.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row lg:px-6">
        <p>
          © {new Date().getFullYear()} {SHOP.name}. Tous droits réservés. ·{' '}
          <Link to="/confidentialite" className="hover:text-slate-300">
            Confidentialité
          </Link>
        </p>
        <p>Paiement à la livraison · Livraison partout au Sénégal</p>
      </div>
    </div>
  </footer>
);
