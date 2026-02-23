// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        // CHANGE THIS: Instead of return false, redirect manually with the error
        return Response.redirect(
          new URL('/login?error=session_expired', nextUrl),
        ); // Redirect unauthenticated users to login page
      }
      return true;
    },
    // We also need to persist the ID here
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [], // Providers added later in auth.ts
} satisfies NextAuthConfig;
