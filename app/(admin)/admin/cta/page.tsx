import { getSiteSettings } from '@/actions/admin-settings';
import CtaManager from '@/components/admin/CtaManager';

export default async function AdminCtaPage() {
  const settings = await getSiteSettings();
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Homepage CTA</h1>
      <CtaManager initialSettings={settings} />
    </div>
  );
}
