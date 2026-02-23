import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Replace this with your actual Admin Email
  const email = 'senyoebenezer8@gmail.com';

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found!');
    return;
  }

  console.log('Found User ID:', user.id);

  // 2. Create Profile
  try {
    const profile = await prisma.dealerProfile.update({
      where: { userId: user.id }, // Find by User ID
      data: {
        userId: user.id,
        shopName: 'PhoneMarket Official',
        phone: '0000000000',
        city: 'Headquarters',
        subscriptionTier: 'PLATINUM',
        subscriptionStatus: 'ACTIVE',
        isVerified: true,
        isOfficialStore: true,
      },
    });
    console.log('Success! Profile created:', profile);
  } catch (e) {
    console.error('Error creating profile:', e);
  }
}

main();
