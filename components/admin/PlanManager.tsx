// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   upsertPlan,
//   deletePlan,
//   updateGridSettings,
// } from '@/actions/admin-plans';
// import { toast } from 'sonner';
// import { Trash2, Edit, Plus, Grid, LayoutGrid, Columns } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';

// // Helper for Color Inputs
// function ColorInput({ label, name, defaultValue }: any) {
//   const [val, setVal] = useState(defaultValue || '#000000');

//   // Only update the visual color picker if the value is a valid simple HEX
//   // If it's a gradient string, keep picker black to avoid errors
//   const pickerValue = val.startsWith('#') && val.length === 7 ? val : '#000000';

//   return (
//     <div className='space-y-1'>
//       <Label className='text-xs text-gray-500'>{label}</Label>
//       <div className='flex gap-2 items-center'>
//         <input
//           type='color'
//           value={pickerValue}
//           onChange={(e) => setVal(e.target.value)} // Update text input on pick
//           className='h-10 w-10 p-1 rounded border cursor-pointer flex-shrink-0'
//         />
//         <Input
//           name={name}
//           value={val}
//           onChange={(e) => setVal(e.target.value)} // Update picker on type
//           className='h-10 font-mono text-sm'
//           placeholder='#hex or css-value'
//         />
//       </div>
//     </div>
//   );
// }

// export default function PlanManager({
//   plans,
//   gridCols,
// }: {
//   plans: any[];
//   gridCols: number;
// }) {
//   const [editingPlan, setEditingPlan] = useState<any>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [currentGrid, setCurrentGrid] = useState(gridCols);

//   const handleSave = async (formData: FormData) => {
//     if (!formData.get('isPopular')) formData.set('isPopular', 'off');

//     const res = await upsertPlan(formData);
//     if (res.success) {
//       toast.success('Plan saved!');
//       setIsDialogOpen(false);
//     } else {
//       toast.error('Error saving plan');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this plan?')) return;
//     await deletePlan(id);
//     toast.success('Plan deleted');
//   };

//   const handleGridChange = async (cols: number) => {
//     setCurrentGrid(cols); // Optimistic UI
//     await updateGridSettings(cols);
//     toast.success(`Subscribe page set to ${cols} columns`);
//   };

//   return (
//     <div className='space-y-8'>
//       {/* 1. GRID LAYOUT CONTROL */}
//       <Card className='bg-slate-50 border-dashed'>
//         <CardHeader className='pb-3 flex flex-row items-center justify-between'>
//           <CardTitle className='text-sm font-medium flex items-center gap-2'>
//             <LayoutGrid size={18} /> Public Page Layout
//           </CardTitle>
//           <span className='text-xs text-gray-500'>How many cards per row?</span>
//         </CardHeader>
//         <CardContent className='flex gap-4'>
//           {[2, 3, 4].map((num) => (
//             <Button
//               key={num}
//               variant={currentGrid === num ? 'default' : 'outline'}
//               onClick={() => handleGridChange(num)}
//               className={`flex gap-2 ${currentGrid === num ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white'}`}
//             >
//               <Columns size={16} /> {num} Cols
//             </Button>
//           ))}
//         </CardContent>
//       </Card>

//       {/* 2. PLANS LIST */}
//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//         {/* Create New Button */}
//         <Button
//           variant='outline'
//           className='h-full min-h-[200px] border-dashed border-2 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200'
//           onClick={() => {
//             setEditingPlan(null);
//             setIsDialogOpen(true);
//           }}
//         >
//           <div className='bg-blue-100 p-3 rounded-full text-blue-600'>
//             <Plus size={32} />
//           </div>
//           <span className='font-bold text-blue-700'>Add New Plan</span>
//         </Button>

