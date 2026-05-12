import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import AppHeader from '@/components/app-header';
import PharmaciePageClient from '@/components/pharmacie/pharmacie-page-client';

export default async function PharmaciePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Pharmacie"
        subtitle="Gestion des produits, stocks et mouvements pharmacie"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <PharmaciePageClient />
      </main>
    </>
  );
}