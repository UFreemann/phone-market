import { getSiteSettings } from '@/actions/admin-settings';
import LayoutManager from '@/components/admin/LayoutManager';

export default async function AdminLayoutManagerPage() {
  const settings = await getSiteSettings();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Homepage Layout</h1>
        <p className='text-gray-500'>
          Drag and drop sections to rearrange the public homepage.
        </p>
      </div>

      {/* Render the DnD Component */}
      <LayoutManager currentOrder={settings.homepageLayout} />
    </div>
  );
}
