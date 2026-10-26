import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';
import { metaPixelEvents } from '../config/metaPixel';
import { ApiError, getProductId, ordersAPI, type Product } from '../config/api';
import { formatPrice } from '../utils/format';

export interface CustomerInfo {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
}

export interface OrderLine {
  product: Product;
  quantity: number;
}

export interface PlacedOrder {
  orderNumber: string;
  total: number;
  items: { name: string; price: number; quantity: number; image?: string }[];
  customerName: string;
  savedInAdmin: boolean;
}

/** Erreur à montrer telle quelle au client (données invalides, produit indisponible...) */
export class OrderRejectedError extends Error {}

function localOrderNumber() {
  return `CMD-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * 1. Enregistre la commande sur le serveur (prix recalculés en base) → visible dans l'admin
 * 2. Envoie l'email de notification (EmailJS)
 * 3. Enregistre l'achat dans Meta Pixel
 * Si le serveur est injoignable, l'email sert de secours pour ne jamais perdre une commande.
 */
export async function submitOrder(customer: CustomerInfo, lines: OrderLine[]): Promise<PlacedOrder> {
  let placed: PlacedOrder | null = null;

  try {
    const saved = await ordersAPI.create({
      customer: {
        name: customer.customerName.trim(),
        phone: customer.customerPhone.trim(),
        address: customer.customerAddress.trim(),
        note: customer.customerNote?.trim() || undefined,
      },
      items: lines.map(({ product, quantity }) => ({ productId: getProductId(product), quantity })),
    });
    placed = {
      orderNumber: saved.orderNumber,
      total: saved.total,
      items: saved.items,
      customerName: customer.customerName.trim(),
      savedInAdmin: true,
    };
  } catch (error) {
    // Erreur de validation (4xx) : le client doit corriger, on n'envoie rien
    if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
      throw new OrderRejectedError(error.message);
    }
    console.warn('Commande non enregistrée sur le serveur, envoi par email uniquement :', error);
  }

  if (!placed) {
    const items = lines.map(({ product, quantity }) => ({
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    }));
    placed = {
      orderNumber: localOrderNumber(),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items,
      customerName: customer.customerName.trim(),
      savedInAdmin: false,
    };
  }

  const orderDetails = placed.items
    .map(
      (item) =>
        `${item.name} - Quantité: ${item.quantity} - Prix: ${formatPrice(item.price)} - Total: ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n');

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        order_id: placed.orderNumber,
        customer_name: customer.customerName.trim(),
        customer_phone: customer.customerPhone.trim(),
        customer_address: customer.customerAddress.trim(),
        order_details: customer.customerNote?.trim()
          ? `${orderDetails}\n\nNote du client : ${customer.customerNote.trim()}`
          : orderDetails,
        total_amount: placed.total.toLocaleString('fr-FR'),
        order_date: new Date().toLocaleDateString('fr-FR'),
        to_email: EMAILJS_CONFIG.TO_EMAIL,
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    );
  } catch (error) {
    // Sans enregistrement serveur ni email, la commande serait perdue : on signale l'échec
    if (!placed.savedInAdmin) throw error;
    console.warn('Email de commande non envoyé (commande bien enregistrée) :', error);
  }

  metaPixelEvents.purchase(
    placed.total,
    placed.orderNumber,
    lines.map(({ product }) => getProductId(product)),
    lines.reduce((sum, { quantity }) => sum + quantity, 0)
  );

  return placed;
}
