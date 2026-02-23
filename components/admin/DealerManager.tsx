// 'use client';

// import { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { BadgeCheck, Trash2, Ban, CheckCircle, Search } from 'lucide-react';
// import { toggleVerification, deleteDealer } from '@/actions/admin-dealers';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';

// export default function DealerManager({
//   initialDealers,
// }: {
//   initialDealers: any[];
// }) {
//   const [dealers, setDealers] = useState(initialDealers);
//   const [filter, setFilter] = useState(''); // Search State

//   // Filter Logic
//   const filteredDealers = dealers.filter(
//     (d) =>
//       d.shopName.toLowerCase().includes(filter.toLowerCase()) ||
//       d.user.email.toLowerCase().includes(filter.toLowerCase()),
//   );

//   const handleVerify = async (id: string, currentStatus: boolean) => {
//     // Optimistic Update
//     setDealers((prev) =>
//       prev.map((d) => (d.id === id ? { ...d, isVerified: !currentStatus } : d)),
//     );

//     await toggleVerification(id, currentStatus);
//     toast.success(
//       currentStatus ? 'Verified Badge removed' : 'Dealer Verified!',
//     );
//   };

//   const handleDelete = async (id: string) => {
//     if (
//       !confirm(
//         'Are you sure? This will delete the USER account and ALL their products.',
//       )
//     )
//       return;

//     setDealers((prev) => prev.filter((d) => d.id !== id));
//     await deleteDealer(id);
//     toast.success('Dealer deleted.');
//   };

//   return (
//     <div className='bg-white rounded-lg border shadow-sm'>
//       {/* SEARCH BAR */}
//       <div className='relative max-w-md'>
//         <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
//         <Input
//           placeholder='Search by Shop Name or Email...'
//           className='pl-10 bg-white'
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         />
//       </div>

//       <div className='bg-white rounded-lg border shadow-sm overflow-hidden'>
//         {/* NO RESULTS STATE */}
//         {filteredDealers.length === 0 ? (
//           <div className='text-center py-12 text-gray-500'>
//             <p className='font-medium'>No dealers found.</p>
//             <p className='text-sm'>Try adjusting your search for "{filter}".</p>
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Dealer Info</TableHead>
//                 <TableHead>Plan</TableHead>
//                 <TableHead>Stock</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className='text-right'>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {dealers.map((dealer) => (
//                 <TableRow key={dealer.id}>
//                   <TableCell className='flex items-center gap-3'>
//                     <Avatar className='h-10 w-10 border'>
//                       <AvatarImage src={dealer.image || ''} />
//                       <AvatarFallback className='bg-blue-100 text-blue-700 font-bold'>
//                         {dealer.shopName.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className='font-medium text-gray-900'>
//                         {dealer.shopName}
//                       </p>
//                       <p className='text-xs text-gray-500'>
//                         {dealer.user.email}
//                       </p>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <span
//                       className={`text-xs font-bold px-2 py-1 rounded uppercase ${
//                         dealer.subscriptionTier === 'PLATINUM'
//                           ? 'bg-purple-100 text-purple-700'
//                           : dealer.subscriptionTier === 'GOLD'
//                             ? 'bg-yellow-100 text-yellow-700'
//                             : 'bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       {dealer.subscriptionTier}
//                     </span>
//                   </TableCell>

//                   <TableCell>{dealer._count.products} Items</TableCell>

//                   <TableCell>
//                     {dealer.isVerified ? (
//                       <span className='flex items-center gap-1 text-blue-600 text-xs font-medium'>
//                         <BadgeCheck size={14} /> Verified
//                       </span>
//                     ) : (
//                       <span className='text-gray-400 text-xs'>Unverified</span>
//                     )}
//                   </TableCell>

