import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/app-header';
import AssurancesPageClient from '@/components/assurances/assurances-page-client';

export default async function AssurancesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const currentUser = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    role: session.user.role ?? 'USER',
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader
        title="Assurances"
        subtitle="Gestion des compagnies, garants, conventions et prises en charge"
        userName={currentUser.name}
        userEmail={currentUser.email}
        userRole={currentUser.role}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <AssurancesPageClient currentUser={currentUser} />
      </main>
    </div>
  );
}