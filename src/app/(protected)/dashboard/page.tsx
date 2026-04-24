import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/app-header';
import {
  Users,
  Stethoscope,
  CreditCard,
  Calendar,
  Clock3,
  Activity,
  FileText,
  Pill,
  ChevronRight,
  UserRound,
  LayoutDashboard,
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const stats = [
    { label: 'Patients', value: '1 284', icon: Users, trend: '+2.5%' },
    { label: 'Consultations', value: '24', icon: Stethoscope, trend: 'Aujourd’hui' },
    { label: 'Rendez-vous', value: '12', icon: Calendar, trend: 'À venir' },
    { label: 'Revenus', value: '1 450 €', icon: CreditCard, trend: '+12%' },
  ];

  const appointments = [
    { time: '08:30', patient: 'Awa Koné', doctor: 'Dr. Kouassi', type: 'Consultation' },
    { time: '09:15', patient: 'Jean Dupont', doctor: 'Dr. Yao', type: 'Contrôle' },
    { time: '10:00', patient: 'Mariam Traoré', doctor: 'Dr. Kouassi', type: 'Suivi' },
    { time: '11:20', patient: 'Paul Martin', doctor: 'Dr. N’Guessan', type: 'Première visite' },
  ];

  const activities = [
    {
      title: 'Nouvelle consultation enregistrée',
      description: 'Patient : Awa Koné · Service : Médecine générale',
      time: 'Il y a 10 min',
      icon: Stethoscope,
    },
    {
      title: 'Paiement validé',
      description: 'Facture N° FAC-2026-00124 · 45 €',
      time: 'Il y a 25 min',
      icon: CreditCard,
    },
    {
      title: 'Nouveau patient ajouté',
      description: 'Dossier créé pour Jean Dupont',
      time: 'Il y a 40 min',
      icon: Users,
    },
    {
      title: 'Prescription pharmacie préparée',
      description: 'Commande interne prête pour hospitalisation',
      time: 'Il y a 1 h',
      icon: Pill,
    },
  ];

  const quickActions = [
    {
      title: 'Nouveau patient',
      description: 'Créer rapidement un dossier patient',
      href: '/patients',
      icon: UserRound,
    },
    {
      title: 'Nouvelle consultation',
      description: 'Enregistrer une consultation médicale',
      href: '/consultations',
      icon: Stethoscope,
    },
    {
      title: 'Planifier un rendez-vous',
      description: 'Ajouter un rendez-vous au planning',
      href: '/rendezvous',
      icon: Calendar,
    },
    {
      title: 'Créer une facture',
      description: 'Générer une nouvelle facture patient',
      href: '/factures',
      icon: FileText,
    },
  ];

  return (
    <>
      <AppHeader
        title="Tableau de bord"
        subtitle="Vue d’ensemble de l’activité Clinique Médicale Saint Raphaél de Séguiéla"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Vue d’ensemble</h2>
            <p className="mt-1 text-gray-500">
              Bienvenue dans votre espace de gestion Clinique Médicale Saint Raphaél de Séguiéla
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/consultations"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700"
            >
              + Nouvelle consultation
            </Link>
            <Link
              href="/patients"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              + Nouveau patient
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-indigo-100 hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-gray-50 p-2.5 text-gray-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                  <stat.icon size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-tight text-gray-500">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Activité récente</h3>
                <p className="text-sm text-gray-500">Dernières actions dans le système</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <Activity size={20} />
              </div>
            </div>

            <div className="space-y-4">
              {activities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
                >
                  <div className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm">
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-400">
                    <Clock3 size={14} />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Prochains rendez-vous</h3>
                <p className="text-sm text-gray-500">Planning du jour</p>
              </div>
              <Calendar className="text-indigo-600" size={20} />
            </div>

            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      {appointment.time}
                    </span>
                    <span className="text-xs font-medium text-gray-400">{appointment.type}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{appointment.patient}</p>
                  <p className="text-sm text-gray-500">{appointment.doctor}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Accès rapides</h3>
              <p className="text-sm text-gray-500">Lancez vos actions principales en un clic</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group rounded-2xl border border-gray-200 bg-gray-50/60 p-5 transition hover:border-indigo-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm">
                      <action.icon size={20} />
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Mon profil</h3>
              <p className="text-sm text-gray-500">Informations de la session active</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                {session.user?.name?.charAt(0) ?? 'U'}
              </div>
              <h4 className="text-lg font-bold text-gray-900">{session.user?.name}</h4>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
              <span className="mt-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
                {session.user?.role}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Statut
                </p>
                <p className="mt-1 font-medium text-gray-900">Connecté et actif</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Accès
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  Tableau de bord Clinique Médicale Saint Raphaél de Séguiéla
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-6 text-center">
                <LayoutDashboard className="mx-auto mb-3 text-gray-300" size={28} />
                <p className="text-sm text-gray-500">
                  Vous pourrez ajouter ici vos indicateurs personnalisés.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