//                   <TableCell className='text-right'>
//                     <div className='flex justify-end gap-2'>
//                       <Button
//                         size='sm'
//                         variant='outline'
//                         onClick={() =>
//                           handleVerify(dealer.id, dealer.isVerified)
//                         }
//                         title={
//                           dealer.isVerified
//                             ? 'Revoke Verification'
//                             : 'Approve Dealer'
//                         }
//                       >
//                         {dealer.isVerified ? (
//                           <Ban size={16} className='text-orange-500' />
//                         ) : (
//                           <CheckCircle size={16} className='text-green-600' />
//                         )}
//                       </Button>

//                       <Button
//                         size='sm'
//                         variant='outline'
//                         className='hover:bg-red-50 hover:text-red-600 border-red-200'
//                         onClick={() => handleDelete(dealer.id)}
//                       >
//                         <Trash2 size={16} />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// }

/**Before premium look */
// 'use client';

// import { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import {
//   BadgeCheck,
//   Trash2,
//   Ban,
//   CheckCircle,
//   Search,
//   PowerOff,
// } from 'lucide-react'; // Import PowerOff
// import {
//   toggleVerification,
//   deleteDealer,
//   toggleSuspend,
//   updateDealerPlan,
// } from '@/actions/admin-dealers'; // Import toggleSuspend
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Edit } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// export default function DealerManager({
//   initialDealers,
// }: {
//   initialDealers: any[];
// }) {
//   const [dealers, setDealers] = useState(initialDealers);
//   const [filter, setFilter] = useState('');

//   // NEW: Filter State
//   const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, GOLD, PLATINUM, SUSPENDED, VERIFIED

//   // Combined Filter Logic
//   const filteredDealers = dealers.filter((d) => {
//     // 1. Text Search
//     const matchesText =
//       d.shopName.toLowerCase().includes(filter.toLowerCase()) ||
//       d.user.email.toLowerCase().includes(filter.toLowerCase());

//     // 2. Category Filter
//     let matchesCategory = true;
//     if (statusFilter === 'GOLD')
//       matchesCategory = d.subscriptionTier === 'GOLD';
//     if (statusFilter === 'PLATINUM')
//       matchesCategory = d.subscriptionTier === 'PLATINUM';
//     if (statusFilter === 'FREE')
//       matchesCategory = d.subscriptionTier === 'FREE';
//     if (statusFilter === 'SUSPENDED')
//       matchesCategory = d.subscriptionStatus === 'SUSPENDED';
//     if (statusFilter === 'VERIFIED') matchesCategory = d.isVerified === true;

//     return matchesText && matchesCategory;
//   });

//   const handleVerify = async (id: string, currentStatus: boolean) => {
//     setDealers((prev) =>
//       prev.map((d) => (d.id === id ? { ...d, isVerified: !currentStatus } : d)),
//     );
//     await toggleVerification(id, currentStatus);
//     toast.success(
//       currentStatus ? 'Verified Badge removed' : 'Dealer Verified!',
//     );
//   };

//   const handleSuspend = async (id: string, currentStatus: string) => {
//     const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
//     setDealers((prev) =>
//       prev.map((d) =>
//         d.id === id ? { ...d, subscriptionStatus: newStatus } : d,
//       ),
//     );
//     await toggleSuspend(id, currentStatus);
//     toast.success(
//       newStatus === 'SUSPENDED' ? 'Dealer Suspended' : 'Dealer Activated',
//     );
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure? This deletes the USER account entirely.'))
//       return;
//     setDealers((prev) => prev.filter((d) => d.id !== id));
//     await deleteDealer(id);
//     toast.success('Dealer deleted.');
//   };

//   const handleManualUpdate = async (formData: FormData) => {
//     const res = await updateDealerPlan(formData);
//     if (res?.error) {
//       toast.error(res.error);
//     } else {
//       toast.success(res.success);
//       // We refresh the page to show the new Tier immediately because optimistic update is complex here
//       window.location.reload();
//     }
//   };

//   return (
//     <div className='space-y-6'>
//       {/* SEARCH & FILTER ROW */}
//       <div className='flex flex-col md:flex-row gap-4 justify-between items-start md:items-center'>
//         {/* Search Input */}
//         <div className='relative w-full md:w-64'>
//           <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
//           <Input
//             placeholder='Search by Shop Name or Email...'
//             className='pl-10 bg-white'
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           />
//         </div>

