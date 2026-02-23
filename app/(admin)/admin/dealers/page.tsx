import { getAdminDealers } from '@/actions/admin-dealers';
import DealerManager from '@/components/admin/DealerManager';

export default async function AdminDealersPage() {
  const dealers = await getAdminDealers();
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Manage Dealers</h1>
        <span className='text-sm text-gray-500'>{dealers.length} total</span>
      </div>
      <DealerManager initialDealers={dealers} />
    </div>
  );
}
