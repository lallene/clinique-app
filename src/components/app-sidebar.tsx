'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Stethoscope, Calendar, CreditCard, Building2 } from 'lucide-react';

const navLinks = [
  { title: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Patients', icon: Users, href: '/patients' },
  { title: 'Consultations', icon: Stethoscope, href: '/consultations' },
  { title: 'Rendez-vous', icon: Calendar, href: '/rendezvous' },
  { title: 'Facturation', icon: CreditCard, href: '/factures' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    // Largeur réduite à w-20 (80px) pour libérer de l'espace dans le body
    <aside className="hidden w-20 shrink-0 border-r border-gray-100 bg-white lg:flex lg:flex-col shadow-sm">
      {/* Logo réduit */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100">
        <Link href="/dashboard" aria-label="Accueil" title="Clinique Pro">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md transition-transform hover:scale-105 active:scale-95">
            <Building2 size={24} />
          </div>
        </Link>
      </div>

      {/* Navigation iconique */}
      <div className="flex-1 px-3 py-8">
        <nav className="flex flex-col items-center gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.title}
                href={link.href}
                title={link.title} // Tooltip au survol
                aria-label={link.title}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                {/* Libellé masqué visuellement mais présent pour l'accessibilité */}
                <span className="sr-only">{link.title}</span>

                {/* Petit point indicateur pour l'actif */}
                {isActive && (
                  <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pied de sidebar réduit */}
      <div className="border-t border-gray-100 p-4 flex justify-center">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400"
          title="Clinique Saint Raphaël de Séguiéla"
        >
          <span className="text-[10px] font-black uppercase tracking-tighter">SR</span>
        </div>
      </div>
    </aside>
  );
}
