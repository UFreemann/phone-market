import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'ADMIN' | 'DEALER' | 'VISITOR';
  }

  interface Session {
    user: {
      role: 'ADMIN' | 'DEALER' | 'VISITOR';
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'DEALER' | 'VISITOR';
    sub: string;
  }
}
