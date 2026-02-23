'use server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function changeUserPassword(formData: FormData) {
  const session = await auth();
  // GENERIC CHECK (Allow any logged in user)
  if (!session || !session.user || !session.user.id) {
    return { error: 'Unauthorized' };
  }
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isMatch = await bcrypt.compare(currentPassword, user?.password || '');
  if (!isMatch) return { error: 'Incorrect current password' };

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: 'Password changed successfully' };
}
