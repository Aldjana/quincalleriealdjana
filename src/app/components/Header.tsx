import { useState } from 'react';
import { Wrench, ShoppingCart, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  getTotalItems: () => number;
}

export const Header = ({ currentPage: _currentPage, setCurrentPage, getTotalItems }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/98 shadow-lg backdrop-blur-xl supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex min-h-[4.25rem] items-center justify-between gap-2 py-2 sm:min-h-20 md:h-24 md:py-0">
          <div
            className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-4 group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-lg transition-all duration-300 group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl sm:shadow-2xl lg:h-16 lg:w-16">
              <Wrench className="h-5 w-5 text-white sm:h-7 sm:w-7 lg:h-9 lg:w-9" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-black tracking-tight text-[#0f172a] sm:text-xl lg:text-2xl">
                QUINCAILLERIE
              </span>
              <span className="block truncate text-sm font-black tracking-tight text-orange-500 sm:text-xl lg:text-2xl">
                ALDJANA
              </span>
              <span className="mt-0.5 hidden text-xs font-medium text-gray-500 sm:block">
                L'excellence depuis 2010
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-10">
            <button onClick={() => setCurrentPage('home')} className="text-[#0f172a] hover:text-orange-500 font-bold text-sm md:text-base lg:text-lg transition-all duration-300 relative group py-2">
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setCurrentPage('products')} className="text-[#0f172a] hover:text-orange-500 font-bold text-sm md:text-base lg:text-lg transition-all duration-300 relative group py-2">
              Produits
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setCurrentPage('contact')} className="text-[#0f172a] hover:text-orange-500 font-bold text-sm md:text-base lg:text-lg transition-all duration-300 relative group py-2">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              aria-label="Ouvrir le panier"
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-2 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 sm:min-h-12 sm:min-w-12 sm:rounded-xl sm:p-3 sm:shadow-lg"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center shadow-md sm:shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto border-t border-gray-200 bg-white shadow-lg md:hidden supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4">
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }} 
                className="min-h-11 rounded-lg px-1 py-3 text-left text-base font-bold text-[#0f172a] transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                Accueil
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('products');
                  setIsMobileMenuOpen(false);
                }} 
                className="min-h-11 rounded-lg px-1 py-3 text-left text-base font-bold text-[#0f172a] transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                Produits
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('contact');
                  setIsMobileMenuOpen(false);
                }} 
                className="min-h-11 rounded-lg px-1 py-3 text-left text-base font-bold text-[#0f172a] transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
