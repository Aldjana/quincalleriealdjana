import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Loader2, ShoppingBag, X } from 'lucide-react';
import type { CustomerInfo } from '../../services/orders';

interface OrderFormModalProps {
  title: string;
  summary?: ReactNode;
  isSubmitting: boolean;
  onSubmit: (customer: CustomerInfo) => void;
  onClose: () => void;
}

const EMPTY_CUSTOMER: CustomerInfo = { customerName: '', customerPhone: '', customerAddress: '' };

export const OrderFormModal = ({ title, summary, isSubmitting, onSubmit, onClose }: OrderFormModalProps) => {
  const [formData, setFormData] = useState<CustomerInfo>(EMPTY_CUSTOMER);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
    >
      <div className="relative z-[10000] max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-lg font-bold leading-snug text-[#0a2463] sm:text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fermer"
            className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Nom complet *"
            className="w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm"
          />
          <input
            name="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+ ().-]{7,20}"
            title="Numéro de téléphone valide"
            placeholder="Téléphone *"
            className="w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm"
          />
          <input
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            required
            autoComplete="street-address"
            placeholder="Adresse de livraison *"
            className="w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm"
          />
          {summary}
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Confirmer la commande</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-xl border py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