//         {/* Existing Plans */}
//         {plans.map((plan) => (
//           <Card
//             key={plan.id}
//             className='relative group hover:shadow-md transition-all'
//           >
//             <div
//               className='h-2 w-full rounded-t-lg'
//               style={{
//                 backgroundColor: plan.headerBg.startsWith('#')
//                   ? plan.headerBg
//                   : '#ccc',
//               }}
//             />
//             <CardHeader>
//               <div className='flex justify-between items-start'>
//                 <div>
//                   <CardTitle>{plan.name}</CardTitle>
//                   <p className='text-xs text-gray-500 font-bold mt-1'>
//                     {plan.tier}
//                   </p>
//                 </div>
//                 <span className='font-bold text-xl text-gray-900'>
//                   GH₵{plan.price}
//                 </span>
//               </div>
//             </CardHeader>
//             <CardContent className='space-y-4'>
//               <p className='text-sm text-gray-500 line-clamp-2'>
//                 {plan.description}
//               </p>
//               <div className='flex gap-2 justify-end pt-4 border-t'>
//                 <Button
//                   size='sm'
//                   variant='outline'
//                   onClick={() => {
//                     setEditingPlan(plan);
//                     setIsDialogOpen(true);
//                   }}
//                 >
//                   <Edit size={14} className='mr-1' /> Edit
//                 </Button>
//                 <Button
//                   size='sm'
//                   variant='destructive'
//                   onClick={() => handleDelete(plan.id)}
//                 >
//                   <Trash2 size={14} />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* 3. EDIT DIALOG */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className='max-h-[90vh] overflow-y-auto w-full max-w-lg'>
//           <DialogHeader>
//             <DialogTitle>
//               {editingPlan ? 'Edit Subscription Plan' : 'Create New Plan'}
//             </DialogTitle>
//           </DialogHeader>
//           <form action={handleSave} className='space-y-4'>
//             <input type='hidden' name='id' value={editingPlan?.id || ''} />

//             <div className='grid grid-cols-2 gap-4'>
//               <div className='space-y-2'>
//                 <Label>Plan Name</Label>
//                 <Input
//                   name='name'
//                   defaultValue={editingPlan?.name}
//                   placeholder='e.g. Diamond'
//                   required
//                 />
//               </div>
//               <div className='space-y-2'>
//                 <Label>System Tier</Label>
//                 <select
//                   name='tier'
//                   className='flex h-10 w-full rounded-md border bg-white px-3'
//                   defaultValue={editingPlan?.tier || 'GOLD'}
//                 >
//                   <option value='GOLD'>Gold (Standard)</option>
//                   <option value='PLATINUM'>Platinum (Premium)</option>
//                 </select>
//               </div>
//             </div>

//             <div className='space-y-2'>
//               <Label>Base Price (GH₵)</Label>
//               <Input
//                 name='price'
//                 type='number'
//                 defaultValue={editingPlan?.price}
//                 required
//               />
//             </div>
//             <div className='space-y-2'>
//               <Label>Badge Text (e.g. Billed Monthly)</Label>
//               <Input
//                 name='description'
//                 defaultValue={editingPlan?.description}
//               />
//             </div>
//             <div className='space-y-2'>
//               <Label>Button Text</Label>
//               <Input
//                 name='buttonText'
//                 defaultValue={editingPlan?.buttonText || 'Subscribe'}
//               />
//             </div>
//             <div className='space-y-2'>
//               <Label>Features (One per line)</Label>
//               <Textarea
//                 name='features'
//                 defaultValue={editingPlan?.features.join('\n')}
//                 className='h-24'
//                 placeholder='Feature 1&#10;Feature 2'
//               />
//             </div>

//             <div className='flex items-center justify-between border p-3 rounded bg-gray-50'>
//               <Label>Most Popular?</Label>
//               <Switch
//                 name='isPopular'
//                 defaultChecked={editingPlan?.isPopular}
//               />
//             </div>

