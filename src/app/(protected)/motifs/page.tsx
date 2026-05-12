import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import AppHeader from '@/components/app-header';
import MotifsPageClient from '@/components/motifs/motifs-page-client';

export default async function MotifsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Motifs de consultation"
        subtitle="Référentiel des motifs utilisés lors des consultations"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <MotifsPageClient />
      </main>
    </>
  );
}