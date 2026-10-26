import { useLocation } from 'react-router-dom';
import { SHOP, whatsappLink } from '../../config/shop';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

// Masqué là où la page a déjà ses propres boutons WhatsApp (évite de cacher « Commander »)
const HIDDEN_ON = ['/cart', '/product/', '/order-confirmation'];

/** Bouton flottant pour contacter la boutique sur WhatsApp */
export const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (HIDDEN_ON.some((path) => pathname.startsWith(path))) return null;

  return (
    <a
      href={whatsappLink(`Bonjour ${SHOP.name}, j'ai une question.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-emerald-900/20 transition hover:scale-105 hover:bg-whatsapp-dark sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
};