//         {/* Filter Tabs */}
//         <Tabs defaultValue='ALL' onValueChange={setStatusFilter}>
//           <TabsList className='h-9'>
//             <TabsTrigger value='ALL'>All</TabsTrigger>
//             <TabsTrigger value='PLATINUM' className='text-purple-700'>
//               Platinum
//             </TabsTrigger>
//             <TabsTrigger value='GOLD' className='text-yellow-700'>
//               Gold
//             </TabsTrigger>
//             <TabsTrigger value='VERIFIED' className='text-blue-700'>
//               Verified
//             </TabsTrigger>
//             <TabsTrigger value='SUSPENDED' className='text-red-700'>
//               Suspended
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className='bg-white rounded-lg border shadow-sm overflow-hidden'>
//         {filteredDealers.length === 0 ? (
//           <div className='text-center py-12 text-gray-500'>
//             <p className='font-medium'>No dealers found.</p>
//             <p className='text-sm'>Try adjusting your search for "{filter}".</p>
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Dealer Info</TableHead>
//                 <TableHead>Plan</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Account</TableHead>
//                 <TableHead>ID</TableHead>
//                 <TableHead className='text-right'>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredDealers.map((dealer) => (
//                 <TableRow
//                   key={dealer.id}
//                   className={
//                     dealer.subscriptionStatus === 'SUSPENDED'
//                       ? 'bg-red-50/50'
//                       : ''
//                   }
//                 >
//                   <TableCell className='flex items-center gap-3'>
//                     <Avatar className='h-10 w-10 border'>
//                       <AvatarImage src={dealer.image || ''} />
//                       <AvatarFallback className='bg-blue-100 text-blue-700 font-bold'>
//                         {dealer.shopName.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className='font-medium text-gray-900'>
//                         {dealer.shopName}
//                       </p>
//                       <p className='text-xs text-gray-500'>
//                         {dealer.user.email}
//                       </p>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <span
//                       className={`text-xs font-bold px-2 py-1 rounded uppercase ${
//                         dealer.subscriptionTier === 'PLATINUM'
//                           ? 'bg-purple-100 text-purple-700'
//                           : dealer.subscriptionTier === 'GOLD'
//                             ? 'bg-yellow-100 text-yellow-700'
//                             : 'bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       {dealer.subscriptionTier}
//                     </span>
//                   </TableCell>

//                   {/* Verification Status */}
//                   <TableCell>
//                     {dealer.isVerified ? (
//                       <span className='flex items-center gap-1 text-blue-600 text-xs font-medium'>
//                         <BadgeCheck size={14} /> Verified
//                       </span>
//                     ) : (
//                       <span className='text-gray-400 text-xs'>Unverified</span>
//                     )}
//                   </TableCell>

//                   {/* Account Status (Suspended/Active) */}
//                   <TableCell>
//                     {dealer.subscriptionStatus === 'SUSPENDED' ? (
//                       <Badge variant='destructive' className='text-[10px]'>
//                         SUSPENDED
//                       </Badge>
//                     ) : (
//                       <Badge
//                         variant='outline'
//                         className='text-[10px] text-green-600 border-green-200 bg-green-50'
//                       >
//                         ACTIVE
//                       </Badge>
//                     )}
//                   </TableCell>

//                   <TableCell>
//                     {dealer.idCardImage ? (
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button size='sm' variant='secondary'>
//                             View ID
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className='max-w-lg'>
//                           <DialogHeader>
//                             <DialogTitle>Verification ID</DialogTitle>
//                           </DialogHeader>
//                           <div className='max-h-[60vh] overflow-auto bg-gray-100 rounded-lg p-2 flex justify-center'>
//                             {/* Constrain Image Height */}
//                             <img
//                               src={dealer.idCardImage}
//                               className='max-h-full object-contain'
//                             />
//                           </div>
//                           <div className='flex justify-end gap-2 mt-4'>
//                             <Button
//                               onClick={() => handleVerify(dealer.id, false)}
//                               className='bg-green-600'
//                             >
//                               Approve & Verify
//                             </Button>
//                           </div>
//                         </DialogContent>
//                       </Dialog>
//                     ) : (
//                       <span className='text-gray-400 text-xs'>
//                         No ID Uploaded
//                       </span>
//                     )}
//                   </TableCell>

