'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginAction(formData: FormData) {
  try {
    // We set redirect: false so we can control the UI on the client side
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    // If we get here without error, it worked!
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid sign in credentials!' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    throw error;
  }
}
