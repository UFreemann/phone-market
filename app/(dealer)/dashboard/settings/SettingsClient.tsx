/**Before premium look */

// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Card,
//   CardContent,
// } from '@/components/ui/card';
// import { updateSettings } from '@/actions/update-settings';
// import { supabase } from '@/lib/supabase';
// import {
//   Loader2,
//   Camera,
//   Save,
//   Trash2,
//   Image as ImageIcon,
//   Twitter,
//   Facebook,
//   Video,
//   Instagram,
//   Globe,
//   Ghost,
//   Palette,
//   Check,
//   FileBadge,
//   CheckCircle,
// } from 'lucide-react';

// // Props Interface
// type SettingsClientProps = {
//   initialProfile: any; // Ideally use a proper Prisma type here
// };

// export default function SettingsClient({
//   initialProfile,
// }: SettingsClientProps) {
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState({ type: '', text: '' });

//   // Use props for initial state (No Loading State needed!)
//   const profile = initialProfile;

//   // LOGO STATES
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState(profile?.image || '');
//   const [removeImageFlag, setRemoveImageFlag] = useState(false);

//   // COVER STATES
//   const [coverFile, setCoverFile] = useState<File | null>(null);
//   const [coverPreview, setCoverPreview] = useState(profile?.coverImage || '');
//   const [removeCoverFlag, setRemoveCoverFlag] = useState(false);

//   // ID CARD STATES
//   const [idFile, setIdFile] = useState<File | null>(null);
//   const [idPreview, setIdPreview] = useState(profile?.idCardImage || '');
//   const [removeIdFlag, setRemoveIdFlag] = useState(false);

//   const PRESET_COLORS = [
//     { hex: '#2563EB', name: 'Blue' },
//     { hex: '#DC2626', name: 'Red' },
//     { hex: '#16A34A', name: 'Green' },
//     { hex: '#9333EA', name: 'Purple' },
//     { hex: '#EA580C', name: 'Orange' },
//     { hex: '#000000', name: 'Black' },
//   ];

//   const [selectedColor, setSelectedColor] = useState(
//     profile?.brandColor || '#2563EB',
//   );

//   const currentColorName =
//     PRESET_COLORS.find(
//       (c) => c.hex.toLowerCase() === selectedColor.toLowerCase(),
//     )?.name || 'Custom Color';

//   // --- HANDLERS ---
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setRemoveImageFlag(false);
//     }
//   };

//   const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setCoverFile(file);
//       setCoverPreview(URL.createObjectURL(file));
//       setRemoveCoverFlag(false);
//     }
//   };

//   const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setIdFile(file);
//       setIdPreview(URL.createObjectURL(file));
//       setRemoveIdFlag(false); // Reset delete flag if new file selected
//     }
//   };

//   const handleRemoveImage = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setImageFile(null);
//     setPreviewUrl('');
//     setRemoveImageFlag(true);
//   };

//   const handleRemoveCover = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCoverFile(null);
//     setCoverPreview('');
//     setRemoveCoverFlag(true);
//   };

//   const handleRemoveId = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIdFile(null);
//     setIdPreview('');
//     setRemoveIdFlag(true);
//   };

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSaving(true);
//     setMsg({ type: '', text: '' });

//     const formData = new FormData(e.currentTarget);

//     // 1. Upload Logo
//     if (imageFile) {
//       const fileName = `profile-${Date.now()}`;
//       const { error } = await supabase.storage
//         .from('phone-images')
//         .upload(fileName, imageFile);
//       if (!error) {
//         const { data } = supabase.storage
//           .from('phone-images')
//           .getPublicUrl(fileName);
//         formData.set('imageUrl', data.publicUrl);
//       }
//     }

//     // 2. Upload Cover
//     if (coverFile) {
//       const fileName = `cover-${Date.now()}`;
//       const { error } = await supabase.storage
//         .from('phone-images')
//         .upload(fileName, coverFile);
//       if (!error) {
//         const { data } = supabase.storage
//           .from('phone-images')
//           .getPublicUrl(fileName);
//         formData.set('coverImageUrl', data.publicUrl);
//       }
//     }

