// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { createSlide, deleteSlide } from '@/actions/admin-slides';
// import { Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
// import { supabase } from '@/lib/supabase';
// import { toast } from 'sonner';

// export default function SlideManager({
//   initialSlides,
// }: {
//   initialSlides: any[];
// }) {
//   const [slides, setSlides] = useState(initialSlides);

//   // Form States
//   const [uploading, setUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // 1. Handle Image Upload to Supabase
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.[0]) return;

//     setUploading(true);
//     const file = e.target.files[0];
//     const fileName = `banner-${Date.now()}`;

//     const { error } = await supabase.storage
//       .from('phone-images')
//       .upload(fileName, file);

//     if (error) {
//       toast.error('Upload failed');
//     } else {
//       const { data } = supabase.storage
//         .from('phone-images')
//         .getPublicUrl(fileName);
//       setImageUrl(data.publicUrl);
//     }
//     setUploading(false);
//   };

//   const [btnColor, setBtnColor] = useState('#2563EB');

//   // 2. Handle Create Slide
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!imageUrl) {
//       toast.error('Please upload a banner image first.');
//       return;
//     }

//     setIsSubmitting(true);
//     const formData = new FormData(e.currentTarget);
//     formData.set('imageUrl', imageUrl); // Append the Supabase URL
//     formData.set('color', btnColor);

//     const result = await createSlide(formData);

//     if (result.error) {
//       toast.error(result.error);
//     } else {
//       toast.success('Banner added to homepage!');
//       // Refresh page or update local state manually to show new item immediately
//       window.location.reload();
//     }
//     setIsSubmitting(false);
//   };

//   // 3. Handle Delete Slide
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to remove this banner?')) return;

//     // Optimistic Update (Remove from UI immediately)
//     setSlides((prev) => prev.filter((s) => s.id !== id));

//     const result = await deleteSlide(id);
//     if (result.error) {
//       toast.error(result.error);
//       // Revert state if failed (optional, but good practice)
//     } else {
//       toast.success('Banner deleted.');
//     }
//   };

//   return (
//     <div className='space-y-8'>
//       {/* CREATE FORM */}
//       <div className='bg-white p-6 rounded-lg border shadow-sm'>
//         <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
//           <Plus className='bg-blue-100 text-blue-600 p-1 rounded-full w-6 h-6' />{' '}
//           Add New Homepage Banner
//         </h3>

//         <form onSubmit={handleSubmit} className='space-y-4'>
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <div className='space-y-2'>
//               <Label>Title (Big Text)</Label>
//               <Input
//                 name='title'
//                 placeholder='e.g. Easter Promo Sale'
//                 required
//               />
//             </div>
//             <div className='space-y-2'>
//               <Label>Subtitle (Small Text)</Label>
//               <Input name='subtitle' placeholder='e.g. Up to 20% off iPhones' />
//             </div>
//           </div>

//           {/* <div className='space-y-2'>
//             <Label>Link URL (Optional)</Label>
//             <Input name='link' placeholder='e.g. /shop/123 or /?q=samsung' />
//           </div> */}
//           <div className='grid grid-cols-2 gap-4'>
//             <div className='space-y-2'>
//               <Label>Link URL (Optional)</Label>
//               <Input name='link' placeholder='e.g. /shop/123 or /?q=samsung' />
//             </div>

//             {/* NEW: Color Picker */}
//             <div className='space-y-2'>
//               <Label>Button Color</Label>
//               <div className='flex items-center gap-2'>
//                 <div
//                   className='w-10 h-10 rounded border shadow-sm'
//                   style={{ backgroundColor: btnColor }}
//                 />
//                 <Input
//                   type='color'
//                   value={btnColor}
//                   onChange={(e) => setBtnColor(e.target.value)}
//                   className='w-20 p-1 h-10 cursor-pointer'
//                 />
//                 <span className='text-xs text-gray-500'>{btnColor}</span>
//               </div>
//             </div>
//           </div>

//           {/* Image Upload Area */}
//           <div className='space-y-2'>
//             <Label>Banner Image (Required)</Label>

//             <label className='border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative h-40 overflow-hidden group'>
//               {/* The Actual Input (Hidden but linked via label) */}
//               <Input
//                 type='file'
//                 className='hidden'
//                 accept='image/*'
//                 onChange={handleImageUpload}
//                 disabled={uploading}
//               />

//               {imageUrl ? (
//                 <>
//                   <img
//                     src={imageUrl}
//                     className='absolute inset-0 w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-60 transition-opacity'
//                   />
//                   <div className='absolute inset-0 flex items-center justify-center'>
//                     <span className='bg-black/50 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm'>
//                       Click to Change
//                     </span>
//                   </div>
//                 </>
//               ) : (
//                 <div className='text-center text-gray-400'>
//                   {uploading ? (
//                     <Loader2 className='animate-spin mx-auto w-8 h-8 text-blue-600' />
//                   ) : (
//                     <ImageIcon className='mx-auto mb-2 w-8 h-8 text-gray-300' />
//                   )}
//                   <span className='text-sm font-medium text-gray-600 block'>
//                     Click to upload banner
//                   </span>
//                   <span className='text-xs text-gray-400'>
//                     Recommended: 1200x400 px
//                   </span>
//                 </div>
//               )}
//             </label>
//           </div>

//           <Button
//             type='submit'
//             disabled={isSubmitting || uploading}
//             className='w-full bg-blue-600 hover:bg-blue-700'
//           >
//             {isSubmitting ? (
//               <Loader2 className='animate-spin mr-2' />
//             ) : (
//               'Publish Banner'
//             )}
//           </Button>
//         </form>
//       </div>

//       {/* LIST OF ACTIVE SLIDES */}
//       <div className='space-y-3'>
//         <h3 className='font-semibold text-gray-700'>Active Banners</h3>
//         {slides.length === 0 ? (
//           <p className='text-gray-400 text-sm'>No manual banners active.</p>
//         ) : (
//           slides.map((slide) => (
//             <div
//               key={slide.id}
//               className='flex items-center gap-4 bg-white p-3 border rounded-lg shadow-sm group'
//             >
//               <div className='h-16 w-32 bg-gray-100 rounded overflow-hidden flex-shrink-0'>
//                 <img src={slide.image} className='w-full h-full object-cover' />
//               </div>
//               <div className='flex-1 min-w-0'>
//                 <p className='font-bold text-gray-900 truncate'>
//                   {slide.title}
//                 </p>
//                 <p className='text-xs text-gray-500 truncate'>
//                   {slide.subtitle || 'No subtitle'}
//                 </p>
//               </div>
//               <Button
//                 variant='ghost'
//                 size='icon'
//                 className='text-gray-400 hover:text-red-600 hover:bg-red-50'
//                 onClick={() => handleDelete(slide.id)}
//               >
//                 <Trash2 size={18} />
//               </Button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSlide, deleteSlide } from '@/actions/admin-slides';
import { Trash2, Plus, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export default function SlideManager({
  initialSlides,
}: {
  initialSlides: any[];
}) {
  const [slides, setSlides] = useState(initialSlides);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [btnColor, setBtnColor] = useState('#2563EB');

  const COLORS = [
    { hex: '#2563EB', name: 'Blue' },
    { hex: '#000000', name: 'Black' },
    { hex: '#DC2626', name: 'Red' },
    { hex: '#16A34A', name: 'Green' },
    { hex: '#9333EA', name: 'Purple' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `banner-${Date.now()}`;
    const { error } = await supabase.storage
      .from('phone-images')
      .upload(fileName, file);

    if (error) {
      toast.error('Upload failed');
    } else {
      const { data } = supabase.storage
        .from('phone-images')
        .getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Please upload a banner image first.');
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set('imageUrl', imageUrl);
    formData.set('color', btnColor);

    const result = await createSlide(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success('Banner published!');
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));
    await deleteSlide(id);
    toast.success('Banner deleted.');
  };

  return (
    <div className='space-y-10'>
      {/* CREATE FORM CARD */}
      <div className='bg-white p-8 rounded-xl border border-gray-200 shadow-sm'>
        <h3 className='font-bold text-xl mb-6 flex items-center gap-2 text-gray-900'>
          <div className='bg-blue-100 p-2 rounded-full text-blue-600'>
            <Plus size={20} />
          </div>
          Create Homepage Banner
        </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Inputs Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Headline Title</Label>
                <Input
                  name='title'
                  placeholder='e.g. Big Summer Sale'
                  required
                  className='h-11'
                />
              </div>
              <div className='space-y-2'>
                <Label>Subtitle (Optional)</Label>
                <Input
                  name='subtitle'
                  placeholder='e.g. 50% Off all iPhones'
                  className='h-11'
                />
              </div>
              <div className='space-y-2'>
                <Label>Button Link</Label>
                <Input
                  name='link'
                  placeholder='e.g. /shop/best-phones'
                  className='h-11'
                />
              </div>

              {/* Color Picker */}
              <div className='space-y-3 pt-2'>
                <Label>Button Color</Label>
                <div className='flex flex-wrap gap-3 items-center'>
                  {COLORS.map((c) => (
                    <button
                      type='button'
                      key={c.hex}
                      onClick={() => setBtnColor(c.hex)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        btnColor === c.hex
                          ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {btnColor === c.hex && (
                        <Check
                          size={14}
                          className='text-white'
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  ))}
                  <div className='relative w-8 h-8 rounded-full border-2 overflow-hidden cursor-pointer group'>
                    <input
                      type='color'
                      value={btnColor}
                      onChange={(e) => setBtnColor(e.target.value)}
                      className='absolute -top-2 -left-2 w-16 h-16 opacity-0 cursor-pointer'
                    />
                    <div className='w-full h-full flex items-center justify-center bg-gray-50 text-xs font-bold text-gray-400 group-hover:bg-gray-100'>
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload - Large Box */}
            <div className='space-y-2'>
              <Label>Banner Image (1200x400)</Label>
              <label className='border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer h-64 relative overflow-hidden group'>
                <Input
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={uploading}
                />

                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      className='w-full h-full object-cover transition-opacity group-hover:opacity-75'
                    />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      <span className='bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm'>
                        Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className='text-center space-y-2'>
                    {uploading ? (
                      <Loader2 className='w-10 h-10 text-blue-600 animate-spin mx-auto' />
                    ) : (
                      <div className='bg-white p-4 rounded-full shadow-sm mx-auto w-fit mb-2'>
                        <ImageIcon className='w-8 h-8 text-gray-400' />
                      </div>
                    )}
                    <p className='text-sm font-medium text-gray-600'>
                      Click to upload image
                    </p>
                    <p className='text-xs text-gray-400'>JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Button
            type='submit'
            disabled={isSubmitting || uploading}
            className='w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-md'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin mr-2' />
            ) : (
              'Publish Banner'
            )}
          </Button>
        </form>
      </div>

      {/* ACTIVE BANNERS GRID */}
      <div>
        <h3 className='font-bold text-xl mb-4 text-gray-800'>
          Active Campaigns
        </h3>

        {slides.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 rounded-xl border border-dashed'>
            <p className='text-gray-500'>
              No active banners. The homepage is using defaults.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {slides.map((slide) => (
              <Card
                key={slide.id}
                className='overflow-hidden group hover:shadow-lg transition-shadow relative border-gray-200'
              >
                {/* Full Image Preview */}
                <div className='h-40 w-full bg-gray-100 relative'>
                  <img
                    src={slide.image}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white'>
                    <h4 className='font-bold text-lg leading-tight'>
                      {slide.title}
                    </h4>
                    <p className='text-sm opacity-90 truncate'>
                      {slide.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <CardContent className='p-3 bg-gray-50 flex justify-between items-center'>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <span
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: slide.color || '#000' }}
                    />
                    Button Color
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 px-2'
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 size={16} className='mr-1.5' /> Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
