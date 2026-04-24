'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: login,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Identifiants invalides');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[450px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-indigo-100 border border-slate-100">
        {/* Header Section */}
        <div className="bg-indigo-600 p-10 text-center text-white">
          <h1 className="text-2xl font-black tracking-tight leading-tight">
            Clinique Saint Raphaél <br /> de Séguiéla
          </h1>
          <p className="mt-2 text-indigo-100/80 text-xs font-bold uppercase tracking-[0.2em]">
            Portail Praticien & Staff
          </p>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email / Identifiant */}
            <div className="space-y-2">
              <label
                htmlFor="email-input"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
              >
                Identifiant (Email)
              </label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  id="email-input"
                  type="email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label
                htmlFor="password-input"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            {/* Error Message with ARIA live region */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 animate-in slide-in-from-top-1"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-2xl bg-indigo-600 py-4.5 text-white transition-all hover:bg-slate-900 active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-indigo-100"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="font-black text-sm uppercase tracking-widest">
                  Accéder au Dossier
                </span>
              )}
            </button>
          </form>

          {/* Accès Démo Style "Carte d'identité" */}
          <div className="mt-10 rounded-[1.5rem] bg-slate-50 border border-slate-100 p-5">
            <h2 className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Session de Test (Achi L.)
            </h2>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-400">User</span>
                <span className="font-mono font-bold text-indigo-600">admin@clinique.fr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400">Pass</span>
                <span className="font-mono font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4">
                  Password
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
