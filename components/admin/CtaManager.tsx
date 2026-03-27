// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { updateSiteSettings } from '@/actions/admin-settings';
// import { toast } from 'sonner';
// import { Loader2, Megaphone } from 'lucide-react';
// import { useFormStatus } from 'react-dom';

// export default function CtaManager({
//   initialSettings,
// }: {
//   initialSettings: any;
// }) {
//   const [showSecondary, setShowSecondary] = useState(
//     initialSettings.showSecondaryBtn,
//   );

//   function SubmitButton() {
//     const { pending } = useFormStatus(); // Automatically true during submission

//     return (
//       <Button
//         type='submit'
//         disabled={pending}
//         className='w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-md'
//       >
//         {pending ? (
//           <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...
//           </>
//         ) : (
//           'Save Settings'
//         )}
//       </Button>
//     );
//   }

//   const handleSubmit = async (formData: FormData) => {
//     // CRITICAL FIX: Explicitly overwrite whatever the form thought it had
//     if (showSecondary) {
//       formData.set('showSecondaryBtn', 'on');
//     } else {
//       // If false, we MUST send "off" because the switch input might not exist in the DOM
//       formData.set('showSecondaryBtn', 'off');
//     }

//     const res = await updateSiteSettings(formData);
//     if (res.success) {
//       toast.success('Homepage CTA updated successfully!');
//     } else {
//       toast.error('Failed to update settings');
//     }
//   };

//   return (
//     <form
//       action={handleSubmit}
//       className='bg-white p-6 rounded-lg border shadow-sm space-y-8'
//     >
//       <div className='flex items-center gap-2 border-b pb-4'>
//         <div className='bg-blue-100 p-2 rounded-full'>
//           <Megaphone className='h-5 w-5 text-blue-600' />
//         </div>
//         <div>
//           <h3 className='font-bold text-lg'>Homepage CTA Banner</h3>
//           <p className='text-sm text-gray-500'>
//             Customize the marketing strip on the homepage.
//           </p>
//         </div>
//       </div>

//       {/* TEXT CONTENT */}
//       <div className='space-y-4'>
//         <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
//           Text Content
//         </h4>
//         <div className='grid gap-4'>
//           <div>
//             <Label>Title (Big Headline)</Label>
//             <Input
//               name='ctaTitle'
//               defaultValue={initialSettings.ctaTitle}
//               placeholder='e.g. Are you a Phone Dealer?'
//             />
//           </div>
//           <div>
//             <Label>Subtitle (Description)</Label>
//             <Input
//               name='ctaSubtitle'
//               defaultValue={initialSettings.ctaSubtitle}
//               placeholder='e.g. Join thousands of sellers today.'
//             />
//           </div>

//           <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-dashed'>
//             <div className='md:col-span-2'>
//               <Label>Highlight Text (The Yellow Part)</Label>
//               <Input
//                 name='ctaHighlightText'
//                 defaultValue={initialSettings.ctaHighlightText}
//                 placeholder='e.g. Start your 7-Day Free Trial now.'
//               />
//             </div>
//             <div>
//               <Label>Highlight Color</Label>
//               <div className='flex gap-2'>
//                 <Input
//                   type='color'
//                   name='ctaHighlightColor'
//                   defaultValue={initialSettings.ctaHighlightColor}
//                   className='w-12 p-1 cursor-pointer h-10'
//                 />
//                 <Input
//                   name='ctaHighlightColor'
//                   defaultValue={initialSettings.ctaHighlightColor}
//                   className='uppercase'
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* GRADIENT COLORS */}
//       <div className='space-y-4 border-t pt-4'>
//         <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
//           Background Gradient
//         </h4>
//         <div className='grid grid-cols-2 gap-6'>
//           <div>
//             <Label>Gradient From (Left)</Label>
//             <div className='flex gap-2 mt-1'>
//               <Input
//                 type='color'
//                 name='ctaGradientFrom'
//                 defaultValue={initialSettings.ctaGradientFrom}
//                 className='w-12 p-1 cursor-pointer h-10'
//               />
//               <Input
//                 name='ctaGradientFrom'
//                 defaultValue={initialSettings.ctaGradientFrom}
//                 className='uppercase'
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Gradient To (Right)</Label>
//             <div className='flex gap-2 mt-1'>
//               <Input
//                 type='color'
//                 name='ctaGradientTo'
//                 defaultValue={initialSettings.ctaGradientTo}
//                 className='w-12 p-1 cursor-pointer h-10'
//               />
//               <Input
//                 name='ctaGradientTo'
//                 defaultValue={initialSettings.ctaGradientTo}
//                 className='uppercase'
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* BUTTONS */}
//       <div className='space-y-4 border-t pt-4'>
//         <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
//           Action Buttons
//         </h4>

