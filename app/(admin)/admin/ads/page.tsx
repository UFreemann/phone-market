import { getAdminProducts } from '@/actions/admin-ads';
import AdManager from '@/components/admin/AdManager';

export default async function AdminAdsPage() {
  const products = await getAdminProducts();
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Ad Manager</h1>
      <AdManager initialProducts={products} />
    </div>
  );
}
