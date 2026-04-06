"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: login,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Identifiants invalides");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      {/* Conteneur principal avec largeur max contrôlée */}
      <div className="w-full max-w-[450px] overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-indigo-100 border border-slate-100">
        
        {/* Header Header */}
        <div className="bg-indigo-600 p-10 text-center text-white">
          <h1 className="text-3xl font-bold tracking-tight">Clinique</h1>
          <p className="mt-1 text-indigo-100/80 text-sm font-medium">Portail Praticien & Staff</p>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Identifiant */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Identifiant
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder=""
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                <AlertCircle size={18} className="shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center rounded-2xl bg-indigo-600 py-4 text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="font-bold">Se connecter</span>
              )}
            </button>
          </form>

          {/* Zone de test plus discrète */}
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Accès Démo</p>
            <div className="flex flex-col gap-1 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Login:</span>
                <span className="font-mono text-indigo-600">admin@clinique.fr</span>
              </div>
              <div className="flex justify-between">
                <span>Pass:</span>
                <span className="font-mono text-indigo-600">Password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}