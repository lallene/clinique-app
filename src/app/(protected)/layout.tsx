import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen w-full bg-gray-50/60">
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex min-w-0 flex-1 flex-col w-full">{children}</main>
      </div>
    </div>
  );
}
