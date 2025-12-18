// frontend/src/next-auth.d.ts

import 'next-auth';

// Extend the built-in Session type
declare module 'next-auth' {
  /**
   * Returned by useSession, getSession and getServerSession
   */
  interface Session {
    user: {
      /** The user's id. */
      id?: string;
      /** Custom property to check if the user is an administrator. */
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}

// Extend the built-in JWT type
declare module 'next-auth/jwt' {
  /**
   * Returned by the jwt callback
   */
  interface JWT {
    /** Custom property to check if the user is an administrator. */
    isAdmin: boolean;
  }
}