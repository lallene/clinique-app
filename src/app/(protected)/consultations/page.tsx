import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/app-header';

export default async function ConsultationsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader
        title="Consultations"
        subtitle="Suivi des consultations médicales"
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-bold text-gray-900">Page Consultations</h2>
          <p className="mt-2 text-gray-500">
            Cette section accueillera les consultations et leur historique.
          </p>
        </div>
      </main>
    </>
  );
}
