import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitOrder, type CustomerInfo, type OrderLine } from '../services/orders';

/** Gère l'envoi d'une commande puis la redirection vers la page de confirmation. */
export function useOrder(onSuccess?: () => void) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeOrder = async (customer: CustomerInfo, lines: OrderLine[]) => {
    if (lines.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitOrder(customer, lines);
      onSuccess?.();
      navigate('/order-confirmation');
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error);
      alert("Erreur lors de l'envoi de la commande. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { placeOrder, isSubmitting };
}