//     // 3. Upload ID Card (NEW)
//     if (idFile) {
//       const fileName = `idcard-${Date.now()}`;
//       const { error } = await supabase.storage
//         .from('phone-images')
//         .upload(fileName, idFile);
//       if (!error) {
//         const { data } = supabase.storage
//           .from('phone-images')
//           .getPublicUrl(fileName);
//         formData.set('idCardImage', data.publicUrl);
//       }
//     }

//     const result = await updateSettings(formData);

//     if (result.error) {
//       setMsg({ type: 'error', text: result.error });
//     } else {
//       setMsg({ type: 'success', text: result.success! });
//     }
//     setSaving(false);
//   };

//   useEffect(() => {
//     if (msg.text) {
//       const timer = setTimeout(() => setMsg({ type: '', text: '' }), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [msg]);

//   return (
//     <div className='max-w-4xl mx-auto pb-20'>
//       <h1 className='text-2xl font-bold mb-6'>Shop Branding & Settings</h1>

//       <form onSubmit={onSubmit}>
//         <input
//           type='hidden'
//           name='removeImage'
//           value={String(removeImageFlag)}
//         />
//         <input
//           type='hidden'
//           name='removeCover'
//           value={String(removeCoverFlag)}
//         />
//         <input type='hidden' name='removeId' value={String(removeIdFlag)} />{' '}
//         {/* NEW */}
//         {/* --- SECTION 1: COVER PHOTO --- */}
//         <Card className='mb-8 overflow-hidden border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors'>
//           <div className='relative h-48 md:h-64 bg-gray-50 group'>
//             {coverPreview ? (
//               <img
//                 src={coverPreview}
//                 alt='Cover'
//                 className='w-full h-full object-cover'
//               />
//             ) : (
//               <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100'>
//                 <ImageIcon size={48} className='mb-2 opacity-20' />
//                 <span className='text-sm font-medium'>
//                   Upload a Cover Photo
//                 </span>
//                 <span className='text-xs mt-1'>Recommended: 1200 x 300px</span>
//               </div>
//             )}
//             <div className='absolute bottom-4 right-4 flex items-center gap-3 z-20'>
//               <label
//                 htmlFor='cover-upload'
//                 className='cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-50 hover:text-blue-600 shadow-md transition-all hover:scale-105'
//               >
//                 <Camera size={18} />{' '}
//                 {coverPreview ? 'Change Cover' : 'Upload Cover'}
//               </label>
//               {coverPreview && (
//                 <button
//                   type='button'
//                   onClick={handleRemoveCover}
//                   className='bg-white text-red-600 p-2 rounded-full hover:bg-red-50 hover:scale-110 shadow-md transition-all'
//                   title='Remove Cover'
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               )}
//             </div>
//             <Input
//               id='cover-upload'
//               type='file'
//               className='hidden'
//               accept='image/*'
//               onChange={handleCoverChange}
//             />
//           </div>
//         </Card>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
//           {/* --- LEFT COLUMN --- */}
//           <div className='md:col-span-1 space-y-6'>
//             {/* LOGO CARD */}
//             <Card className='h-fit'>
//               <CardHeader>
//                 <CardTitle className='text-base text-center'>
//                   Shop Logo
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='flex flex-col items-center pb-6'>
//                 <div className='h-32 w-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4 relative group'>
//                   {previewUrl ? (
//                     <img
//                       src={previewUrl}
//                       alt='Logo'
//                       className='h-full w-full object-cover'
//                     />
//                   ) : (
//                     <span className='text-4xl text-gray-300 font-bold'>
//                       {profile?.shopName?.charAt(0) || '?'}
//                     </span>
//                   )}
//                   <div className='absolute bottom-2 w-full flex items-center justify-center gap-3 z-20'>
//                     <label
//                       htmlFor='logo-upload'
//                       className='cursor-pointer bg-white p-2 rounded-full shadow-md hover:scale-110 hover:bg-gray-100 transition-all'
//                       title='Change Logo'
//                     >
//                       <Camera size={18} className='text-black' />
//                     </label>
//                     {previewUrl && (
//                       <button
//                         onClick={handleRemoveImage}
//                         className='cursor-pointer bg-white p-2 rounded-full shadow-md hover:scale-110 hover:bg-red-50 transition-all'
//                         title='Remove Logo'
//                         type='button'
//                       >
//                         <Trash2 size={18} className='text-red-600' />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 <Input
//                   id='logo-upload'
//                   type='file'
//                   className='hidden'
//                   accept='image/*'
//                   onChange={handleImageChange}
//                 />
//               </CardContent>
//             </Card>

