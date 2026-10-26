// Informations de la boutique, utilisées partout sur le site.
// Modifiez ce fichier pour mettre à jour téléphone, adresse, horaires, réseaux sociaux...

export const SHOP = {
  name: 'Quincaillerie Aldjana',
  tagline: 'Tout pour vos travaux et vos projets de construction',
  since: 2010,

  phoneDisplay: '77 698 14 53',
  phoneIntl: '+221776981453',
  whatsappNumber: '221776981453',
  email: 'seckf004@gmail.com',

  city: 'Dakar, Sénégal',
  address: 'Dakar, Sénégal',
  mapQuery: 'Dakar, Sénégal',

  hours: [
    { days: 'Lundi - Samedi', time: '8h00 - 18h00' },
    { days: 'Dimanche', time: 'Fermé' },
  ],

  // Laisser vide pour masquer l'icône
  social: {
    facebook: '',
    instagram: '',
  },

  // Livraison offerte à partir de ce montant (FCFA). 0 = toujours à confirmer.
  freeDeliveryFrom: 50000,
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SHOP.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const phoneLink = () => `tel:${SHOP.phoneIntl}`;
