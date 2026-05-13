import { Shield, Truck, HeadphonesIcon, Facebook, Instagram, MessageCircle, Award, Clock, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-10 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold sm:text-2xl md:text-3xl mb-3 sm:mb-4">Pourquoi nous choisir?</h3>
            <p className="mx-auto max-w-2xl px-2 text-sm text-gray-300 sm:text-base">
              L'excellence dans chaque produit, le service à chaque client
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
            <h4 className="text-lg font-bold sm:text-xl mb-2">Qualité Premium</h4>
              <p className="text-gray-400 text-sm">Produits certifiés et garantis</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Livraison Rapide</h4>
              <p className="text-gray-400 text-sm">24h Express sur tout le pays</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Support 24/7</h4>
              <p className="text-gray-400 text-sm">Assistance client disponible</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Expertise</h4>
              <p className="text-gray-400 text-sm">Plus de 25 ans d'expérience</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-xl font-bold mb-6">À propos</h4>
            <p className="text-gray-400 mb-4">
              Quincaillerie ALDJANA est votre partenaire de confiance pour tous vos projets de construction et rénovation depuis 1995.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" />
              <Instagram className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" />
              <MessageCircle className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Vente en gros</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Conseil technique</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Livraison sur site</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Service après-vente</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Lun-Sam: 8h-18h
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                77 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@aldjana.sn
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dakar, Sénégal
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold sm:text-xl mb-4 sm:mb-6">Newsletter</h4>
            <p className="mb-4 text-sm text-gray-400 sm:text-base">Inscrivez-vous pour recevoir nos offres exclusives</p>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Votre email"
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                className="min-h-11 shrink-0 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 sm:px-6"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12 flex flex-col gap-6 border-t border-white/10 pt-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm text-gray-300 sm:text-base">&copy; 2026 Quincaillerie Aldjana - Tous droits réservés</p>
          <div className="flex justify-center gap-6 sm:justify-end">
            <Facebook className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" />
            <Instagram className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" />
            <MessageCircle className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
