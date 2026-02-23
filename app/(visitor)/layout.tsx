import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import VisitorShell from '@/components/visitor/VisitorShell';

export default async function VisitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  // If Dealer tries to access visitor dashboard, maybe redirect them to dealer dashboard?
  // Or allow them to see both. For now, allow both.

  return (
    <VisitorShell userName={session.user.name || 'User'}>
      {children}
    </VisitorShell>
  );
}
