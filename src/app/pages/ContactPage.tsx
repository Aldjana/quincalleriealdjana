import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { messagesAPI } from '../../config/api';
import { SHOP, phoneLink, whatsappLink } from '../../config/shop';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';

const EMPTY_FORM = { name: '', phone: '', email: '', subject: '', message: '' };

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/15 sm:text-sm';

export const ContactPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      await messagesAPI.send({ ...form, email: form.email.trim() || undefined });
      setForm(EMPTY_FORM);
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(
        err instanceof Error && err.message
          ? `${err.message} Vous pouvez aussi nous écrire sur WhatsApp.`
          : "Le message n'a pas pu être envoyé. Écrivez-nous sur WhatsApp."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Contact' }]} />
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Contactez-nous</h1>
        <p className="mt-2 text-slate-600">Une question, un devis ? Notre équipe vous répond rapidement.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-navy-900">Nos informations</h2>
          <InfoRow icon={<MapPin className="h-5 w-5" />} title="Adresse">
            {SHOP.address}
          </InfoRow>
          <InfoRow icon={<Phone className="h-5 w-5" />} title="Téléphone">
            <a href={phoneLink()} className="hover:text-brand-600">{SHOP.phoneDisplay}</a>
          </InfoRow>
          <InfoRow icon={<WhatsAppIcon className="h-5 w-5" />} title="WhatsApp">
            <a href={whatsappLink(`Bonjour ${SHOP.name}, `)} target="_blank" rel="noreferrer" className="hover:text-brand-600">
              {SHOP.phoneDisplay}
            </a>
          </InfoRow>
          <InfoRow icon={<Mail className="h-5 w-5" />} title="Email">
            <a href={`mailto:${SHOP.email}`} className="break-all hover:text-brand-600">{SHOP.email}</a>
          </InfoRow>
          <InfoRow icon={<Clock className="h-5 w-5" />} title="Heures d'ouverture">
            {SHOP.hours.map((slot) => (
              <span key={slot.days} className="block">
                {slot.days} : {slot.time}
              </span>
            ))}
          </InfoRow>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-navy-900">Envoyez-nous un message</h2>

          {status === 'sent' ? (
            <div className="mt-6 flex flex-col items-center rounded-xl bg-emerald-50 px-4 py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <p className="mt-3 font-semibold text-slate-900">Message envoyé !</p>
              <p className="mt-1 text-sm text-slate-600">Nous vous recontactons très rapidement.</p>
              <button type="button" onClick={() => setStatus('idle')} className="mt-5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Nom complet *
                <input name="name" value={form.name} onChange={handleChange} required minLength={2} maxLength={100} autoComplete="name" className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Téléphone *
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required inputMode="tel" pattern="[0-9+ ().-]{7,20}" title="Numéro de téléphone valide" autoComplete="tel" className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email <span className="font-normal text-slate-400">(facultatif)</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} maxLength={120} autoComplete="email" className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Sujet
                <input name="subject" value={form.subject} onChange={handleChange} maxLength={150} placeholder="Devis, disponibilité…" className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Message *
                <textarea name="message" value={form.message} onChange={handleChange} required minLength={5} maxLength={2000} rows={5} className={inputClass} />
              </label>

              {error && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">{error}</p>}

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-60"
                >
                  {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Envoyer le message
                </button>
                <a
                  href={whatsappLink(`Bonjour ${SHOP.name}, `)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                  Écrire sur WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <iframe
          title={`Plan d'accès — ${SHOP.name}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full sm:h-96"
        />
      </div>
    </div>
  );
};

function InfoRow({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-brand-500">{icon}</span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-slate-900">{title}</p>
        <div className="text-slate-600">{children}</div>
      </div>
    </div>
  );
}