//                   <TableCell className='text-right'>
//                     <div className='flex justify-end gap-2'>
//                       {/* --- NEW: EDIT SUBSCRIPTION MODAL --- */}
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button
//                             size='icon'
//                             variant='outline'
//                             className='h-8 w-8'
//                             title='Edit Subscription'
//                           >
//                             <Edit size={14} className='text-blue-600' />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>
//                               Manual Subscription Update
//                             </DialogTitle>
//                           </DialogHeader>
//                           <form
//                             action={handleManualUpdate}
//                             className='space-y-4'
//                           >
//                             <input type='hidden' name='id' value={dealer.id} />

//                             <div className='space-y-2'>
//                               <label className='text-sm font-medium'>
//                                 Select Plan
//                               </label>
//                               <select
//                                 name='tier'
//                                 className='flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm'
//                                 defaultValue={dealer.subscriptionTier}
//                               >
//                                 <option value='FREE'>Free</option>
//                                 <option value='GOLD'>Gold</option>
//                                 <option value='PLATINUM'>Platinum</option>
//                               </select>
//                             </div>

//                             <div className='space-y-2'>
//                               <label className='text-sm font-medium'>
//                                 Months to Add
//                               </label>
//                               <Input
//                                 name='months'
//                                 type='number'
//                                 placeholder='e.g. 12 (1 Year)'
//                                 required
//                               />
//                             </div>

//                             <Button type='submit' className='w-full'>
//                               Update Plan
//                             </Button>
//                           </form>
//                         </DialogContent>
//                       </Dialog>

//                       {/* Verify Button */}
//                       <Button
//                         size='icon'
//                         variant='outline'
//                         className='h-8 w-8'
//                         onClick={() =>
//                           handleVerify(dealer.id, dealer.isVerified)
//                         }
//                         title={
//                           dealer.isVerified
//                             ? 'Revoke Verification'
//                             : 'Approve Dealer'
//                         }
//                       >
//                         {dealer.isVerified ? (
//                           <Ban size={14} className='text-orange-500' />
//                         ) : (
//                           <CheckCircle size={14} className='text-green-600' />
//                         )}
//                       </Button>

//                       {/* Suspend Button */}
//                       <Button
//                         size='icon'
//                         variant='outline'
//                         className='h-8 w-8'
//                         onClick={() =>
//                           handleSuspend(dealer.id, dealer.subscriptionStatus)
//                         }
//                         title={
//                           dealer.subscriptionStatus === 'SUSPENDED'
//                             ? 'Activate Account'
//                             : 'Suspend Account'
//                         }
//                       >
//                         <PowerOff
//                           size={14}
//                           className={
//                             dealer.subscriptionStatus === 'SUSPENDED'
//                               ? 'text-green-600'
//                               : 'text-red-500'
//                           }
//                         />
//                       </Button>

//                       {/* Delete Button */}
//                       <Button
//                         size='icon'
//                         variant='outline'
//                         className='h-8 w-8 hover:bg-red-50 border-red-200'
//                         onClick={() => handleDelete(dealer.id)}
//                       >
//                         <Trash2 size={14} className='text-red-600' />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// }

/**After premium look */
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  BadgeCheck,
  Trash2,
  Ban,
  CheckCircle,
  Search,
  PowerOff,
  Edit,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import {
  toggleVerification,
  deleteDealer,
  toggleSuspend,
  updateDealerPlan,
} from '@/actions/admin-dealers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // New Import

