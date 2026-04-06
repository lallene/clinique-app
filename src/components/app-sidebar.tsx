"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  CreditCard,
  Building2,
} from "lucide-react";

const navLinks = [
  { title: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Patients", icon: Users, href: "/patients" },
  { title: "Consultations", icon: Stethoscope, href: "/consultations" },
  { title: "Rendez-vous", icon: Calendar, href: "/rendezvous" },
  { title: "Facturation", icon: CreditCard, href: "/factures" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              Clinique<span className="text-indigo-600">.pro</span>
            </p>
            <p className="text-xs text-gray-400">Gestion médicale</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Navigation
        </p>

        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.title}
                href={link.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <link.icon size={19} />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Espace sécurisé</p>
          <p className="mt-1 text-xs text-gray-500">
            Plateforme de gestion clinique interne.
          </p>
        </div>
      </div>
    </aside>
  );
}