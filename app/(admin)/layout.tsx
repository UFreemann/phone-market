import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') redirect('/');

  return <AdminShell>{children}</AdminShell>;
}
