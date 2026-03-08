import { auth } from '@/auth';
import VisitorSettingsForm from '@/components/visitor/VisitorSettingsForm';
import { redirect } from 'next/navigation';

export default async function VisitorSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className='max-w-2xl mx-auto py-10'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>
        Account Settings
      </h1>
      <VisitorSettingsForm />
    </div>
  );
}
