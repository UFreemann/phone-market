import prisma from '@/lib/db';
import { getSiteSettings } from '@/actions/admin-settings';
import PlanManager from '@/components/admin/PlanManager';

export default async function AdminPlansPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { price: 'asc' },
  });
  const settings = await getSiteSettings();

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Subscription Plans</h1>
      <PlanManager plans={plans} gridCols={settings.planGridCols} />
    </div>
  );
}
