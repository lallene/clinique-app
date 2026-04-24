import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/app-header';
import PatientsPageClient from '@/components/patients/patients-page-client';

export default async function PatientsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Patients"
        subtitle="Gestion des dossiers patients"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <PatientsPageClient />
      </main>
    </>
  );
}