//         {/* Primary Button */}
//         <div className='grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-md border'>
//           <div className='col-span-2 text-xs font-bold text-blue-700 uppercase'>
//             Primary Button
//           </div>
//           <div className='space-y-2'>
//             <Label>Label</Label>
//             <Input
//               name='btnPrimaryLabel'
//               defaultValue={initialSettings.btnPrimaryLabel}
//             />
//           </div>
//           <div className='space-y-2'>
//             <Label>Link URL</Label>
//             <Input
//               name='btnPrimaryLink'
//               defaultValue={initialSettings.btnPrimaryLink}
//             />
//           </div>
//         </div>

//         {/* Secondary Button */}
//         <div className='border p-4 rounded-md space-y-4'>
//           <div className='flex items-center justify-between'>
//             <div className='text-xs font-bold text-gray-700 uppercase'>
//               Secondary Button
//             </div>
//             <div className='flex items-center gap-2'>
//               <Label
//                 htmlFor='show-sec'
//                 className='text-xs text-gray-500 cursor-pointer'
//               >
//                 Enable?
//               </Label>
//               <Switch
//                 id='show-sec'
//                 name='showSecondaryBtn'
//                 checked={showSecondary}
//                 onCheckedChange={setShowSecondary}
//               />
//             </div>
//           </div>

