import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  const profile = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) return <div>Error: Profile not found</div>;

  return <SettingsClient initialProfile={profile} />;
}
