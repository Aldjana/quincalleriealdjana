import { useState } from 'react';
import { Lock, Mail, Wrench, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      } else {
        setError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
          <div className="relative px-8 pb-10 pt-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              Espace sécurisé
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">Administration</h1>
            <p className="mt-2 text-sm text-slate-400">Quincaillerie Aldjana</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  placeholder="admin@quincaillerie.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              <ShieldCheck className="h-5 w-5" />
              {loading ? 'Connexion...' : 'Accéder au dashboard'}
            </button>
          </form>

          <div className="border-t border-slate-800 bg-slate-900/80 px-8 py-4 text-center">
            <Link to="/" className="text-sm text-slate-500 transition hover:text-orange-400">
              ← Retour à la boutique
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Accès réservé aux administrateurs — URL : <span className="text-slate-500">/admin</span>
        </p>
      </div>
    </div>
  );
};