//             {/* --- ID CARD UPLOAD (NEW) --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className='text-base flex items-center gap-2'>
//                   <FileBadge className='h-5 w-5 text-blue-600' /> ID
//                   Verification
//                 </CardTitle>
//                 <CardDescription className='text-xs'>
//                   Upload a valid Business ID or National ID to get Verified.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className='relative rounded-lg overflow-hidden border bg-gray-50 h-32 flex items-center justify-center group'>
//                   {idPreview ? (
//                     <>
//                       <img
//                         src={idPreview}
//                         className='w-full h-full object-cover'
//                       />
//                       {/* Overlay & Remove Button */}
//                       <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
//                         <button
//                           type='button'
//                           onClick={handleRemoveId}
//                           className='bg-white text-red-600 p-2 rounded-full hover:bg-red-50 shadow-md'
//                           title='Remove ID'
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                       {/* Verified Badge (Visual only) */}
//                       <div className='absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1'>
//                         <CheckCircle size={10} /> Uploaded
//                       </div>
//                     </>
//                   ) : (
//                     <label
//                       htmlFor='id-upload'
//                       className='flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-gray-100 transition-colors'
//                     >
//                       <Camera className='h-6 w-6 text-gray-400 mb-1' />
//                       <span className='text-xs text-gray-500'>
//                         Click to upload ID
//                       </span>
//                     </label>
//                   )}
//                   <Input
//                     id='id-upload'
//                     type='file'
//                     className='hidden'
//                     accept='image/*'
//                     onChange={handleIdChange}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* --- RIGHT COLUMN (Details & Socials) --- */}
//           <div className='md:col-span-2 space-y-8'>
//             <Card>
//               <CardHeader>
//                 <CardTitle className='text-lg'>Business Details</CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 {/* ... (Keep existing Business Details Inputs: Shop Name, Phone, City, Address, Description, Brand Color) ... */}
//                 {/* Ensure you paste your existing Business Details Inputs here from your previous code */}
//                 <div className='space-y-2'>
//                   <Label>Shop Name</Label>
//                   <Input
//                     name='shopName'
//                     defaultValue={profile.shopName}
//                     required
//                   />
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>WhatsApp Number</Label>
//                   <Input name='phone' defaultValue={profile.phone} required />
//                 </div>
//                 <div className='grid grid-cols-2 gap-4'>
//                   <div className='space-y-2'>
//                     <Label>City</Label>
//                     <Input name='city' defaultValue={profile.city} required />
//                   </div>
//                   <div className='space-y-2'>
//                     <Label>Address</Label>
//                     <Input
//                       name='address'
//                       defaultValue={profile.address || ''}
//                     />
//                   </div>
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>About</Label>
//                   <Textarea
//                     name='description'
//                     defaultValue={profile.description || ''}
//                     className='min-h-24'
//                   />
//                 </div>

