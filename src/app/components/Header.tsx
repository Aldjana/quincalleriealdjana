import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MapPin, Phone, ShoppingCart, Menu, X, Clock, Facebook, Instagram } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SHOP, phoneLink, whatsappLink } from '../../config/shop';
import { Logo } from './ui/Logo';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/products', label: 'Produits', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

export const Header = () => {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      {/* Bandeau d'informations */}
      <div className="hidden bg-navy-900 text-white sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs lg:px-6">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-400" />
              {SHOP.city}
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <Clock className="h-3.5 w-3.5 text-brand-400" />
              {SHOP.hours[0].days} : {SHOP.hours[0].time}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={phoneLink()} className="flex items-center gap-1.5 font-medium transition hover:text-brand-400">
              <Phone className="h-3.5 w-3.5 text-brand-400" />
              {SHOP.phoneDisplay}
            </a>
            {SHOP.social.facebook && (
              <a href={SHOP.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-brand-400">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {SHOP.social.instagram && (
              <a href={SHOP.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand-400">
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Barre principale */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] lg:px-6">
          <Link to="/" aria-label={`${SHOP.name} — accueil`} className="min-w-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:rounded-full after:bg-brand-500 after:transition-all ${
                    isActive ? 'text-navy-900 after:w-6' : 'text-slate-600 after:w-0 hover:text-navy-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              aria-label={`Panier (${totalItems} article${totalItems > 1 ? 's' : ''})`}
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition hover:bg-slate-100"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <a
              href={whatsappLink(`Bonjour ${SHOP.name}, `)}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 sm:flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition hover:bg-slate-100 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="Navigation mobile">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-navy-50 text-navy-900' : 'text-slate-700 hover:bg-slate-50'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <a
                  href={phoneLink()}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-navy-900"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
                <a
                  href={whatsappLink(`Bonjour ${SHOP.name}, `)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-3 py-3 text-sm font-semibold text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
