import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';
import { metaPixelEvents } from '../config/metaPixel';
import { getProductId, type Product } from '../config/api';

export interface CustomerInfo {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

export interface OrderLine {
  product: Product;
  quantity: number;
}

const formatFcfa = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

/** Envoie la commande par email (EmailJS) puis enregistre l'achat dans Meta Pixel. */
export async function submitOrder(customer: CustomerInfo, lines: OrderLine[]): Promise<string> {
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const total = lines.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);

  const orderDetails = lines
    .map(
      ({ product, quantity }) =>
        `${product.name} - Quantité: ${quantity} - Prix: ${formatFcfa(product.price)} - Total: ${formatFcfa(product.price * quantity)}`
    )
    .join('\n');

  await emailjs.send(
    EMAILJS_CONFIG.SERVICE_ID,
    EMAILJS_CONFIG.TEMPLATE_ID,
    {
      order_id: orderId,
      customer_name: customer.customerName.trim(),
      customer_phone: customer.customerPhone.trim(),
      customer_address: customer.customerAddress.trim(),
      order_details: orderDetails,
      total_amount: total.toLocaleString('fr-FR'),
      order_date: new Date().toLocaleDateString('fr-FR'),
      to_email: EMAILJS_CONFIG.TO_EMAIL,
    },
    EMAILJS_CONFIG.PUBLIC_KEY
  );

  metaPixelEvents.purchase(
    total,
    orderId,
    lines.map(({ product }) => getProductId(product)),
    lines.reduce((sum, { quantity }) => sum + quantity, 0)
  );

  return orderId;
}
