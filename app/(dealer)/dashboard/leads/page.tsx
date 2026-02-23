/**Before premium look */
// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { MessageSquare } from 'lucide-react'; // Added Icons
// import LeadRow from '@/components/dealer/LeadRow';
// import ClearLeadsButton from '@/components/dealer/ClearLeadsButton';

// export default async function LeadsPage() {
//   const session = await auth();
//   if (!session || !session.user) redirect('/login');

//   // 1. Get Dealer ID
//   const dealer = await prisma.dealerProfile.findUnique({
//     where: { userId: session.user.id },
//   });

//   if (!dealer) redirect('/');

//   // 2. Fetch Leads (Newest first)
//   // 2. Fetch Leads
//   const rawLeads = await prisma.lead.findMany({
//     where: { dealerId: dealer.id },
//     include: {
//       product: { select: { title: true, price: true, images: true } },
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   // 3. TRANSFORM DATA (Decimal -> Number)
//   const leads = rawLeads.map((lead) => ({
//     ...lead,
//     product: lead.product
//       ? {
//           ...lead.product,
//           price: Number(lead.product.price), // <--- CONVERSION HERE
//         }
//       : null,
//   }));

//   return (
//     <div className='max-w-6xl mx-auto'>
//       {/* HEADER ROW */}
//       <div className='flex justify-between items-end mb-6'>
//         <h1 className='text-2xl font-bold'>Leads & Activity</h1>

//         {/* NEW BUTTON */}
//         <ClearLeadsButton disabled={leads.length === 0} />
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className='flex items-center gap-2'>
//             <MessageSquare className='h-5 w-5 text-blue-600' />
//             Recent Contacts
//           </CardTitle>
//           <p className='text-sm text-gray-500'>
//             People who clicked "Show Contact" or "WhatsApp" on your items.
//           </p>
//         </CardHeader>
//         <CardContent>
//           {leads.length === 0 ? (
//             <div className='text-center py-12 text-gray-500'>
//               <p>No leads yet.</p>
//               <p className='text-sm'>Promote your phones to get more clicks!</p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Phone / Item</TableHead>
//                   <TableHead>Interest Type</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead className='text-right'>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {leads.map((lead) => (
//                   <LeadRow key={lead.id} lead={lead} />
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

/**After premium look */
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageSquare, PhoneCall, History } from 'lucide-react';
import LeadRow from '@/components/dealer/LeadRow';
import ClearLeadsButton from '@/components/dealer/ClearLeadsButton';

export default async function LeadsPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer) redirect('/');

  const rawLeads = await prisma.lead.findMany({
    where: { dealerId: dealer.id },
    include: {
      product: { select: { title: true, price: true, images: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const leads = rawLeads.map((lead) => ({
    ...lead,
    product: lead.product
      ? { ...lead.product, price: Number(lead.product.price) }
      : null,
  }));

  // Calculate Quick Stats
  const whatsappCount = leads.filter((l) => l.type === 'WHATSAPP').length;
  const callCount = leads.length - whatsappCount;

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* 1. HEADER & STATS */}
      <div className='flex flex-col md:flex-row justify-between items-end gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Customer Leads</h1>
          <p className='text-gray-500 mt-1'>
            Track who is interested in your inventory.
          </p>
        </div>
        <ClearLeadsButton disabled={leads.length === 0} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          title='Total Interactions'
          value={leads.length}
          icon={<History className='text-blue-600' />}
        />
        <StatCard
          title='WhatsApp Chats'
          value={whatsappCount}
          icon={<MessageSquare className='text-green-600' />}
        />
        <StatCard
          title='Number Views'
          value={callCount}
          icon={<PhoneCall className='text-purple-600' />}
        />
      </div>

      {/* 2. LEADS TABLE CARD */}
      <Card className='shadow-sm border-gray-200 overflow-hidden'>
        <CardHeader className='bg-gray-50/50 border-b py-4'>
          <CardTitle className='text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2'>
            Recent Activity Log
          </CardTitle>
        </CardHeader>

        <CardContent className='p-0'>
          {leads.length === 0 ? (
            <div className='text-center py-20'>
              <div className='bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <MessageSquare className='h-8 w-8 text-gray-300' />
              </div>
              <h3 className='text-lg font-medium text-gray-900'>
                No leads yet
              </h3>
              <p className='text-sm text-gray-500 mt-1'>
                Promote your phones to start getting messages!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className='bg-gray-50'>
                <TableRow>
                  <TableHead className='w-[300px]'>Product</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className='shadow-sm hover:shadow-md transition-shadow'>
      <CardContent className='p-5 flex items-center justify-between'>
        <div>
          <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
            {title}
          </p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
        </div>
        <div className='p-3 bg-gray-50 rounded-full border border-gray-100'>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
