/**Before premium look */
// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';
// import { supabase } from '@/lib/supabase';
// import { addProduct } from '@/actions/add-product';
// import { Loader2, UploadCloud, Plus, X } from 'lucide-react';
// import { Checkbox } from '@/components/ui/checkbox';
// import BackButton from '@/components/ui/BackButton';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// export default function AddPhonePage() {
//   const [uploading, setUploading] = useState(false);
//   const [imageUrls, setImageUrls] = useState<string[]>([]);
//   const [status, setStatus] = useState<'idle' | 'saving'>('idle');
//   const [errorMsg, setErrorMsg] = useState('');

//   // Category & Brand States
//   const [selectedCategory, setSelectedCategory] = useState('PHONE');
//   const [brand, setBrand] = useState('');
//   const [isCustomBrand, setIsCustomBrand] = useState(false);

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     if (imageUrls.length + files.length > 3) {
//       setErrorMsg('You can only upload a maximum of 3 photos.');
//       e.target.value = '';
//       return;
//     }

//     setUploading(true);
//     const newBatch: string[] = [];

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const fileName = `phone-${Date.now()}-${Math.random().toString(36).substring(7)}`;

//       const { error } = await supabase.storage
//         .from('phone-images')
//         .upload(fileName, file);

//       if (!error) {
//         const { data } = supabase.storage
//           .from('phone-images')
//           .getPublicUrl(fileName);
//         newBatch.push(data.publicUrl);
//       }
//     }

//     if (newBatch.length > 0) {
//       setImageUrls((prev) => [...prev, ...newBatch]);
//     }

//     setUploading(false);
//     e.target.value = '';
//   };

//   const removeImage = (index: number) => {
//     setImageUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (imageUrls.length === 0) {
//       setErrorMsg('Please upload at least one photo of the item.');
//       return;
//     }

//     setStatus('saving');
//     const formData = new FormData(e.currentTarget);
//     formData.set('imageUrls', imageUrls.join(','));

//     // Ensure Brand is set correctly
//     formData.set('brand', brand);

//     const result = await addProduct(formData);

//     if (result?.error) {
//       setErrorMsg(result.error);
//       setStatus('idle');
//     }
//   };

//   return (
//     <div className='max-w-3xl mx-auto pb-20'>
//       <AlertDialog open={!!errorMsg} onOpenChange={() => setErrorMsg('')}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className='text-red-600'>
//               Action Required
//             </AlertDialogTitle>
//             <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => setErrorMsg('')}>
//               Okay
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <div className='mb-6 flex items-center gap-4'>
//         <BackButton />
//         <h1 className='text-2xl font-bold text-gray-900'>Sell a New Item</h1>
//       </div>

//       <Card>
//         <CardContent className='pt-6'>
//           <form onSubmit={handleSubmit} className='space-y-6'>
//             {/* IMAGE GRID (Keep Existing) */}
//             <div className='space-y-3'>
//               <Label>Photos (Add up to 3)</Label>
//               {imageUrls.length === 0 ? (
//                 <label className='border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group h-48'>
//                   {uploading ? (
//                     <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
//                   ) : (
//                     <>
//                       <div className='bg-blue-50 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform'>
//                         <UploadCloud className='h-8 w-8 text-blue-600' />
//                       </div>
//                       <span className='text-sm font-semibold text-gray-700'>
//                         Click to upload main photo
//                       </span>
//                       <span className='text-xs text-gray-400 mt-1'>
//                         JPG, PNG (Max 5MB)
//                       </span>
//                     </>
//                   )}
//                   <Input
//                     type='file'
//                     className='hidden'
//                     accept='image/*'
//                     onChange={handleImageUpload}
//                     disabled={uploading}
//                   />
//                 </label>
//               ) : (
//                 <div className='grid grid-cols-3 gap-4'>
//                   {imageUrls.map((url, index) => (
//                     <div
//                       key={url}
//                       className='relative aspect-square rounded-lg overflow-hidden border bg-gray-100 group'
//                     >
//                       <img src={url} className='w-full h-full object-cover' />
//                       <button
//                         type='button'
//                         onClick={() => removeImage(index)}
//                         className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform'
//                       >
//                         <X size={14} />
//                       </button>
//                       {index === 0 && (
//                         <div className='absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-1'>
//                           Main Photo
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                   {imageUrls.length < 3 && (
//                     <label className='aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'>
//                       {uploading ? (
//                         <Loader2 className='animate-spin text-gray-400' />
//                       ) : (
//                         <>
//                           <Plus className='text-gray-400 mb-1' />
//                           <span className='text-xs text-gray-500 font-medium'>
//                             Add More
//                           </span>
//                         </>
//                       )}
//                       <Input
//                         type='file'
//                         className='hidden'
//                         accept='image/*'
//                         onChange={handleImageUpload}
//                         disabled={uploading}
//                       />
//                     </label>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* CATEGORY */}
//             <div className='space-y-2'>
//               <Label>Category</Label>
//               <Select
//                 name='category'
//                 defaultValue='PHONE'
//                 onValueChange={(val) => {
//                   setSelectedCategory(val);
//                   setIsCustomBrand(false); // Reset brand mode
//                   setBrand('');
//                 }}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder='Select Category' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value='PHONE'>Mobile Phone</SelectItem>
//                   <SelectItem value='TABLET'>Tablet / iPad</SelectItem>
//                   <SelectItem value='LAPTOP'>Laptop / Computer</SelectItem>
//                   <SelectItem value='ACCESSORY'>Accessory</SelectItem>
//                   <SelectItem value='OTHER'>Other Gadgets</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* BRAND & MODEL */}
//             <div className='grid grid-cols-2 gap-4'>
//               <div className='space-y-2'>
//                 <Label>Brand</Label>

//                 {/* LOGIC: Show Input if Accessory/Other OR User clicked "Other" */}
//                 {selectedCategory === 'ACCESSORY' ||
//                 selectedCategory === 'OTHER' ||
//                 isCustomBrand ? (
//                   <div className='flex gap-2'>
//                     <Input
//                       placeholder='Type Brand Name...'
//                       value={brand}
//                       onChange={(e) => setBrand(e.target.value)}
//                       required
//                     />
//                     {isCustomBrand && (
//                       <Button
//                         type='button'
//                         variant='ghost'
//                         onClick={() => setIsCustomBrand(false)}
//                       >
//                         Cancel
//                       </Button>
//                     )}
//                   </div>
//                 ) : (
//                   <Select
//                     required
//                     onValueChange={(val) => {
//                       if (val === 'OTHER_BRAND') {
//                         setIsCustomBrand(true);
//                         setBrand('');
//                       } else {
//                         setBrand(val);
//                       }
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder='Select Brand' />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {selectedCategory === 'LAPTOP' ? (
//                         <>
//                           <SelectItem value='Apple'>Apple (MacBook)</SelectItem>
//                           <SelectItem value='Dell'>Dell</SelectItem>
//                           <SelectItem value='HP'>HP</SelectItem>
//                           <SelectItem value='Lenovo'>Lenovo</SelectItem>
//                           <SelectItem value='Asus'>Asus</SelectItem>
//                           <SelectItem value='Microsoft'>Microsoft</SelectItem>
//                         </>
//                       ) : (
//                         <>
//                           <SelectItem value='Apple'>Apple</SelectItem>
//                           <SelectItem value='Samsung'>Samsung</SelectItem>
//                           <SelectItem value='Google'>Google</SelectItem>
//                           <SelectItem value='Tecno'>Tecno</SelectItem>
//                           <SelectItem value='Infinix'>Infinix</SelectItem>
//                           <SelectItem value='Xiaomi'>Xiaomi</SelectItem>
//                           <SelectItem value='Huawei'>Huawei</SelectItem>
//                           <SelectItem value='Nokia'>Nokia</SelectItem>
//                         </>
//                       )}
//                       {/* THE MAGIC OPTION */}
//                       <SelectItem
//                         value='OTHER_BRAND'
//                         className='font-bold text-blue-600'
//                       >
//                         + Other Brand
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               </div>

//               {/* Model */}
//               <div className='space-y-2'>
//                 <Label>
//                   Model {selectedCategory === 'ACCESSORY' && '(Optional)'}
//                 </Label>
//                 <Input
//                   name='model'
//                   placeholder={
//                     selectedCategory === 'LAPTOP'
//                       ? 'e.g. XPS 13'
//                       : 'e.g. iPhone 13 Pro'
//                   }
//                   required={selectedCategory !== 'ACCESSORY'}
//                 />
//               </div>
//             </div>

//             {/* REST OF FORM */}
//             <div className='space-y-2'>
//               <Label>Ad Title</Label>
//               <Input
//                 name='title'
//                 placeholder={
//                   selectedCategory === 'LAPTOP'
//                     ? 'MacBook Pro M1 Clean'
//                     : 'UK Used iPhone 13 Pro'
//                 }
//                 required
//               />
//             </div>

//             <div className='grid grid-cols-2 gap-4'>
//               <div className='space-y-2'>
//                 <Label>Price (GH₵)</Label>
//                 <Input name='price' type='number' placeholder='4500' required />
//                 <div className='flex items-center space-x-2 pt-1'>
//                   <Checkbox
//                     id='isNegotiable'
//                     name='isNegotiable'
//                     className='h-5 w-5 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
//                   />
//                   <Label
//                     htmlFor='isNegotiable'
//                     className='text-sm text-gray-500 font-normal cursor-pointer'
//                   >
//                     Negotiable
//                   </Label>
//                 </div>
//               </div>

//               <div className='space-y-2'>
//                 <Label>Condition</Label>
//                 <Select name='condition' required>
//                   <SelectTrigger>
//                     <SelectValue placeholder='Condition' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value='NEW'>Brand New</SelectItem>
//                     <SelectItem value='USED'>Used</SelectItem>
//                     <SelectItem value='REFURBISHED'>Refurbished</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className='space-y-2'>
//               <Label>Description</Label>
//               <Textarea
//                 name='description'
//                 placeholder='Details...'
//                 className='min-h-[120px]'
//               />
//             </div>

//             <Button
//               type='submit'
//               className='w-full text-lg py-6'
//               disabled={
//                 uploading || imageUrls.length === 0 || status === 'saving'
//               }
//             >
//               {status === 'saving' ? (
//                 <>
//                   <Loader2 className='ml-2 animate-spin' /> Posting...
//                 </>
//               ) : (
//                 'Post Deal'
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

/**After premium look */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { addProduct } from '@/actions/add-product';
import {
  Loader2,
  UploadCloud,
  Plus,
  X,
  Image as ImageIcon,
  Smartphone,
  Tag,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import BackButton from '@/components/ui/BackButton';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AddPhonePage() {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Category & Brand States
  const [selectedCategory, setSelectedCategory] = useState('PHONE');
  const [brand, setBrand] = useState('');
  const [isCustomBrand, setIsCustomBrand] = useState(false);

  // ... (Keep existing handlers: handleImageUpload, removeImage, handleSubmit) ...
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > 3) {
      setErrorMsg('You can only upload a maximum of 3 photos.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    const newBatch: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `phone-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const { error } = await supabase.storage
        .from('phone-images')
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from('phone-images')
          .getPublicUrl(fileName);
        newBatch.push(data.publicUrl);
      }
    }

    if (newBatch.length > 0) {
      setImageUrls((prev) => [...prev, ...newBatch]);
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setErrorMsg('Please upload at least one photo.');
      return;
    }
    setStatus('saving');
    const formData = new FormData(e.currentTarget);
    formData.set('imageUrls', imageUrls.join(','));
    formData.set('brand', brand);

    const result = await addProduct(formData);
    if (result?.error) {
      setErrorMsg(result.error);
      setStatus('idle');
    }
  };

  return (
    <div className='max-w-4xl mx-auto pb-24'>
      <AlertDialog open={!!errorMsg} onOpenChange={() => setErrorMsg('')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-red-600'>
              Action Required
            </AlertDialogTitle>
            <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMsg('')}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PAGE HEADER */}
      <div className='mb-8'>
        <div className='flex items-center gap-4 mb-2'>
          <BackButton />
          <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
            List New Item
          </h1>
        </div>
        <p className='text-gray-500 ml-12'>
          Fill in the details to post your product to the marketplace.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        {/* LEFT COL: IMAGES & BASIC INFO */}
        <div className='lg:col-span-2 space-y-8'>
          {/* 1. IMAGES CARD */}
          <Card className='shadow-sm border-gray-200 overflow-hidden'>
            <CardHeader className='bg-gray-50/50 border-b pb-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2 text-gray-800'>
                <ImageIcon size={18} className='text-blue-600' /> Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                {imageUrls.length === 0 ? (
                  <label className='border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group'>
                    {uploading ? (
                      <div className='flex flex-col items-center gap-3'>
                        <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
                        <p className='text-sm font-medium text-blue-700'>
                          Uploading...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className='bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform'>
                          <UploadCloud className='h-8 w-8 text-blue-600' />
                        </div>
                        <span className='text-lg font-semibold text-gray-900'>
                          Click to upload photos
                        </span>
                        <span className='text-sm text-gray-500 mt-1'>
                          Supports JPG, PNG (Max 3)
                        </span>
                      </>
                    )}
                    <Input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                ) : (
                  <div className='grid grid-cols-3 gap-4'>
                    {imageUrls.map((url, index) => (
                      <div
                        key={url}
                        className='relative aspect-square rounded-xl overflow-hidden border bg-gray-100 group shadow-sm'
                      >
                        <img src={url} className='w-full h-full object-cover' />
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute top-2 right-2 bg-white/90 text-red-600 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110'
                        >
                          <X size={14} />
                        </button>
                        {index === 0 && (
                          <div className='absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold text-center py-1 rounded-md'>
                            Main Photo
                          </div>
                        )}
                      </div>
                    ))}
                    {imageUrls.length < 3 && (
                      <label className='aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all bg-gray-50/50'>
                        {uploading ? (
                          <Loader2 className='animate-spin text-blue-600' />
                        ) : (
                          <>
                            <Plus className='text-blue-500 mb-2 h-8 w-8' />
                            <span className='text-xs font-semibold text-gray-600'>
                              Add Another
                            </span>
                          </>
                        )}
                        <Input
                          type='file'
                          className='hidden'
                          accept='image/*'
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. DETAILS CARD */}
          <Card className='shadow-sm border-gray-200'>
            <CardHeader className='bg-gray-50/50 border-b pb-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2 text-gray-800'>
                <FileText size={18} className='text-blue-600' /> Item Details
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6 space-y-6'>
              <div className='space-y-2'>
                <Label>Ad Headline</Label>
                <Input
                  name='title'
                  placeholder={
                    selectedCategory === 'LAPTOP'
                      ? 'MacBook Pro M1 2020 Clean'
                      : 'UK Used iPhone 13 Pro - 128GB'
                  }
                  required
                  className='h-12 text-lg font-medium'
                />
              </div>

              <div className='space-y-2'>
                <Label>Description</Label>
                <Textarea
                  name='description'
                  placeholder='Describe condition, battery health, faults (if any)...'
                  className='min-h-[150px] resize-none'
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL: SPECS & PRICE */}
        <div className='space-y-8'>
          {/* 3. SPECIFICATIONS CARD */}
          <Card className='shadow-sm border-gray-200'>
            <CardHeader className='bg-gray-50/50 border-b pb-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2 text-gray-800'>
                <Smartphone size={18} className='text-blue-600' />{' '}
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6 space-y-5'>
              <div className='space-y-2'>
                <Label>Category</Label>
                <Select
                  name='category'
                  defaultValue='PHONE'
                  onValueChange={(val) => {
                    setSelectedCategory(val);
                    setIsCustomBrand(false);
                    setBrand('');
                  }}
                  required
                >
                  <SelectTrigger className='h-11'>
                    <SelectValue placeholder='Select Category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PHONE'>Mobile Phone</SelectItem>
                    <SelectItem value='TABLET'>Tablet / iPad</SelectItem>
                    <SelectItem value='LAPTOP'>Laptop / PC</SelectItem>
                    <SelectItem value='ACCESSORY'>Accessory</SelectItem>
                    <SelectItem value='OTHER'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Brand</Label>
                {selectedCategory === 'ACCESSORY' ||
                selectedCategory === 'OTHER' ||
                isCustomBrand ? (
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Brand Name...'
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                      className='h-11'
                    />
                    {isCustomBrand && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => setIsCustomBrand(false)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ) : (
                  <Select
                    required
                    onValueChange={(val) => {
                      if (val === 'OTHER_BRAND') {
                        setIsCustomBrand(true);
                        setBrand('');
                      } else {
                        setBrand(val);
                      }
                    }}
                  >
                    <SelectTrigger className='h-11'>
                      <SelectValue placeholder='Select Brand' />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory === 'LAPTOP' ? (
                        <>
                          <SelectItem value='Apple'>Apple</SelectItem>
                          <SelectItem value='Dell'>Dell</SelectItem>
                          <SelectItem value='HP'>HP</SelectItem>
                          <SelectItem value='Lenovo'>Lenovo</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value='Apple'>Apple</SelectItem>
                          <SelectItem value='Samsung'>Samsung</SelectItem>
                          <SelectItem value='Google'>Google</SelectItem>
                          <SelectItem value='Tecno'>Tecno</SelectItem>
                          <SelectItem value='Infinix'>Infinix</SelectItem>
                          <SelectItem value='Xiaomi'>Xiaomi</SelectItem>
                        </>
                      )}
                      <SelectItem
                        value='OTHER_BRAND'
                        className='font-bold text-blue-600'
                      >
                        + Other Brand
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Model {selectedCategory === 'ACCESSORY' && '(Optional)'}
                </Label>
                <Input
                  name='model'
                  placeholder='e.g. iPhone 13'
                  required={selectedCategory !== 'ACCESSORY'}
                  className='h-11'
                />
              </div>

              <div className='space-y-2'>
                <Label>Condition</Label>
                <Select name='condition' required>
                  <SelectTrigger className='h-11'>
                    <SelectValue placeholder='Select Condition' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='NEW'>Brand New (Boxed)</SelectItem>
                    <SelectItem value='USED'>Used / Foreign</SelectItem>
                    <SelectItem value='REFURBISHED'>Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 4. PRICING CARD */}
          <Card className='shadow-sm border-gray-200'>
            <CardHeader className='bg-gray-50/50 border-b pb-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2 text-gray-800'>
                <Tag size={18} className='text-blue-600' /> Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6 space-y-4'>
              <div className='space-y-2'>
                <Label>Price (GH₵)</Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold'>
                    GH₵
                  </span>
                  <Input
                    name='price'
                    type='number'
                    placeholder='0.00'
                    required
                    className='pl-12 h-12 text-lg font-bold'
                  />
                </div>
              </div>

              <div className='bg-blue-50 p-4 rounded-lg flex items-center gap-3 border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors'>
                <Checkbox
                  id='isNegotiable'
                  name='isNegotiable'
                  className='h-5 w-5 border-blue-400 data-[state=checked]:bg-blue-600'
                />
                <Label
                  htmlFor='isNegotiable'
                  className='text-sm font-medium text-blue-900 cursor-pointer flex-1'
                >
                  Open to Negotiation?
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* SUBMIT BUTTON */}
          <Button
            type='submit'
            className='w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg transition-transform hover:scale-[1.02]'
            disabled={
              uploading || imageUrls.length === 0 || status === 'saving'
            }
          >
            {status === 'saving' ? (
              <>
                <Loader2 className='ml-2 animate-spin' /> Publishing...
              </>
            ) : (
              'Publish Listing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