//           {showSecondary && (
//             <div className='grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2'>
//               <div className='space-y-2'>
//                 <Label>Label</Label>
//                 <Input
//                   name='btnSecondaryLabel'
//                   defaultValue={initialSettings.btnSecondaryLabel}
//                 />
//               </div>
//               <div className='space-y-2'>
//                 <Label>Link URL</Label>
//                 <Input
//                   name='btnSecondaryLink'
//                   defaultValue={initialSettings.btnSecondaryLink}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className='pt-4 sticky bottom-0 bg-white border-t -mx-6 -mb-6 p-6 rounded-b-lg'>
//         <SubmitButton />
//       </div>
//     </form>
//   );
// }

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateSiteSettings } from '@/actions/admin-settings';
import { toast } from 'sonner';
import {
  Loader2,
  Megaphone,
  Palette,
  MousePointerClick,
  Type,
  Camera,
  Trash2,
} from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function CtaManager({
  initialSettings,
}: {
  initialSettings: any;
}) {
  const [showSecondary, setShowSecondary] = useState(
    initialSettings.showSecondaryBtn,
  );

  // Local state for color previews
  const [gradientFrom, setGradientFrom] = useState(
    initialSettings.ctaGradientFrom,
  );
  const [gradientTo, setGradientTo] = useState(initialSettings.ctaGradientTo);

  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adPreview, setAdPreview] = useState(
    initialSettings.sidebarAdImage || '',
  );
  const [isUploadingAd, setIsUploadingAd] = useState(false);
  const [removeAdFlag, setRemoveAdFlag] = useState(false);

  const handleRemoveAd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdImageFile(null);
    setAdPreview('');
    setRemoveAdFlag(true); // Tell server to delete it
  };

  const handleAdImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAdImageFile(file);
      setAdPreview(URL.createObjectURL(file));
    }
  };

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type='submit'
        disabled={pending}
        className='w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-md font-bold transition-transform active:scale-[0.98]'
      >
        {pending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    // setIsSaving(true);
    if (showSecondary) formData.set('showSecondaryBtn', 'on');
    else formData.set('showSecondaryBtn', 'off');

    // 1. Upload Sidebar Ad Image to Supabase
    if (adImageFile) {
      setIsUploadingAd(true);
      const fileName = `sidebar-ad-${Date.now()}`;
      const { error } = await supabase.storage
        .from('phone-images')
        .upload(fileName, adImageFile);

      if (!error) {
        const { data } = supabase.storage
          .from('phone-images')
          .getPublicUrl(fileName);
        formData.set('sidebarAdImage', data.publicUrl);
      } else {
        toast.error('Failed to upload ad image');
      }
      setIsUploadingAd(false);
    }

    // const res = await updateSiteSettings(formData);
    // if (res.success) toast.success('Homepage CTA updated!');
    // else toast.error('Failed to update settings');
    // 2. Save Settings
    const res = await updateSiteSettings(formData);
    if (res.success) toast.success('Settings updated successfully!');
    else toast.error('Failed to update settings');

    // setIsSaving(false);
  };

  return (
    <form action={handleSubmit} className='space-y-8 pb-24'>
      {/* HEADER */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-sm'>
          <Megaphone size={24} />
        </div>
        <div>
          <h2 className='text-xl font-bold text-gray-900'>
            Homepage Call-to-Action
          </h2>
          <p className='text-sm text-gray-500'>
            Configure the main marketing banner on the homepage.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* LEFT COL: CONTENT */}
        <div className='space-y-8'>
          {/* 1. TEXT CONTENT */}
          <Card>
            <CardHeader className='pb-4 border-b bg-gray-50/50'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2'>
                <Type size={16} /> Text Content
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 pt-6'>
              <div className='space-y-2'>
                <Label>Headline Title</Label>
                <Input
                  name='ctaTitle'
                  defaultValue={initialSettings.ctaTitle}
                  placeholder='Are you a Phone Dealer?'
                  className='font-semibold text-lg'
                />
              </div>
              <div className='space-y-2'>
                <Label>Subtitle</Label>
                <Input
                  name='ctaSubtitle'
                  defaultValue={initialSettings.ctaSubtitle}
                  placeholder='Join thousands of sellers today.'
                />
              </div>

              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4'>
                <div className='space-y-2'>
                  <Label className='text-yellow-800'>
                    Highlight Text (Optional)
                  </Label>
                  <Input
                    name='ctaHighlightText'
                    defaultValue={initialSettings.ctaHighlightText}
                    placeholder='Start your 7-Day Free Trial'
                    className='border-yellow-300 focus-visible:ring-yellow-400'
                  />
                </div>
                <div className='flex items-center gap-3'>
                  <Label className='text-xs text-yellow-700'>
                    Highlight Color:
                  </Label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      name='ctaHighlightColor'
                      defaultValue={initialSettings.ctaHighlightColor}
                      className='h-8 w-8 p-0.5 rounded border bg-white cursor-pointer'
                    />
                    <span className='text-xs font-mono text-gray-500 uppercase'>
                      {initialSettings.ctaHighlightColor}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. VISUALS */}
          <Card>
            <CardHeader className='pb-4 border-b bg-gray-50/50'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2'>
                <Palette size={16} /> Visual Style
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              {/* Live Gradient Preview */}
              <div
                className='h-24 w-full rounded-lg shadow-inner flex items-center justify-center text-white font-bold text-sm border'
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                }}
              >
                Live Preview
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label>Gradient Start (Left)</Label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      name='ctaGradientFrom'
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className='h-10 w-10 p-1 rounded border cursor-pointer'
                    />
                    <Input
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className='font-mono uppercase'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Gradient End (Right)</Label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      name='ctaGradientTo'
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className='h-10 w-10 p-1 rounded border cursor-pointer'
                    />
                    <Input
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className='font-mono uppercase'
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL: ACTIONS */}
        <div className='space-y-8'>
          <Card className='h-full'>
            <CardHeader className='pb-4 border-b bg-gray-50/50'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2'>
                <MousePointerClick size={16} /> Action Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              {/* Primary Button */}
              <div className='bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='h-2 w-2 rounded-full bg-blue-600' />
                  <span className='text-sm font-bold text-blue-900'>
                    Primary Button
                  </span>
                </div>
                <div className='space-y-2'>
                  <Label>Label Text</Label>
                  <Input
                    name='btnPrimaryLabel'
                    defaultValue={initialSettings.btnPrimaryLabel}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Link URL</Label>
                  <Input
                    name='btnPrimaryLink'
                    defaultValue={initialSettings.btnPrimaryLink}
                  />
                </div>
              </div>

              {/* Secondary Button */}
              <div
                className={`p-4 rounded-lg border transition-all duration-300 ${showSecondary ? 'bg-gray-50 border-gray-200' : 'bg-white border-dashed'}`}
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`h-2 w-2 rounded-full ${showSecondary ? 'bg-gray-600' : 'bg-gray-300'}`}
                    />
                    <span
                      className={`text-sm font-bold ${showSecondary ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      Secondary Button
                    </span>
                  </div>
                  <Switch
                    checked={showSecondary}
                    onCheckedChange={setShowSecondary}
                  />
                </div>

                {showSecondary && (
                  <div className='space-y-4 animate-in fade-in slide-in-from-top-2'>
                    <div className='space-y-2'>
                      <Label>Label Text</Label>
                      <Input
                        name='btnSecondaryLabel'
                        defaultValue={initialSettings.btnSecondaryLabel}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Link URL</Label>
                      <Input
                        name='btnSecondaryLink'
                        defaultValue={initialSettings.btnSecondaryLink}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- SIDEBAR ADVERTISEMENT --- */}
      <div className='space-y-4 border-t pt-8 mt-8'>
        <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2'>
          <Megaphone size={16} /> Sidebar Advertisement (300x250)
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border'>
          {/* Link Input */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Ad Title</Label>
              <Input
                name='sidebarAdTitle'
                defaultValue={initialSettings.sidebarAdTitle}
                placeholder='e.g. 50% Off Samsung!'
                className='bg-white'
              />
            </div>
            <div className='space-y-2'>
              <Label>Ad Subtitle</Label>
              <Input
                name='sidebarAdSubtitle'
                defaultValue={initialSettings.sidebarAdSubtitle}
                placeholder='e.g. Click here to shop now.'
                className='bg-white'
              />
            </div>
            <div className='space-y-2'>
              <Label>Ad Destination URL</Label>
              <Input
                name='sidebarAdLink'
                defaultValue={initialSettings.sidebarAdLink}
                placeholder='https://...'
                className='bg-white'
              />
              <p className='text-xs text-gray-500'>
                Where users go when they click the ad.
              </p>
            </div>
            {/* Optional: Add a 'Remove Ad' button logic here if needed */}
          </div>

          {/* Image Upload Area */}
          <div className='space-y-2'>
            <Label>Ad Banner Image</Label>
            {/* Hidden input for removal flag */}
            <input
              type='hidden'
              name='removeSidebarAd'
              value={String(removeAdFlag)}
            />
            <label className='border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center bg-white hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden group shadow-sm'>
              <Input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={(e) => {
                  handleAdImageChange(e);
                  setRemoveAdFlag(false);
                }}
                disabled={isUploadingAd}
              />

              {adPreview ? (
                <>
                  <img
                    src={adPreview}
                    className='w-full h-full object-cover transition-opacity group-hover:opacity-60'
                  />
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <span className='bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-2'>
                      <Camera size={14} /> Change Ad
                    </span>

                    {/* Remove Button */}
                    <button
                      type='button'
                      onClick={handleRemoveAd}
                      className='bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-md transition-transform hover:scale-110 z-20 mx-1'
                      title='Remove Ad'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <div className='text-center text-gray-400 p-4'>
                  {isUploadingAd ? (
                    <Loader2 className='w-8 h-8 text-blue-600 animate-spin mx-auto' />
                  ) : (
                    <div className='bg-gray-100 p-3 rounded-full mx-auto w-fit mb-2'>
                      <UploadCloud className='w-6 h-6 text-gray-500' />
                    </div>
                  )}
                  <span className='text-sm font-medium text-gray-600 block'>
                    Upload Ad Banner
                  </span>
                  <span className='text-xs text-gray-400 mt-1'>
                    PNG, JPG (Vertical 300x250)
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-40 md:pl-64 flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'>
        <div className='w-full max-w-sm'>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