//             {/* THEME CUSTOMIZATION
//             <div className='border-t pt-4 grid grid-cols-2 gap-4'>
//               <ColorInput
//                 label='Header Bg'
//                 name='headerBg'
//                 defaultValue={editingPlan?.headerBg || '#1e293b'}
//               />
//               <ColorInput
//                 label='Text Color'
//                 name='textColor'
//                 defaultValue={editingPlan?.textColor || '#ffffff'}
//               />
//               <ColorInput
//                 label='Badge Bg'
//                 name='badgeColor'
//                 defaultValue={editingPlan?.badgeColor || '#ffffff33'}
//               />
//               <ColorInput
//                 label='Icon Color'
//                 name='iconColor'
//                 defaultValue={editingPlan?.iconColor || '#3b82f6'}
//               />
//             </div> */}
//             {/* THEME CUSTOMIZATION */}
//             <div className='border-t pt-4 space-y-4'>
//               <h4 className='font-bold text-sm text-gray-700 uppercase tracking-wider'>
//                 Visual Theme
//               </h4>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 {/* HEADER BG */}
//                 <div className='space-y-2'>
//                   <Label>Header Background</Label>
//                   <div className='flex gap-2'>
//                     <input
//                       type='color'
//                       onChange={(e) => {
//                         const el = document.getElementById(
//                           'headerBg',
//                         ) as HTMLInputElement;
//                         if (el) el.value = e.target.value;
//                       }}
//                       className='h-10 w-10 p-1 rounded border cursor-pointer'
//                     />
//                     <Input
//                       id='headerBg'
//                       name='headerBg'
//                       defaultValue={editingPlan?.headerBg}
//                       placeholder='#hex OR css-gradient'
//                     />
//                   </div>
//                   <p className='text-[10px] text-gray-400'>
//                     Use Hex #000 or linear-gradient(...)
//                   </p>
//                 </div>

//                 {/* TEXT COLOR */}
//                 <div className='space-y-2'>
//                   <Label>Text Color</Label>
//                   <div className='flex gap-2'>
//                     <input
//                       type='color'
//                       onChange={(e) => {
//                         const el = document.getElementById(
//                           'textColor',
//                         ) as HTMLInputElement;
//                         if (el) el.value = e.target.value;
//                       }}
//                       className='h-10 w-10 p-1 rounded border cursor-pointer'
//                     />
//                     <Input
//                       id='textColor'
//                       name='textColor'
//                       defaultValue={editingPlan?.textColor}
//                       placeholder='#ffffff'
//                     />
//                   </div>
//                 </div>

//                 {/* BADGE BG */}
//                 <div className='space-y-2'>
//                   <Label>Badge Background</Label>
//                   <div className='flex gap-2'>
//                     <input
//                       type='color'
//                       onChange={(e) => {
//                         const el = document.getElementById(
//                           'badgeColor',
//                         ) as HTMLInputElement;
//                         if (el) el.value = e.target.value;
//                       }}
//                       className='h-10 w-10 p-1 rounded border cursor-pointer'
//                     />
//                     <Input
//                       id='badgeColor'
//                       name='badgeColor'
//                       defaultValue={editingPlan?.badgeColor}
//                       placeholder='#hex OR rgba(0,0,0,0.5)'
//                     />
//                   </div>
//                 </div>

//                 {/* ICON COLOR */}
//                 <div className='space-y-2'>
//                   <Label>Icon Color</Label>
//                   <div className='flex gap-2'>
//                     <input
//                       type='color'
//                       onChange={(e) => {
//                         const el = document.getElementById(
//                           'iconColor',
//                         ) as HTMLInputElement;
//                         if (el) el.value = e.target.value;
//                       }}
//                       className='h-10 w-10 p-1 rounded border cursor-pointer'
//                     />
//                     <Input
//                       id='iconColor'
//                       name='iconColor'
//                       defaultValue={editingPlan?.iconColor}
//                       placeholder='#hex'
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Button
//               type='submit'
//               className='w-full mt-4 bg-blue-600 hover:bg-blue-700'
//             >
//               Save Plan
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  upsertPlan,
  deletePlan,
  updateGridSettings,
} from '@/actions/admin-plans';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Grid, LayoutGrid, Columns } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Helper for Color Logic
// Only update the picker if the text is a valid simple hex, otherwise black
const getPickerValue = (val: string | undefined) => {
  return val && val.startsWith('#') && val.length === 7 ? val : '#000000';
};

