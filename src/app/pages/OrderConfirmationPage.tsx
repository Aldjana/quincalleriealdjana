import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Home } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Empêcher le tracking de Purchase au rechargement de la page
    // L'événement a déjà été envoyé avant la redirection
    const hasTrackedPurchase = sessionStorage.getItem('purchase_tracked');
    if (hasTrackedPurchase) {
      sessionStorage.removeItem('purchase_tracked');
    }
  }, []);

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-green-100">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="mb-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Commande confirmée ✅
              </h1>
              
              <p className="mb-6 text-base sm:text-lg text-gray-600">
                Merci pour votre commande ! Nous avons bien reçu votre demande.
              </p>
              
              <div className="mb-8 rounded-lg bg-blue-50 p-4 sm:p-6 w-full">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Prochaines étapes</h3>
                    <p className="text-sm text-gray-600">
                      Notre équipe vous contactera très bientôt par téléphone pour confirmer 
                      les détails de votre commande et organiser la livraison.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => navigate('/products')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Continuer mes achats</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  <Home className="h-5 w-5" />
                  <span>Retour à l'accueil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};