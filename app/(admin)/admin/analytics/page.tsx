import { getAdminAnalytics } from '@/actions/admin-analytics';
import AdminCharts from '@/components/admin/AdminCharts';
import AnalyticsFilter from '@/components/dealer/AnalyticsFilter';
import { subDays, differenceInDays } from 'date-fns';

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const startDate = params.from
    ? new Date(params.from)
    : subDays(new Date(), 30);
  const endDate = params.to ? new Date(params.to) : new Date();

  const data = await getAdminAnalytics(startDate, endDate);

  const daysDiff = differenceInDays(endDate, startDate);
  let periodLabel = `Last ${daysDiff} Days`;

  if (daysDiff === 0) periodLabel = 'Today';
  if (daysDiff === 1) periodLabel = 'Yesterday';
  if (daysDiff === 7) periodLabel = 'Last 7 Days';
  if (daysDiff === 30) periodLabel = 'Last 1 Month';
  if (daysDiff === 90) periodLabel = 'Last 3 Months';

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-end gap-4'>
        <h1 className='text-2xl font-bold'>Platform Growth</h1>

        {/* REUSE THE FILTER */}
        <AnalyticsFilter startDate={startDate} endDate={endDate} />
      </div>
      <AdminCharts data={data} periodLabel={periodLabel} />
    </div>
  );
}