//                 {/* Brand Color Section */}
//                 <div className='space-y-3 pt-4 border-t mt-4'>
//                   <div className='flex justify-between items-center'>
//                     <Label className='flex items-center gap-2 text-base'>
//                       <Palette size={18} /> Brand Color
//                     </Label>
//                     <span className='text-sm font-medium'>
//                       Active:{' '}
//                       <span
//                         style={{ color: selectedColor }}
//                         className='font-bold'
//                       >
//                         {currentColorName}
//                       </span>
//                     </span>
//                   </div>
//                   {/* ... Color Picker Logic (Keep existing) ... */}
//                   <div className='flex flex-wrap gap-3 items-center'>
//                     {PRESET_COLORS.map((color) => (
//                       <button
//                         type='button'
//                         key={color.hex}
//                         onClick={() => setSelectedColor(color.hex)}
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${selectedColor === color.hex ? 'scale-110 ring-2 ring-offset-2 ring-gray-300' : 'hover:scale-105'}`}
//                         style={{ backgroundColor: color.hex }}
//                       >
//                         {selectedColor === color.hex && (
//                           <Check
//                             className='h-5 w-5 text-white drop-shadow-md'
//                             strokeWidth={3}
//                           />
//                         )}
//                       </button>
//                     ))}
//                     <div className='relative ml-2 group'>
//                       <input
//                         type='color'
//                         name='brandColor'
//                         value={selectedColor}
//                         onChange={(e) => setSelectedColor(e.target.value)}
//                         className='opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10'
//                       />
//                       <div
//                         className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white text-xs font-bold cursor-pointer group-hover:bg-gray-50 transition-all ${currentColorName === 'Custom Color' ? 'ring-2 ring-offset-2 ring-gray-300 border-transparent' : 'border-gray-300'}`}
//                         style={{
//                           backgroundColor:
//                             currentColorName === 'Custom Color'
//                               ? selectedColor
//                               : 'white',
//                         }}
//                       >
//                         {currentColorName === 'Custom Color' ? (
//                           <Check
//                             className='h-5 w-5 text-white drop-shadow-md'
//                             strokeWidth={3}
//                           />
//                         ) : (
//                           <span className='text-gray-500 text-lg'>+</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className='text-lg'>Social Media & Links</CardTitle>
//               </CardHeader>
//               <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 {/* ... Keep existing Social Inputs ... */}
//                 <div className='space-y-2'>
//                   <Label>Website</Label>
//                   <Input
//                     name='websiteUrl'
//                     defaultValue={profile.websiteUrl || ''}
//                   />
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>Instagram</Label>
//                   <Input
//                     name='instagram'
//                     defaultValue={profile.instagram || ''}
//                     className='pl-7'
//                   />
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>TikTok</Label>
//                   <Input
//                     name='tiktok'
//                     defaultValue={profile.tiktok || ''}
//                     className='pl-7'
//                   />
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>Facebook</Label>
//                   <Input
//                     name='facebook'
//                     defaultValue={profile.facebook || ''}
//                   />
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>Twitter</Label>
//                   <Input
//                     name='twitter'
//                     defaultValue={profile.twitter || ''}
//                     className='pl-7'
//                   />
//                 </div>
//                 <div className='space-y-2'>
//                   <Label>Snapchat</Label>
//                   <Input
//                     name='snap'
//                     defaultValue={profile.snap || ''}
//                     className='pl-7'
//                   />
//                 </div>
//               </CardContent>

//               <CardContent className='border-t pt-6 bg-gray-50 flex flex-col md:flex-row items-end md:items-center justify-end gap-4 rounded-b-xl'>
//                 {msg.text && (
//                   <span
//                     className={`text-sm px-4 py-2 rounded-full font-medium ${msg.type === 'error' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}
//                   >
//                     {msg.text}
//                   </span>
//                 )}
//                 <Button
//                   type='submit'
//                   disabled={saving}
//                   className='bg-blue-600 hover:bg-blue-700 w-full md:w-auto'
//                 >
//                   {saving ? (
//                     <Loader2 className='animate-spin mr-2' />
//                   ) : (
//                     <Save className='mr-2 h-4 w-4' />
//                   )}
//                   Save All Changes
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

/**After premium look */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { updateSettings } from '@/actions/update-settings';
import DealerSettings from '@/components/dealer/DealerSettings';
import { supabase } from '@/lib/supabase';
import {
  Loader2,
  Camera,
  Trash2,
  Image as ImageIcon,
  Twitter,
  Facebook,
  Video,
  Instagram,
  Globe,
  Ghost,
  Palette,
  Check,
  FileBadge,
  CheckCircle,
  Store,
  Smartphone,
  ShieldCheck,
  BookLock,
} from 'lucide-react';
import {
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaTwitter,
} from 'react-icons/fa';

type SettingsClientProps = {
  initialProfile: any;
};

