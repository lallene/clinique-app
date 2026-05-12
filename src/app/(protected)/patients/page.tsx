import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/app-header';
import PatientsPageClient from '@/components/patients/patients-page-client';

export default async function PatientsPage() {
  const session = await auth();

  // 🔒 Sécurité : redirection si non connecté
  if (!session || !session.user) {
    redirect('/login');
  }

  // 🧠 Données utilisateur sécurisées
  const currentUser = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    role: session.user.role ?? 'USER',
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <AppHeader
        title="Patients"
        subtitle="Gestion des dossiers patients, assurances et prises en charge"
        userName={currentUser.name}
        userEmail={currentUser.email}
        userRole={currentUser.role}
      />

      {/* Contenu */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <PatientsPageClient currentUser={currentUser} />
      </main>
    </div>
  );
}