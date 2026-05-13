import { Wrench, Hammer, PackageSearch, Paintbrush, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

interface CategoriesSectionProps {
  setCurrentPage: (page: string) => void;
}

export const CategoriesSection = ({ setCurrentPage }: CategoriesSectionProps) => {
  return (
    <section className="bg-gradient-to-br from-white via-orange-50 to-white py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full mb-4 sm:mb-6">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            <span className="text-center text-[11px] font-bold leading-tight text-orange-800 sm:text-sm md:text-base">
              CATÉGORIES POPULAIRES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4 sm:mb-6">Découvrez nos catégories</h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl sm:max-w-3xl mx-auto">Explorez notre large gamme de produits professionnels pour tous vos projets de construction et rénovation</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setCurrentPage('products')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <Hammer className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-tight text-gray-800 sm:text-sm md:text-base lg:text-lg">
              Perceuse
            </span>
            <span className="text-xs sm:text-sm text-gray-500 text-center mt-1">+150 modèles</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setCurrentPage('products')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <Hammer className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-tight text-gray-800 sm:text-sm md:text-base lg:text-lg">Marteau</span>
            <span className="text-xs sm:text-sm text-gray-500 text-center mt-1">+80 modèles</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setCurrentPage('products')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <PackageSearch className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-tight text-gray-800 sm:text-sm md:text-base lg:text-lg">Scie</span>
            <span className="text-xs sm:text-sm text-gray-500 text-center mt-1">+120 modèles</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setCurrentPage('products')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <Paintbrush className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-tight text-gray-800 sm:text-sm md:text-base lg:text-lg">Peinture</span>
            <span className="text-xs sm:text-sm text-gray-500 text-center mt-1">+200 modèles</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setCurrentPage('products')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-tight text-gray-800 sm:text-sm md:text-base lg:text-lg">Électricité</span>
            <span className="text-xs sm:text-sm text-gray-500 text-center mt-1">+180 modèles</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setCurrentPage('products')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-tight text-gray-800 sm:text-sm md:text-base lg:text-lg">Outils</span>
            <span className="text-xs sm:text-sm text-gray-500 text-center mt-1">+500 produits</span>
          </div>
        </div>
        
        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <button
            type="button"
            onClick={() => setCurrentPage('products')}
            className="mx-auto flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-4 sm:text-base lg:text-lg"
          >
            <span>Voir toutes les catégories</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
