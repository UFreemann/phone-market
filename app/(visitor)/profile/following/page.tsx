import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import FollowingList from '@/components/visitor/FollowingList'; // Import Client Component

export default async function FollowingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { q, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // Build Filter
  const whereClause: any = {
    visitorId: session.user.id,
  };

  if (q) {
    whereClause.dealer = {
      shopName: { contains: q, mode: 'insensitive' },
    };
  }

  // Fetch Data & Count
  const [following, totalCount] = await Promise.all([
    prisma.follow.findMany({
      where: whereClause,
      include: {
        dealer: {
          select: {
            id: true,
            shopName: true,
            image: true,
            city: true,
            isVerified: true,
            subscriptionTier: true,
            _count: { select: { products: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.follow.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Following</h1>
        <p className='text-gray-500'>
          Shops you are subscribed to ({totalCount}).
        </p>
      </div>

      <FollowingList
        following={following}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
