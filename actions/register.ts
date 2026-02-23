'use server';

import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/mail';
import { sendAdminAlert } from '@/actions/send-sms';

export async function registerAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const shopName = formData.get('shopName') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;

    // 1. Robust Validation: Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'This email is already registered.' };
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate Verification Token
    const verificationToken = uuidv4();

    // 4. Create User (But keep emailVerified as NULL)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'DEALER',
        verificationToken: verificationToken, // Save the token
        dealerProfile: {
          create: {
            shopName,
            phone,
            city,
            subscriptionTier: 'FREE',
          },
        },
      },
    });

    // Send SMS
    await sendAdminAlert(shopName);

    // 5. SEND EMAIL SIMULATION
    // In production, you would call: sendEmail(email, token);
    // console.log('------------------------------------------------');
    // console.log(`✉️ EMAIL SENT TO: ${email}`);
    // console.log(
    //   `🔑 VERIFICATION LINK: http://localhost:3000/verify?token=${verificationToken}`
    // );
    // console.log('------------------------------------------------');
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      // Don't crash the whole registration if email fails,
      // but log it so you know.
      console.error('Failed to send email:', emailError);

      // Optional: You could delete the user here if you want to force them to retry
      // await prisma.user.delete({ where: { email } });
      // return { error: "Could not send verification email." };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
