'use server';

import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function newPassword(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  if (!token) return { error: 'Missing token.' };
  if (!password) return { error: 'Password is required.' };

  // 1. Find the token in DB
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  // If token is missing, we treat it as EXPIRED/INVALID to show the Orange Card
  if (!existingToken) {
    return { error: 'EXPIRED' };
  }

  // 2. Check Date Expiry
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'EXPIRED' };
  }

  // 3. Find User associated with this token
  const userToUpdate = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!userToUpdate) {
    return { error: 'User does not exist!' };
  }

  // 4. Hash the new password
  const newHashedPassword = await bcrypt.hash(password, 10);

  // 5. Update User in DB
  await prisma.user.update({
    where: { id: userToUpdate.id },
    data: { password: newHashedPassword },
  });

  // 6. Delete Token (so it can't be used again)
  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Password updated successfully!' };
}
