import { ShoppingCart, CreditCard, Shield, Truck, Award, Check } from 'lucide-react';

interface HeroSectionProps {
  setCurrentPage: (page: string) => void;
}

export const HeroSection = ({ setCurrentPage }: HeroSectionProps) => {
  return (
    <section className="relative overflow-x-hidden bg-gradient-to-br from-orange-100 via-white to-blue-50">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5" />
      <div className="pointer-events-none absolute left-0 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 blur-3xl sm:h-64 sm:w-64" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 blur-3xl sm:h-64 sm:w-64" />

      <div className="relative mx-auto max-w-7xl px-3 pb-10 pt-6 sm:px-4 sm:pb-12 sm:pt-10 lg:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 space-y-5 sm:space-y-6 lg:order-1 lg:space-y-8">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm sm:px-4 sm:py-2">
              <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-orange-500" />
              <span className="truncate text-xs font-semibold text-orange-600 sm:text-sm">
                PROMOTION SPÉCIALE -30%
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
                QUINCAILLERIE
                <span className="mt-1 block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  ALDJANA
                </span>
              </h1>
              <p className="max-w-lg text-pretty text-sm leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
                L'excellence dans l'outillage professionnel pour tous vos projets
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                type="button"
                onClick={() => setCurrentPage('products')}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                <ShoppingCart className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <span>Voir les produits</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('products')}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                <CreditCard className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <span>Commander</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 sm:grid-cols-3 sm:gap-6 sm:pt-8">
              <div className="text-center group">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-1 sm:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <p className="text-[10px] sm:text-sm font-bold text-gray-800">Garantie</p>
                <p className="text-[10px] text-gray-500 sm:text-xs">2 ans</p>
              </div>
              <div className="text-center group">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-1 sm:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Truck className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <p className="text-[10px] sm:text-sm font-bold text-gray-800">Livraison</p>
                <p className="text-[10px] text-gray-500 sm:text-xs">24h Express</p>
              </div>
              <div className="text-center group">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-1 sm:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Award className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <p className="text-[10px] sm:text-sm font-bold text-gray-800">Qualité</p>
                <p className="text-[10px] text-gray-500 sm:text-xs">Premium</p>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-xl sm:rounded-3xl" />
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-gray-100 sm:rounded-3xl">
              <img
                src="https://etablissements-debibie.fr/wp-content/uploads/2023/06/Quincaillerie.jpg"
                alt="Magasin de quincaillerie et outillage"
                className="h-full w-full rounded-xl object-cover sm:rounded-2xl"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="mt-4 flex justify-end sm:absolute sm:bottom-4 sm:right-4 sm:mt-0 md:bottom-6 md:right-6">
              <div className="max-w-[calc(100vw-2rem)] rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-3 text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:max-w-none sm:rounded-2xl sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-10 sm:w-10">
                    <Check className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-bold sm:text-base">En stock</span>
                    <span className="block text-xs opacity-90">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
