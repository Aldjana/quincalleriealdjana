import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderRejectedError, submitOrder, type CustomerInfo, type OrderLine } from '../services/orders';
import { useToast } from '../app/context/ToastContext';

/** Gère l'envoi d'une commande puis la redirection vers la page de confirmation. */
export function useOrder(onSuccess?: () => void) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeOrder = async (customer: CustomerInfo, lines: OrderLine[]) => {
    if (lines.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const order = await submitOrder(customer, lines);
      onSuccess?.();
      navigate('/order-confirmation', { state: { order } });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error);
      showToast({
        type: 'error',
        title: 'Commande non envoyée',
        description:
          error instanceof OrderRejectedError
            ? error.message
            : 'Vérifiez votre connexion et réessayez, ou commandez sur WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { placeOrder, isSubmitting };
}
