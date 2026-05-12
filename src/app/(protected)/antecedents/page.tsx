import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import AppHeader from '@/components/app-header';
import AntecedentsPageClient from '@/components/antecedents/antecedents-page-client';

export default async function AntecedentsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Antécédents médicaux"
        subtitle="Référentiel des antécédents utilisés lors des consultations"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <AntecedentsPageClient />
      </main>
    </>
  );
}