export default function DealerManager({
  initialDealers,
}: {
  initialDealers: any[];
}) {
  const [dealers, setDealers] = useState(initialDealers);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredDealers = dealers.filter((d) => {
    const matchesText =
      d.shopName.toLowerCase().includes(filter.toLowerCase()) ||
      d.user.email.toLowerCase().includes(filter.toLowerCase());
    let matchesCategory = true;
    if (statusFilter === 'GOLD')
      matchesCategory = d.subscriptionTier === 'GOLD';
    if (statusFilter === 'PLATINUM')
      matchesCategory = d.subscriptionTier === 'PLATINUM';
    if (statusFilter === 'FREE')
      matchesCategory = d.subscriptionTier === 'FREE';
    if (statusFilter === 'SUSPENDED')
      matchesCategory = d.subscriptionStatus === 'SUSPENDED';
    if (statusFilter === 'VERIFIED') matchesCategory = d.isVerified === true;
    if (statusFilter === 'PENDING')
      matchesCategory = !d.isVerified && d.subscriptionStatus !== 'SUSPENDED';

    return matchesText && matchesCategory;
  });

  // Handlers (Keep same logic)
  const handleVerify = async (id: string, currentStatus: boolean) => {
    setDealers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isVerified: !currentStatus } : d)),
    );
    await toggleVerification(id, currentStatus);
    toast.success(
      currentStatus ? 'Verified Badge removed' : 'Dealer Verified!',
    );
  };
  const handleSuspend = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    setDealers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, subscriptionStatus: newStatus } : d,
      ),
    );
    await toggleSuspend(id, currentStatus);
    toast.success(
      newStatus === 'SUSPENDED' ? 'Dealer Suspended' : 'Dealer Activated',
    );
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This deletes the USER account entirely.'))
      return;
    setDealers((prev) => prev.filter((d) => d.id !== id));
    await deleteDealer(id);
    toast.success('Dealer deleted.');
  };
  const handleManualUpdate = async (formData: FormData) => {
    const res = await updateDealerPlan(formData);
    if (res?.error) toast.error(res.error);
    else {
      toast.success(res.success);
      window.location.reload();
    }
  };

  return (
    <div className='space-y-6'>
      {/* HEADER CONTROLS */}
      <div className='flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border shadow-sm'>
        <div className='relative w-full md:w-72'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search dealers...'
            className='pl-10 border-gray-200 focus-visible:ring-purple-500'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Tabs defaultValue='ALL' onValueChange={setStatusFilter}>
          <TabsList className='h-9 bg-gray-100/50'>
            <TabsTrigger value='ALL'>All</TabsTrigger>
            <TabsTrigger
              value='PLATINUM'
              className='data-[state=active]:text-purple-700'
            >
              Platinum
            </TabsTrigger>
            <TabsTrigger
              value='GOLD'
              className='data-[state=active]:text-yellow-700'
            >
              Gold
            </TabsTrigger>
            <TabsTrigger
              value='VERIFIED'
              className='data-[state=active]:text-blue-700'
            >
              Verified
            </TabsTrigger>
            <TabsTrigger
              value='PENDING'
              className='data-[state=active]:text-orange-600'
            >
              New / Pending
            </TabsTrigger>
            <TabsTrigger
              value='SUSPENDED'
              className='data-[state=active]:text-red-700'
            >
              Suspended
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* TABLE CARD */}
      <div className='bg-white rounded-xl border shadow-sm overflow-hidden'>
        {filteredDealers.length === 0 ? (
          <div className='text-center py-20 text-gray-400'>
            <p>No dealers found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className='bg-gray-50/50'>
              <TableRow>
                <TableHead className='w-[300px]'>Dealer Profile</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className='text-right'>Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDealers.map((dealer) => (
                <TableRow
                  key={dealer.id}
                  className='hover:bg-gray-50/50 transition-colors'
                >
                  {/* PROFILE */}
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-10 w-10 border shadow-sm'>
                        <AvatarImage src={dealer.image || ''} />
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold'>
                          {dealer.shopName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-semibold text-gray-900 leading-none'>
                          {dealer.shopName}
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {dealer.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* PLAN */}
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`
                                ${
                                  dealer.subscriptionTier === 'PLATINUM'
                                    ? 'border-purple-200 bg-purple-50 text-purple-700'
                                    : dealer.subscriptionTier === 'GOLD'
                                      ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                      : 'border-gray-200 text-gray-600'
                                }
                            `}
                    >
                      {dealer.subscriptionTier}
                    </Badge>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    {dealer.subscriptionStatus === 'SUSPENDED' ? (
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                        <span className='h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse' />{' '}
                        Suspended
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                        <span className='h-1.5 w-1.5 rounded-full bg-green-600' />{' '}
                        Active
                      </span>
                    )}
                  </TableCell>

                  {/* VERIFICATION + ID */}
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {dealer.isVerified ? (
                        <div className='flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100'>
                          <BadgeCheck size={14} /> Verified
                        </div>
                      ) : (
                        <span className='text-xs text-gray-400 font-medium'>
                          Pending
                        </span>
                      )}

                      {/* ID PREVIEW (Icon Only) */}
                      {dealer.idCardImage && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-6 w-6 text-gray-400 hover:text-blue-600'
                            >
                              <Eye size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-lg'>
                            <DialogHeader>
                              <DialogTitle>ID Document</DialogTitle>
                            </DialogHeader>
                            <div className='bg-gray-100 p-4 rounded-lg flex justify-center'>
                              <img
                                src={dealer.idCardImage}
                                className='max-h-[400px] object-contain rounded'
                              />
                            </div>
                            <div className='flex justify-end mt-2'>
                              <Button
                                size='sm'
                                onClick={() => handleVerify(dealer.id, false)}
                                className='bg-green-600 hover:bg-green-700'
                              >
                                Approve & Verify
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>

                  {/* ACTIONS DROPDOWN (Clean!) */}
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-gray-500'
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Manual Edit Dialog Trigger needs special handling inside Dropdown */}
                        {/* For simplicity, we keep the Edit Dialog separate or refactor. */}
                        {/* Let's keep the Edit button separate for now or use Dialog inside DropdownItem (tricky) */}

                        <DropdownMenuItem
                          onClick={() =>
                            handleVerify(dealer.id, dealer.isVerified)
                          }
                        >
                          {dealer.isVerified ? (
                            <>
                              <Ban className='mr-2 h-4 w-4' /> Revoke Badge
                            </>
                          ) : (
                            <>
                              <CheckCircle className='mr-2 h-4 w-4' /> Verify
                              Dealer
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleSuspend(dealer.id, dealer.subscriptionStatus)
                          }
                        >
                          <PowerOff className='mr-2 h-4 w-4' />{' '}
                          {dealer.subscriptionStatus === 'SUSPENDED'
                            ? 'Activate'
                            : 'Suspend'}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(dealer.id)}
                          className='text-red-600'
                        >
                          <Trash2 className='mr-2 h-4 w-4' /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Keep Edit Button Visible for Quick Access */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8 text-blue-600 hover:bg-blue-50 ml-1'
                        >
                          <Edit size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Plan</DialogTitle>
                        </DialogHeader>
                        <form action={handleManualUpdate} className='space-y-4'>
                          <input type='hidden' name='id' value={dealer.id} />
                          <div className='space-y-2'>
                            <label className='text-sm font-medium'>Plan</label>
                            <select
                              name='tier'
                              className='flex h-10 w-full rounded-md border px-3'
                              defaultValue={dealer.subscriptionTier}
                            >
                              <option value='FREE'>Free</option>
                              <option value='GOLD'>Gold</option>
                              <option value='PLATINUM'>Platinum</option>
                            </select>
                          </div>
                          <div className='space-y-2'>
                            <label className='text-sm font-medium'>
                              Add Months
                            </label>
                            <Input
                              name='months'
                              type='number'
                              placeholder='12'
                              required
                            />
                          </div>
                          <Button type='submit' className='w-full'>
                            Update
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
