import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import AppHeader from '@/components/app-header';
import ActesPageClient from '@/components/actes/actes-page-client';

export default async function ActesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Actes Médicaux"
        subtitle="Gestion des prestations et tarifs médicaux"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <ActesPageClient />
      </main>
    </>
  );
}
