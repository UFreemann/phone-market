import { getAdminAnalytics } from '@/actions/admin-analytics';
import AdminCharts from '@/components/admin/AdminCharts';

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics();
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Platform Growth</h1>
      <AdminCharts data={data} />
    </div>
  );
}