export default function SettingsClient({
  initialProfile,
}: SettingsClientProps) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const profile = initialProfile;

  // STATES
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.image || '');
  const [removeImageFlag, setRemoveImageFlag] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(profile?.coverImage || '');
  const [removeCoverFlag, setRemoveCoverFlag] = useState(false);

  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState(profile?.idCardImage || '');
  const [removeIdFlag, setRemoveIdFlag] = useState(false);

  const PRESET_COLORS = [
    { hex: '#2563EB', name: 'Blue' },
    { hex: '#DC2626', name: 'Red' },
    { hex: '#16A34A', name: 'Green' },
    { hex: '#9333EA', name: 'Purple' },
    { hex: '#EA580C', name: 'Orange' },
    { hex: '#000000', name: 'Black' },
  ];

  const [selectedColor, setSelectedColor] = useState(
    profile?.brandColor || '#2563EB',
  );
  const currentColorName =
    PRESET_COLORS.find(
      (c) => c.hex.toLowerCase() === selectedColor.toLowerCase(),
    )?.name || 'Custom Color';

  // --- HANDLERS (Same as before) ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveImageFlag(false);
    }
  };
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setRemoveCoverFlag(false);
    }
  };
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setIdFile(file);
      setIdPreview(URL.createObjectURL(file));
      setRemoveIdFlag(false);
    }
  };
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setPreviewUrl('');
    setRemoveImageFlag(true);
  };
  const handleRemoveCover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverFile(null);
    setCoverPreview('');
    setRemoveCoverFlag(true);
  };
  const handleRemoveId = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdFile(null);
    setIdPreview('');
    setRemoveIdFlag(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    const formData = new FormData(e.currentTarget);

    if (imageFile) {
      const fileName = `profile-${Date.now()}`;
      const { error } = await supabase.storage
        .from('phone-images')
        .upload(fileName, imageFile);
      if (!error)
        formData.set(
          'imageUrl',
          supabase.storage.from('phone-images').getPublicUrl(fileName).data
            .publicUrl,
        );
    }
    if (coverFile) {
      const fileName = `cover-${Date.now()}`;
      const { error } = await supabase.storage
        .from('phone-images')
        .upload(fileName, coverFile);
      if (!error)
        formData.set(
          'coverImageUrl',
          supabase.storage.from('phone-images').getPublicUrl(fileName).data
            .publicUrl,
        );
    }
    if (idFile) {
      const fileName = `idcard-${Date.now()}`;
      const { error } = await supabase.storage
        .from('phone-images')
        .upload(fileName, idFile);
      if (!error)
        formData.set(
          'idCardImage',
          supabase.storage.from('phone-images').getPublicUrl(fileName).data
            .publicUrl,
        );
    }

    const result = await updateSettings(formData);
    if (result.error) setMsg({ type: 'error', text: result.error });
    else setMsg({ type: 'success', text: result.success! });
    setSaving(false);
  };

  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <div className='max-w-5xl mx-auto pb-32'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Store Settings</h1>
        <p className='text-gray-500 mt-1'>
          Manage your shop identity, branding, and verification details.
        </p>
      </div>

      <form onSubmit={onSubmit} className='space-y-8'>
        <input
          type='hidden'
          name='removeImage'
          value={String(removeImageFlag)}
        />
        <input
          type='hidden'
          name='removeCover'
          value={String(removeCoverFlag)}
        />
        <input type='hidden' name='removeId' value={String(removeIdFlag)} />

        {/* --- 1. VISUAL IDENTITY --- */}
        <div className='space-y-4'>
          <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
            <Palette size={16} /> Visual Identity
          </h2>

          <Card className='overflow-hidden border border-gray-200 shadow-sm'>
            {/* Cover Photo */}
            <div className='relative h-48 md:h-60 bg-gray-50 group border-b'>
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt='Cover'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100'>
                  <ImageIcon size={48} className='mb-2 opacity-20' />
                  <span className='text-sm font-medium'>
                    Upload Cover Photo
                  </span>
                  <span className='text-xs mt-1'>1200 x 300px</span>
                </div>
              )}
              <div className='absolute bottom-4 right-4 flex items-center gap-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity'>
                <label
                  htmlFor='cover-upload'
                  className='cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-50 shadow-md transition-all hover:scale-105 text-sm'
                >
                  <Camera size={16} /> {coverPreview ? 'Change' : 'Upload'}
                </label>
                {coverPreview && (
                  <button
                    type='button'
                    onClick={handleRemoveCover}
                    className='bg-white text-red-600 p-2 rounded-full hover:bg-red-50 hover:scale-110 shadow-md transition-all'
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <Input
                id='cover-upload'
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleCoverChange}
              />
            </div>

            <CardContent className='pt-0 relative'>
              {/* Logo (Floating Over Banner) */}
              <div className='-mt-16 mb-6 flex flex-col items-center sm:items-start sm:ml-6'>
                <div className='h-32 w-32 rounded-full bg-white p-1 shadow-lg relative group'>
                  <div className='h-full w-full rounded-full overflow-hidden bg-gray-100 border relative'>
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt='Logo'
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='h-full w-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-4xl'>
                        {profile?.shopName?.charAt(0) || '?'}
                      </div>
                    )}
                    {/* Logo Controls */}
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                      <label
                        htmlFor='logo-upload'
                        className='cursor-pointer bg-white p-2 rounded-full hover:scale-110 transition-transform shadow-sm'
                        title='Change Logo'
                      >
                        <Camera size={16} className='text-gray-700' />
                      </label>
                      {previewUrl && (
                        <button
                          onClick={handleRemoveImage}
                          className='cursor-pointer bg-white p-2 rounded-full hover:scale-110 transition-transform shadow-sm'
                          type='button'
                        >
                          <Trash2 size={16} className='text-red-600' />
                        </button>
                      )}
                    </div>
                  </div>
                  <Input
                    id='logo-upload'
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Brand Color & Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-2 pb-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Shop Name</Label>
                    <Input
                      name='shopName'
                      defaultValue={profile.shopName}
                      required
                      className='font-semibold text-lg h-12'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Tagline / Bio</Label>
                    <Textarea
                      name='description'
                      defaultValue={profile.description || ''}
                      placeholder='Tell customers about your shop...'
                      className='min-h-[100px]'
                    />
                  </div>
                </div>

                {/* Color Picker */}
                <div className='bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit'>
                  <div className='flex justify-between items-center mb-4'>
                    <Label className='flex items-center gap-2 text-sm font-semibold'>
                      Brand Color
                    </Label>
                    <span className='text-xs font-medium bg-white px-2 py-1 rounded border'>
                      <span
                        style={{ color: selectedColor }}
                        className='font-bold mr-1'
                      >
                        ●
                      </span>
                      {currentColorName}
                    </span>
                  </div>
                  <div className='flex flex-wrap gap-3 items-center'>
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type='button'
                        onClick={() => setSelectedColor(color.hex)}
                        className={`w-8 h-8 rounded-full transition-all shadow-sm border-2 ${selectedColor === color.hex ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColor === color.hex && (
                          <Check className='h-4 w-4 text-white mx-auto stroke-[3px]' />
                        )}
                      </button>
                    ))}
                    <div className='relative ml-2 h-8 w-8'>
                      <input
                        type='color'
                        name='brandColor'
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className='opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10'
                      />
                      <div
                        className={`w-full h-full rounded-full border-2 flex items-center justify-center bg-white text-xs font-bold ${currentColorName === 'Custom Color' ? 'border-gray-900' : 'border-gray-300'}`}
                        style={{
                          backgroundColor:
                            currentColorName === 'Custom Color'
                              ? selectedColor
                              : 'white',
                        }}
                      >
                        {currentColorName === 'Custom Color' ? (
                          <Check className='h-4 w-4 text-white stroke-[3px]' />
                        ) : (
                          <span className='text-gray-400 text-lg'>+</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- 2. CONTACT & LOCATION --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
              <Store size={16} /> Contact Details
            </h2>
            <Card className='shadow-sm'>
              <CardContent className='p-6 space-y-4'>
                <div className='space-y-2'>
                  <Label>WhatsApp Number</Label>
                  <div className='relative'>
                    <Smartphone className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                    <Input
                      name='phone'
                      defaultValue={profile.phone}
                      required
                      className='pl-9'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>City</Label>
                    <Input name='city' defaultValue={profile.city} required />
                  </div>
                  <div className='space-y-2'>
                    <Label>Address</Label>
                    <Input
                      name='address'
                      defaultValue={profile.address || ''}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Website</Label>
                  <div className='relative'>
                    <Globe className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                    <Input
                      name='websiteUrl'
                      defaultValue={profile.websiteUrl || ''}
                      className='pl-9'
                      placeholder='https://'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-4'>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
              <ShieldCheck size={16} /> Verification
            </h2>
            <Card className='shadow-sm h-full'>
              <CardContent className='p-6 h-full flex flex-col'>
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-4'>
                    <Label>Business ID / National ID</Label>
                    {profile.isVerified ? (
                      <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1'>
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className='text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold'>
                        Unverified
                      </span>
                    )}
                  </div>

                  <div className='relative rounded-lg overflow-hidden border-2 border-dashed bg-gray-50 h-32 flex items-center justify-center group hover:bg-gray-100 transition-colors cursor-pointer'>
                    {idPreview ? (
                      <>
                        <img
                          src={idPreview}
                          className='w-full h-full object-cover opacity-90'
                        />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                          <label
                            htmlFor='id-upload'
                            className='cursor-pointer bg-white text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-50'
                          >
                            Change
                          </label>
                          <button
                            type='button'
                            onClick={handleRemoveId}
                            className='bg-red-600 text-white p-1.5 rounded hover:bg-red-700'
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label
                        htmlFor='id-upload'
                        className='flex flex-col items-center justify-center cursor-pointer w-full h-full'
                      >
                        <FileBadge className='h-8 w-8 text-gray-300 mb-2' />
                        <span className='text-xs text-gray-500 font-medium'>
                          Upload ID Document
                        </span>
                      </label>
                    )}
                    <Input
                      id='id-upload'
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleIdChange}
                    />
                  </div>
                  <p className='text-[10px] text-gray-400 mt-2 text-center'>
                    Only admins can view this document.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- 3. SOCIAL MEDIA --- */}
        <div className='space-y-4'>
          <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 pt-4'>
            <Globe size={16} /> Social Presence
          </h2>
          <Card className='shadow-sm'>
            <CardContent className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='space-y-2 relative'>
                <Label className='text-xs text-gray-500 ml-1'>Instagram</Label>
                <FaInstagram className='absolute left-3 top-8 h-4 w-4 text-pink-600' />
                <Input
                  name='instagram'
                  defaultValue={profile.instagram || ''}
                  className='pl-9'
                  placeholder='username'
                />
              </div>
              <div className='space-y-2 relative'>
                <Label className='text-xs text-gray-500 ml-1'>TikTok</Label>
                <FaTiktok className='absolute left-3 top-8 h-4 w-4 text-black' />
                <Input
                  name='tiktok'
                  defaultValue={profile.tiktok || ''}
                  className='pl-9'
                  placeholder='username'
                />
              </div>
              <div className='space-y-2 relative'>
                <Label className='text-xs text-gray-500 ml-1'>Facebook</Label>
                <FaFacebook className='absolute left-3 top-8 h-4 w-4 text-blue-600' />
                <Input
                  name='facebook'
                  defaultValue={profile.facebook || ''}
                  className='pl-9'
                  placeholder='Page Name'
                />
              </div>
              <div className='space-y-2 relative'>
                <Label className='text-xs text-gray-500 ml-1'>
                  X (Twitter)
                </Label>
                <FaTwitter className='absolute left-3 top-8 h-4 w-4 text-blue-400' />
                <Input
                  name='twitter'
                  defaultValue={profile.twitter || ''}
                  className='pl-9'
                  placeholder='username'
                />
              </div>
              <div className='space-y-2 relative'>
                <Label className='text-xs text-gray-500 ml-1'>Snapchat</Label>
                <FaSnapchat className='absolute left-3 top-8 h-4 w-4 text-yellow-500' />
                <Input
                  name='snap'
                  defaultValue={profile.snap || ''}
                  className='pl-9'
                  placeholder='username'
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- STICKY FOOTER --- */}
        <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex items-center justify-between z-40 md:pl-72 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'>
          <div className='flex items-center gap-2'>
            {msg.text && (
              <span
                className={`text-sm px-4 py-1.5 rounded-full font-medium animate-in slide-in-from-bottom-2 ${msg.type === 'error' ? 'text-red-700 bg-red-50' : 'text-green-700 bg-green-50'}`}
              >
                {msg.text}
              </span>
            )}
          </div>
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => window.location.reload()}
            >
              Discard
            </Button>
            <Button
              type='submit'
              disabled={saving}
              className='bg-blue-600 hover:bg-blue-700 w-32 shadow-lg'
            >
              {saving ? <Loader2 className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </div>
      </form>
      <div className='space-y-4 mt-6'>
        <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
          <BookLock size={16} /> Password
        </h2>
        <DealerSettings />
      </div>
    </div>
  );
}
