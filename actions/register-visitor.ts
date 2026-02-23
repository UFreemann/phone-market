'use server';

import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/mail';

export async function registerVisitor(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string; // Optional but good to have

  if (!email || !password) return { error: 'Missing fields' };

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { error: 'This email is already registered.' };

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  // Create User (Role defaults to VISITOR)
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'VISITOR',
      verificationToken,
    },
  });

  // Send Email
  await sendVerificationEmail(email, verificationToken);

  return { success: true };
}
