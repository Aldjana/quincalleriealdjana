import { Mail, MailOpen, Phone, Trash2, Inbox } from 'lucide-react';
import type { ContactMessage } from '../../config/api';
import { formatDate } from '../../utils/format';

interface AdminMessagesProps {
  messages: ContactMessage[];
  unavailable: boolean;
  onMarkRead: (id: string, read: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AdminMessages = ({ messages, unavailable, onMarkRead, onDelete }: AdminMessagesProps) => {
  if (unavailable) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-200">
        Les messages sont stockés dans MongoDB, qui est actuellement injoignable.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-slate-500">
        <Inbox className="mb-3 h-10 w-10 text-slate-700" />
        Aucun message pour le moment
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li
          key={m._id}
          className={`rounded-2xl border p-5 ${m.read ? 'border-slate-800 bg-slate-900/40' : 'border-orange-500/40 bg-slate-900/80'}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {!m.read && <span className="h-2 w-2 rounded-full bg-orange-400" aria-label="Non lu" />}
                <p className="font-semibold text-white">{m.name}</p>
                {m.subject && <span className="text-sm text-slate-400">— {m.subject}</span>}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{formatDate(m.createdAt)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onMarkRead(m._id, !m.read)}
                title={m.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                aria-label={m.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => window.confirm('Supprimer ce message ?') && onDelete(m._id)}
                aria-label="Supprimer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">{m.message}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-700">
              <Phone className="h-3.5 w-3.5" />
              {m.phone}
            </a>
            {m.email && (
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-700">
                <Mail className="h-3.5 w-3.5" />
                {m.email}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
