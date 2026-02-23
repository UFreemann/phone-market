import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  // 15 Minutes Expiration
  // 15 mins * 60 seconds * 1000 milliseconds
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  // 1. ALWAYS Delete any existing token for this email
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // 2. Create a fresh token
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
