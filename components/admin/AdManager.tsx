// 'use client';

// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch'; // Install: npx shadcn@latest add switch
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { toggleAdStatus } from '@/actions/admin-ads';
// import { Badge } from '@/components/ui/badge';
// import { Search } from 'lucide-react';

// export default function AdManager({
//   initialProducts,
// }: {
//   initialProducts: any[];
// }) {
//   const [products, setProducts] = useState(initialProducts);
//   const [filter, setFilter] = useState('');

//   const filtered = products.filter(
//     (p) =>
//       p.title.toLowerCase().includes(filter.toLowerCase()) ||
//       p.dealer.shopName.toLowerCase().includes(filter.toLowerCase()),
//   );

//   const handleToggle = async (id: string, currentStatus: boolean) => {
//     // Optimistic Update
//     setProducts((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, isAd: !currentStatus } : p)),
//     );

//     await toggleAdStatus(id, !currentStatus);
//   };

//   return (
//     <div className='space-y-4'>
//       <div className='relative'>
//         <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
//         <Input
//           placeholder='Search products or dealers...'
//           className='pl-10 bg-white'
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         />
//       </div>

//       <div className='bg-white rounded-md border overflow-hidden'>
//         {/* NO RESULTS STATE */}
//         {filtered.length === 0 ? (
//           <div className='text-center py-12 text-gray-500'>
//             <p className='font-medium'>No products found.</p>
//             <p className='text-sm'>
//               We couldn't find any item or dealer matching "{filter}".
//             </p>
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Dealer</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Sponsored?</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filtered.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell className='font-medium'>
//                     {product.title}
//                     {product.isAd && (
//                       <Badge className='ml-2 bg-yellow-500 text-[10px]'>
//                         Ad
//                       </Badge>
//                     )}
//                   </TableCell>
//                   <TableCell>{product.dealer.shopName}</TableCell>
//                   <TableCell>
//                     GH₵ {Number(product.price).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={product.isAd}
//                       onCheckedChange={() =>
//                         handleToggle(product.id, product.isAd)
//                       }
//                     />
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toggleAdStatus } from '@/actions/admin-ads';
import { Badge } from '@/components/ui/badge';
import { Search, Megaphone } from 'lucide-react';

export default function AdManager({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('');

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(filter.toLowerCase()) ||
      p.dealer.shopName.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAd: !currentStatus } : p)),
    );
    await toggleAdStatus(id, !currentStatus);
  };

  return (
    <div className='space-y-6'>
      {/* Search Header */}
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
        <Input
          placeholder='Search inventory to promote...'
          className='pl-10 bg-white shadow-sm border-gray-200'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className='bg-white rounded-xl border shadow-sm overflow-hidden'>
        {filtered.length === 0 ? (
          <div className='text-center py-20 text-gray-400'>
            <Megaphone className='mx-auto h-10 w-10 mb-2 opacity-20' />
            <p className='font-medium'>No products found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className='bg-gray-50/50'>
              <TableRow>
                <TableHead className='w-[300px]'>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Dealer</TableHead>
                <TableHead className='text-center'>Promotion Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow
                  key={product.id}
                  className='hover:bg-gray-50/50 transition-colors'
                >
                  {/* PRODUCT */}
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 bg-gray-100 rounded border overflow-hidden flex-shrink-0'>
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            className='h-full w-full object-cover'
                          />
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-gray-900 line-clamp-1'>
                          {product.title}
                        </span>
                        {product.isAd && (
                          <span className='flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 w-fit px-1.5 rounded mt-0.5'>
                            <Megaphone size={10} /> SPONSORED
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* PRICE */}
                  <TableCell className='font-medium text-blue-600'>
                    GH₵ {Number(product.price).toLocaleString()}
                  </TableCell>

                  {/* DEALER */}
                  <TableCell className='text-gray-600 text-sm'>
                    {product.dealer.shopName}
                  </TableCell>

                  {/* TOGGLE */}
                  <TableCell className='text-center'>
                    <div className='flex justify-center'>
                      <Switch
                        checked={product.isAd}
                        onCheckedChange={() =>
                          handleToggle(product.id, product.isAd)
                        }
                        className='data-[state=checked]:bg-yellow-500'
                      />
                    </div>
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