export default function PlanManager({
  plans,
  gridCols,
}: {
  plans: any[];
  gridCols: number;
}) {
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGrid, setCurrentGrid] = useState(gridCols);

  const handleSave = async (formData: FormData) => {
    if (!formData.get('isPopular')) formData.set('isPopular', 'off');

    const res = await upsertPlan(formData);
    if (res.success) {
      toast.success('Plan saved!');
      setIsDialogOpen(false);
    } else {
      toast.error('Error saving plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    await deletePlan(id);
    toast.success('Plan deleted');
  };

  const handleGridChange = async (cols: number) => {
    setCurrentGrid(cols);
    await updateGridSettings(cols);
    toast.success(`Subscribe page set to ${cols} columns`);
  };

  return (
    <div className='space-y-8'>
      {/* 1. GRID LAYOUT CONTROL */}
      <Card className='bg-slate-50 border-dashed'>
        <CardHeader className='pb-3 flex flex-row items-center justify-between'>
          <CardTitle className='text-sm font-medium flex items-center gap-2'>
            <LayoutGrid size={18} /> Public Page Layout
          </CardTitle>
          <span className='text-xs text-gray-500'>How many cards per row?</span>
        </CardHeader>
        <CardContent className='flex gap-4'>
          {[2, 3, 4].map((num) => (
            <Button
              key={num}
              variant={currentGrid === num ? 'default' : 'outline'}
              onClick={() => handleGridChange(num)}
              className={`flex gap-2 ${currentGrid === num ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white'}`}
            >
              <Columns size={16} /> {num} Cols
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* 2. PLANS LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Button
          variant='outline'
          className='h-full min-h-[200px] border-dashed border-2 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200'
          onClick={() => {
            setEditingPlan(null);
            setIsDialogOpen(true);
          }}
        >
          <div className='bg-blue-100 p-3 rounded-full text-blue-600'>
            <Plus size={32} />
          </div>
          <span className='font-bold text-blue-700'>Add New Plan</span>
        </Button>

        {plans.map((plan) => (
          <Card
            key={plan.id}
            className='relative group hover:shadow-md transition-all'
          >
            {/* Header Preview Stripe */}
            <div
              className='h-3 w-full rounded-t-lg'
              style={{ background: plan.headerBg }}
            />
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className='text-xs text-gray-500 font-bold mt-1'>
                    {plan.tier}
                  </p>
                </div>
                <span className='font-bold text-xl text-gray-900'>
                  GH₵{plan.price}
                </span>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm text-gray-500 line-clamp-2'>
                {plan.description}
              </p>
              <div className='flex gap-2 justify-end pt-4 border-t'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    setEditingPlan(plan);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit size={14} className='mr-1' /> Edit
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. EDIT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-h-[90vh] overflow-y-auto w-full max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Subscription Plan' : 'Create New Plan'}
            </DialogTitle>
          </DialogHeader>
          <form action={handleSave} className='space-y-4'>
            <input type='hidden' name='id' value={editingPlan?.id || ''} />

            {/* Standard Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Plan Name</Label>
                <Input
                  name='name'
                  defaultValue={editingPlan?.name}
                  placeholder='e.g. Diamond'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label>System Tier</Label>
                <select
                  name='tier'
                  className='flex h-10 w-full rounded-md border bg-white px-3'
                  defaultValue={editingPlan?.tier || 'GOLD'}
                >
                  <option value='GOLD'>Gold (Standard)</option>
                  <option value='PLATINUM'>Platinum (Premium)</option>
                </select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Base Price (GH₵)</Label>
              <Input
                name='price'
                type='number'
                defaultValue={editingPlan?.price}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label>Badge Text (e.g. Monthly Subscription)</Label>
              <Input
                name='description'
                defaultValue={editingPlan?.description}
              />
            </div>
            <div className='space-y-2'>
              <Label>Button Text</Label>
              <Input
                name='buttonText'
                defaultValue={editingPlan?.buttonText || 'Subscribe'}
              />
            </div>
            <div className='space-y-2'>
              <Label>Features (One per line)</Label>
              <Textarea
                name='features'
                defaultValue={editingPlan?.features?.join('\n')}
                className='h-24'
                placeholder='Feature 1&#10;Feature 2'
              />
            </div>

            <div className='flex items-center justify-between border p-3 rounded bg-gray-50'>
              <Label>Most Popular?</Label>
              <Switch
                name='isPopular'
                defaultChecked={editingPlan?.isPopular}
              />
            </div>

            {/* THEME CUSTOMIZATION */}
            <div className='border-t pt-4 space-y-4'>
              <h4 className='font-bold text-sm text-gray-700 uppercase tracking-wider'>
                Visual Theme
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* HEADER BG */}
                <div className='space-y-2'>
                  <Label>Header Background</Label>
                  <div className='flex gap-2'>
                    <input
                      type='color'
                      className='h-10 w-10 p-1 rounded border cursor-pointer'
                      defaultValue={getPickerValue(editingPlan?.headerBg)}
                      onChange={(e) => {
                        const el = document.getElementById(
                          'headerBg',
                        ) as HTMLInputElement;
                        if (el) el.value = e.target.value;
                      }}
                    />
                    <Input
                      id='headerBg'
                      name='headerBg'
                      defaultValue={editingPlan?.headerBg}
                      placeholder='#hex OR css-gradient'
                    />
                  </div>
                  <p className='text-[10px] text-gray-400'>
                    Use Hex #000 or linear-gradient(...)
                  </p>
                </div>

                {/* TEXT COLOR */}
                <div className='space-y-2'>
                  <Label>Text Color</Label>
                  <div className='flex gap-2'>
                    <input
                      type='color'
                      className='h-10 w-10 p-1 rounded border cursor-pointer'
                      defaultValue={getPickerValue(editingPlan?.textColor)}
                      onChange={(e) => {
                        const el = document.getElementById(
                          'textColor',
                        ) as HTMLInputElement;
                        if (el) el.value = e.target.value;
                      }}
                    />
                    <Input
                      id='textColor'
                      name='textColor'
                      defaultValue={editingPlan?.textColor}
                      placeholder='#ffffff'
                    />
                  </div>
                </div>

                {/* BADGE BG */}
                <div className='space-y-2'>
                  <Label>Badge Background</Label>
                  <div className='flex gap-2'>
                    <input
                      type='color'
                      className='h-10 w-10 p-1 rounded border cursor-pointer'
                      defaultValue={getPickerValue(editingPlan?.badgeColor)}
                      onChange={(e) => {
                        const el = document.getElementById(
                          'badgeColor',
                        ) as HTMLInputElement;
                        if (el) el.value = e.target.value;
                      }}
                    />
                    <Input
                      id='badgeColor'
                      name='badgeColor'
                      defaultValue={editingPlan?.badgeColor}
                      placeholder='#hex OR rgba(...)'
                    />
                  </div>
                </div>

                {/* ICON COLOR */}
                <div className='space-y-2'>
                  <Label>Icon Color</Label>
                  <div className='flex gap-2'>
                    <input
                      type='color'
                      className='h-10 w-10 p-1 rounded border cursor-pointer'
                      defaultValue={getPickerValue(editingPlan?.iconColor)}
                      onChange={(e) => {
                        const el = document.getElementById(
                          'iconColor',
                        ) as HTMLInputElement;
                        if (el) el.value = e.target.value;
                      }}
                    />
                    <Input
                      id='iconColor'
                      name='iconColor'
                      defaultValue={editingPlan?.iconColor}
                      placeholder='#hex'
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full mt-4 bg-blue-600 hover:bg-blue-700'
            >
              Save Plan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
