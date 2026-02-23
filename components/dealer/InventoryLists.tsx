// 'use client';

// import { useState, useTransition } from 'react';
// import ProductRow from '@/components/dealer/ProductRow';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Button } from '@/components/ui/button';
// import { deleteBulkProducts } from '@/actions/manage-product';
// import { Trash2, X } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';

// type InventoryListProps = {
//   products: any[];
// };

// export default function InventoryList({ products }: InventoryListProps) {
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [isPending, startTransition] = useTransition();

//   // Handle Selection Logic
//   const toggleSelect = (id: string, isChecked: boolean) => {
//     if (isChecked) {
//       setSelectedIds((prev) => [...prev, id]);
//     } else {
//       setSelectedIds((prev) => prev.filter((item) => item !== id));
//     }
//   };

//   const toggleSelectAll = (isChecked: boolean) => {
//     if (isChecked) {
//       setSelectedIds(products.map((p) => p.id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleBulkDelete = () => {
//     startTransition(async () => {
//       await deleteBulkProducts(selectedIds);
//       setSelectedIds([]);
//     });
//   };

//   const isAllSelected =
//     products.length > 0 && selectedIds.length === products.length;

//   return (
//     <div className='space-y-4 relative pb-20'>
//       {products.length === 0 ? (
//         <p className='text-gray-500 text-center py-10'>
//           You have no phones listed.
//         </p>
//       ) : (
//         products.map((product) => (
//           <ProductRow
//             key={product.id}
//             id={product.id}
//             title={product.title}
//             price={Number(product.price)}
//             image={product.images[0]}
//             isSold={product.isSold}
//             views={0}
//             // --- THIS IS THE KEY PART ---
//             selectable={true}
//             isSelected={selectedIds.includes(product.id)}
//             onSelect={(checked) => toggleSelect(product.id, checked)}
//           />
//         ))
//       )}

//       {/* Floating Action Bar */}
//       {selectedIds.length > 0 && (
//         <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-gray-900 text-white rounded-lg shadow-2xl p-4 flex items-center justify-between z-50 animate-in slide-in-from-bottom-5'>
//           <div className='flex items-center gap-4'>
//             <div
//               className='flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition cursor-pointer'
//               onClick={() => toggleSelectAll(!isAllSelected)}
//             >
//               <Checkbox
//                 id='select-all'
//                 checked={isAllSelected}
//                 onCheckedChange={(c) => toggleSelectAll(c as boolean)}
//                 className='border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500'
//               />
//               <label
//                 htmlFor='select-all'
//                 className='cursor-pointer font-medium'
//               >
//                 {isAllSelected ? 'Deselect All' : 'Select All'}
//               </label>
//             </div>
//             <span className='font-bold text-blue-400'>
//               {selectedIds.length} Selected
//             </span>
//           </div>
//           <div className='flex items-center gap-3'>
//             <Button
//               variant='ghost'
//               size='sm'
//               className='text-gray-400 hover:text-white'
//               onClick={() => setSelectedIds([])}
//             >
//               <X size={18} /> Cancel
//             </Button>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant='destructive' size='sm' disabled={isPending}>
//                   <Trash2 size={16} className='mr-2' /> Delete Selected
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>
//                     Delete {selectedIds.length} phones?
//                   </AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This action cannot be undone.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>No, Keep</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleBulkDelete}
//                     className='bg-red-600'
//                   >
//                     Yes, Delete All
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useTransition } from 'react';
import ProductRow from '@/components/dealer/ProductRow';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteBulkProducts } from '@/actions/manage-product';
import { Trash2, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type InventoryListProps = {
  products: any[];
};

export default function InventoryList({ products }: InventoryListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // ... (Toggle Logic remains the same) ...
  const toggleSelect = (id: string, isChecked: boolean) => {
    if (isChecked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const toggleSelectAll = (isChecked: boolean) => {
    if (isChecked) setSelectedIds(products.map((p) => p.id));
    else setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    startTransition(async () => {
      await deleteBulkProducts(selectedIds);
      setSelectedIds([]);
    });
  };

  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;

  return (
    <div className='relative pb-24'>
      {/* Changed space-y-4 to divide-y. Removed gap. */}

      {products.length === 0 ? (
        <p className='text-gray-500 text-center py-10'>
          You have no phones listed.
        </p>
      ) : (
        <div className='divide-y divide-gray-100'>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              id={product.id}
              title={product.title}
              price={Number(product.price)}
              image={product.images[0]}
              isSold={product.isSold}
              views={0}
              selectable={true}
              isSelected={selectedIds.includes(product.id)}
              onSelect={(checked) => toggleSelect(product.id, checked)}
              // NEW: Tell row to look like a list item (flat), not a card
              variant='flat'
            />
          ))}
        </div>
      )}

      {/* Floating Action Bar (Keep same logic) */}
      {selectedIds.length > 0 && (
        <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-gray-900 text-white rounded-lg shadow-2xl p-4 flex items-center justify-between z-50 animate-in slide-in-from-bottom-5'>
          {/* ... (Keep floating bar content exactly as is) ... */}
          <div className='flex items-center gap-4'>
            <div
              className='flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition cursor-pointer'
              onClick={() => toggleSelectAll(!isAllSelected)}
            >
              <Checkbox
                id='select-all'
                checked={isAllSelected}
                onCheckedChange={(c) => toggleSelectAll(c as boolean)}
                className='border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500'
              />
              <label
                htmlFor='select-all'
                className='cursor-pointer font-medium'
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </label>
            </div>
            <span className='font-bold text-blue-400'>
              {selectedIds.length} Selected
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              className='text-gray-400 hover:text-white'
              onClick={() => setSelectedIds([])}
            >
              <X size={18} /> Cancel
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' size='sm' disabled={isPending}>
                  <Trash2 size={16} className='mr-2' /> Delete Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {selectedIds.length} phones?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, Keep</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className='bg-red-600'
                  >
                    Yes, Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}
