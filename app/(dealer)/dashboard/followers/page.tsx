/**Before premium look */
// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Users, Calendar } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// export default async function FollowersPage() {
//   const session = await auth();
//   if (!session || !session.user) redirect('/login');

//   // 1. Get Dealer ID
//   const dealer = await prisma.dealerProfile.findUnique({
//     where: { userId: session.user.id },
//   });

//   if (!dealer) redirect('/');

//   // 2. Fetch Followers (Newest first)
//   // We join with the 'User' table to get the follower's name/email/image
//   const followers = await prisma.follow.findMany({
//     where: { dealerId: dealer.id },
//     include: {
//       visitor: {
//         select: {
//           name: true,
//           email: true,
//           // If you have a user image field, add it here.
//           // Defaulting to name for initials.
//         },
//       },
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   return (
//     <div className='max-w-6xl mx-auto'>
//       <div className='flex items-center justify-between mb-6'>
//         <h1 className='text-2xl font-bold'>My Followers</h1>
//         <span className='text-gray-500 text-sm'>{followers.length} total</span>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className='flex items-center gap-2'>
//             <Users className='h-5 w-5 text-purple-600' />
//             Community
//           </CardTitle>
//           <p className='text-sm text-gray-500'>
//             People who subscribed to get updates when you post new phones.
//           </p>
//         </CardHeader>
//         <CardContent>
//           {followers.length === 0 ? (
//             <div className='text-center py-16 text-gray-500'>
//               <div className='bg-purple-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4'>
//                 <Users className='h-8 w-8 text-purple-300' />
//               </div>
//               <h3 className='text-lg font-medium text-gray-900'>
//                 No followers yet
//               </h3>
//               <p className='text-sm mt-1 max-w-sm mx-auto'>
//                 When visitors view your phones, they can follow you to get
//                 notified about your new deals.
//               </p>
//             </div>
//           ) : (
//             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//               {followers.map((follow) => (
//                 <div
//                   key={follow.id}
//                   className='flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors'
//                 >
//                   <Avatar className='h-10 w-10'>
//                     {/* Use User image if exists, else initials */}
//                     <AvatarFallback className='bg-purple-100 text-purple-700 font-bold'>
//                       {follow.visitor.name
//                         ? follow.visitor.name.charAt(0).toUpperCase()
//                         : 'U'}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className='flex-1 min-w-0'>
//                     <p className='text-sm font-semibold text-gray-900 truncate'>
//                       {follow.visitor.name || 'Anonymous User'}
//                     </p>
//                     <p className='text-xs text-gray-500 truncate'>
//                       {follow.visitor.email}
//                     </p>
//                   </div>

//                   <div
//                     className='text-xs text-gray-400 flex items-center gap-1'
//                     title='Followed date'
//                   >
//                     <Calendar size={12} />
//                     {formatDistanceToNow(new Date(follow.createdAt))}
//                   </div>
//                 </div>
//               ))}
//             </div>
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, Share2, HeartHandshake } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function FollowersPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  // 1. Get Dealer ID
  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer) redirect('/');

  // 2. Fetch Followers
  const followers = await prisma.follow.findMany({
    where: { dealerId: dealer.id },
    include: {
      visitor: {
        select: {
          name: true,
          email: true,
          // image: true, // Assuming user model has image
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* 1. HEADER & STATS */}
      <div className='flex flex-col md:flex-row justify-between items-end gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Community</h1>
          <p className='text-gray-500 mt-1'>
            Manage your subscriber base and potential customers.
          </p>
        </div>

        {/* Quick Stat Card */}
        <div className='bg-white border border-purple-100 shadow-sm rounded-xl px-6 py-3 flex items-center gap-4'>
          <div className='bg-purple-100 p-2 rounded-full text-purple-600'>
            <Users size={20} />
          </div>
          <div>
            <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>
              Total Followers
            </p>
            <p className='text-2xl font-black text-gray-900 leading-none'>
              {followers.length}
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT CARD */}
      <Card className='border-gray-200 shadow-sm overflow-hidden'>
        <CardHeader className='bg-gray-50/50 border-b py-4'>
          <CardTitle className='text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2'>
            Subscriber List
          </CardTitle>
        </CardHeader>

        <CardContent className='p-6'>
          {followers.length === 0 ? (
            // EMPTY STATE
            <div className='text-center py-20 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200'>
              <div className='bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm'>
                <HeartHandshake className='h-10 w-10 text-purple-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                No followers yet
              </h3>
              <p className='text-gray-500 max-w-md mx-auto mt-2 mb-6'>
                Your followers get notified via email whenever you post a new
                phone. Share your profile to start building your audience!
              </p>
              <Link href={`/shop/${dealer.id}`} target='_blank'>
                <Button className='bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200'>
                  <Share2 className='mr-2 h-4 w-4' /> View Public Profile
                </Button>
              </Link>
            </div>
          ) : (
            // FOLLOWER GRID
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {followers.map((follow) => (
                <div
                  key={follow.id}
                  className='group relative flex items-start gap-4 p-4 border rounded-xl bg-white hover:border-purple-300 hover:shadow-md transition-all duration-300'
                >
                  {/* Avatar */}
                  <Avatar className='h-12 w-12 border-2 border-white shadow-sm'>
                    {/* <AvatarImage src={follow.visitor.image || ''} /> */}
                    <AvatarFallback className='bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 font-bold'>
                      {follow.visitor.name
                        ? follow.visitor.name.charAt(0).toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className='flex-1 min-w-0 pt-1'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='text-sm font-bold text-gray-900 truncate'>
                          {follow.visitor.name || 'Anonymous User'}
                        </p>
                        <p className='text-xs text-gray-500 truncate'>
                          {follow.visitor.email}
                        </p>
                      </div>
                    </div>

                    {/* Join Date Badge */}
                    <div className='mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 text-[10px] font-medium text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors'>
                      <Calendar size={10} />
                      <span>
                        Followed{' '}
                        {formatDistanceToNow(new Date(follow.createdAt))} ago
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
