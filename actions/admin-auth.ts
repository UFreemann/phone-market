'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function changeAdminPassword(formData: FormData) {
  const session = await auth();

  // 1. Strict Security Check
  if (!session || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  // 2. Verify Old Password
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isMatch = await bcrypt.compare(
    currentPassword,
    adminUser?.password || '',
  );
  if (!isMatch) return { error: 'Incorrect current password.' };

  // 3. Update to New Password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: 'Password updated successfully.' };
}
