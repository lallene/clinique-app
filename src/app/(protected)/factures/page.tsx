import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/app-header';

export default async function FacturesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Facturation"
        subtitle="Gestion des factures et paiements"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-bold text-gray-900">Page Facturation</h2>
          <p className="mt-2 text-gray-500">
            Cette section accueillera la gestion des factures et encaissements.
          </p>
        </div>
      </main>
    </>
  );
}
