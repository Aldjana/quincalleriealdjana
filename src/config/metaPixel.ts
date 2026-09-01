// Configuration Meta Pixel
// Ce fichier gère l'intégration de Meta Pixel pour le tracking des événements

// Déclarations TypeScript pour fbq global
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    metaPixelInitialized?: boolean;
  }
}

export const META_PIXEL_CONFIG = {
  PIXEL_ID: import.meta.env.VITE_META_PIXEL_ID as string || '',
  CURRENCY: 'USD' // Meta n'accepte pas XOF, on utilise USD pour le tracking
};

// Types pour les événements Meta Pixel
export interface MetaPixelEvent {
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
  parameters?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_ids?: string[];
    content_type?: string;
    num_items?: number;
    eventID?: string;
  };
}

// Initialiser le Meta Pixel
export const initMetaPixel = () => {
  if (typeof window === 'undefined' || !META_PIXEL_CONFIG.PIXEL_ID) {
    console.warn('Meta Pixel ID non configuré ou environnement non supporté');
    return;
  }

  // Vérifier si déjà initialisé pour éviter les doublons
  if (window.metaPixelInitialized) {
    console.log('Meta Pixel déjà initialisé (flag)');
    return;
  }

  // Méthode officielle Meta Pixel (IIFE)
  // @ts-ignore - Script officiel Meta Pixel, typage complexe ignoré intentionnellement
  (function(f: any, b: any, e: any, v: string, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Attendre un peu que le script soit chargé avant d'initialiser
  setTimeout(() => {
    if (window.fbq) {
      window.fbq('init', META_PIXEL_CONFIG.PIXEL_ID);
      window.fbq('track', 'PageView');
      window.metaPixelInitialized = true;
      console.log('✅ Meta Pixel initialisé avec succès');
    } else {
      console.error('❌ Erreur: fbq non disponible après le chargement du script');
    }
  }, 100);
};

// Tracker un événement Meta Pixel
export const trackMetaPixelEvent = ({ eventName, parameters }: MetaPixelEvent) => {
  console.log('📊 trackMetaPixelEvent appelé:', { eventName, parameters });
  
  if (typeof window === 'undefined') {
    console.warn('Environnement non supporté (window undefined)');
    return;
  }

  if (!window.fbq) {
    console.warn('Meta Pixel non initialisé (fbq non disponible), événement mis en file d\'attente');
    // Mettre en file d'attente pour quand fbq sera disponible
    setTimeout(() => {
      if (window.fbq) {
        const eventParameters = {
          currency: META_PIXEL_CONFIG.CURRENCY,
          ...parameters
        };
        console.log('🎯 Envoi retardé à Meta Pixel:', eventName, eventParameters);
        window.fbq('trackCustom', eventName, eventParameters);
      }
    }, 500);
    return;
  }

  // Paramètres par défaut
  const eventParameters = {
    currency: META_PIXEL_CONFIG.CURRENCY,
    ...parameters
  };

  console.log('🎯 Envoi à Meta Pixel:', eventName, eventParameters);
  
  // Utiliser les événements standards Meta Pixel pour la production
  // trackCustom est moins optimal pour les campagnes Meta Ads
  if (eventName === 'PageView') {
    window.fbq('track', 'PageView');
    console.log('✅ PageView envoyé avec track standard');
  } else {
    // Pour les autres événements, utiliser track standard
    window.fbq('track', eventName, eventParameters);
    console.log('✅ Événement envoyé avec track standard:', eventName);
  }
};

// Événements spécifiques avec helpers
export const metaPixelEvents = {
  pageView: () => {
    trackMetaPixelEvent({ eventName: 'PageView' });
  },

  viewContent: (productName: string, productId: string, price: number) => {
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: productName,
        content_ids: [productId],
        content_type: 'product',
        value: price
      }
    });
  },

  addToCart: (productName: string, productId: string, price: number, quantity: number = 1) => {
    console.log('🛒 Meta Pixel AddToCart appelé:', { productName, productId, price, quantity });
    trackMetaPixelEvent({
      eventName: 'AddToCart',
      parameters: {
        content_name: productName,
        content_ids: [productId],
        content_type: 'product',
        value: price * quantity,
        num_items: quantity
      }
    });
  },

  initiateCheckout: (totalValue: number, numItems: number) => {
    trackMetaPixelEvent({
      eventName: 'InitiateCheckout',
      parameters: {
        value: totalValue,
        num_items: numItems
      }
    });
  },

  purchase: (totalValue: number, orderId: string) => {
    trackMetaPixelEvent({
      eventName: 'Purchase',
      parameters: {
        value: totalValue,
        currency: 'USD', // Meta n'accepte pas XOF, on utilise USD pour le tracking
        eventID: orderId // Pour éviter les doublons
      }
    });
  }
};