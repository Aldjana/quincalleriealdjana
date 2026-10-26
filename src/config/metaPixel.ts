// Configuration Meta Pixel
// Ce fichier gère l'intégration de Meta Pixel pour le tracking des événements

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

// Meta n'accepte pas le XOF. Le franc CFA ayant une parité fixe avec l'euro
// (1 EUR = 655,957 FCFA), on convertit les montants en EUR : la valeur
// rapportée à Meta est ainsi exacte (et non gonflée ~600x comme en "USD").
const XOF_PER_EUR = 655.957;

export const META_PIXEL_CONFIG = {
  PIXEL_ID: (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || '',
  CURRENCY: 'EUR',
};

export const fcfaToPixelValue = (amountFcfa: number) => Math.round((amountFcfa / XOF_PER_EUR) * 100) / 100;

type StandardEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Contact';

let initialized = false;

// Initialiser le Meta Pixel (script officiel). L'appel est synchrone : la file
// d'attente de fbq conserve les événements jusqu'au chargement du script.
export const initMetaPixel = () => {
  if (initialized || typeof window === 'undefined' || !META_PIXEL_CONFIG.PIXEL_ID) return;
  initialized = true;

  if (!window.fbq) {
    const fbq: any = function (...args: unknown[]) {
      fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq ??= fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  window.fbq!('init', META_PIXEL_CONFIG.PIXEL_ID);
};

const track = (eventName: StandardEvent, parameters?: Record<string, unknown>, eventID?: string) => {
  if (!initialized || !window.fbq) return;
  const options = eventID ? { eventID } : undefined;
  if (eventName === 'PageView' || (eventName === 'Contact' && !parameters)) window.fbq('track', eventName);
  else window.fbq('track', eventName, { currency: META_PIXEL_CONFIG.CURRENCY, ...parameters }, options);
};

export const metaPixelEvents = {
  pageView: () => track('PageView'),

  viewContent: (productName: string, productId: string, priceFcfa: number) =>
    track('ViewContent', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: fcfaToPixelValue(priceFcfa),
    }),

  addToCart: (productName: string, productId: string, priceFcfa: number, quantity = 1) =>
    track('AddToCart', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: fcfaToPixelValue(priceFcfa * quantity),
      num_items: quantity,
    }),

  // Clic sur un lien WhatsApp ou téléphone : beaucoup de commandes passent par là
  contact: () => track('Contact'),

  initiateCheckout: (totalFcfa: number, numItems: number) =>
    track('InitiateCheckout', { value: fcfaToPixelValue(totalFcfa), num_items: numItems }),

  // eventID sert à la déduplication côté Meta
  purchase: (totalFcfa: number, orderId: string, contentIds: string[] = [], numItems?: number) =>
    track(
      'Purchase',
      {
        value: fcfaToPixelValue(totalFcfa),
        content_ids: contentIds,
        content_type: 'product',
        num_items: numItems,
      },
      orderId
    ),
};
