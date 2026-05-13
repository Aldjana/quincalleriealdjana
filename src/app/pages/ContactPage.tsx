import { useState } from 'react';
import { Phone, MapPin, Clock, Send, Star } from 'lucide-react';

export const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: '',
    rating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si le numéro de téléphone est 776981453 pour rediriger vers WhatsApp
    if (formData.phone === '776981453' || formData.phone === '+221776981453') {
      const whatsappUrl = `https://wa.me/221776981453?text=${encodeURIComponent(`Bonjour ${formData.name},\n\nAdresse: ${formData.address}\n\nMessage: ${formData.message}`)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    // Réinitialiser le formulaire après envoi
    setFormData({
      name: '',
      phone: '',
      address: '',
      message: '',
      rating: 5
    });
    
    // Message de confirmation
    alert('Votre message a été envoyé avec succès! Nous vous contacterons rapidement.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating
    });
  };

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <h1 className="text-2xl sm:text-3xl text-[#0a2463] mb-6 sm:mb-8 text-center">Contactez-nous</h1>

        
        {/* Section Formulaire */}
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:gap-12">
          <div className="min-w-0">
            <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-3">
              <Send className="h-6 w-6 shrink-0 text-orange-500 sm:h-8 sm:w-8" />
              <h2 className="text-balance text-lg font-bold text-[#0a2463] sm:text-2xl">
                Envoyez-nous un message
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre adresse"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre message"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Note</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className={`p-1.5 sm:p-2 rounded-lg border ${
                        formData.rating === rating
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-orange-500'
                      }`}
                    >
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>

          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <h2 className="text-xl sm:text-2xl text-[#0a2463] font-bold">Nos horaires</h2>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Lundi - Vendredi</h3>
                  <p className="text-gray-600 text-sm sm:text-base">8h00 - 18h00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Samedi</h3>
                  <p className="text-gray-600 text-sm sm:text-base">9h00 - 15h00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600">Dakar, Sénégal</p>
                  <p className="text-sm text-gray-500">Près du marché Sandaga</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires</h3>
                  <p className="text-gray-600">Lundi - Samedi: 8h - 18h</p>
                  <p className="text-sm text-gray-500">Dimanche: Fermé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Témoignages Clients */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            <h2 className="text-xl sm:text-2xl text-[#0a2463] font-bold">Témoignages clients</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Mamadou Diop</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">77 123 45 67</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">28/04/2026</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                <span className="text-sm sm:text-base text-gray-600">Dakar, Plateau</span>
              </div>
              
              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">Excellent service! Livraison rapide et produits de qualité.</p>
              
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Fatou Sow</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">76 987 65 43</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">27/04/2026</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                <span className="text-sm sm:text-base text-gray-600">Thiès, Centre ville</span>
              </div>
              
              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">Très satisfait de mes achats. Le personnel est professionnel.</p>
              
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
