'use server';

import prisma from '@/lib/db';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  // Security: Even if user doesn't exist, we usually return "Success"
  // so hackers can't fish for valid emails. But for this project,
  // we will be honest to help you test.
  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  // Generate Token & Send Email
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: 'Reset email sent!' };
}
