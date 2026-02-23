import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // Import the config
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Spread the config here
  session: {
    strategy: 'jwt',
    maxAge: 900, //15mins / 24*60*60/24 Hours (in seconds). Change to 3600 for 1 hour.
  },

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials.email as string;
          const password = credentials.password as string;

          console.log(`Attempting login for: ${email}`); // DEBUG LOG

          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log('User not found in DB'); // DEBUG LOG
            throw Error('User not found'); //return null;
          }

          if (!user.emailVerified) {
            throw new Error(
              'Please verify your email address before logging in.',
            );
          }

          const isMatch = await compare(password, user.password);

          if (!isMatch) {
            console.log('Password did not match'); // DEBUG LOG
            return null;
          }

          console.log('Login Successful!'); // DEBUG LOG
          return user;
        } catch (error) {
          console.error('Auth Error:', error);
          return null;
        }
      },
    }),
  ],

  // ----------------------------------------------------------------
  // ADD THIS SECTION TO FIX THE "UNDEFINED ID" ERROR
  // ----------------------------------------------------------------
  callbacks: {
    // 1. When the JWT (Token) is created, save the User ID into it
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    // 2. When the Session is checked, copy the ID from Token -> Session
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as 'ADMIN' | 'DEALER' | 'VISITOR';
      }
      return session;
    },
  },
});
