import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"; 

// 🛑 Load authorized emails from the secure environment variable
// This pulls the comma-separated emails from .env.local
const adminEmailsString = process.env.AUTHORIZED_ADMIN_EMAILS || '';
const AUTHORIZED_ADMINS = adminEmailsString
    .split(',')
    .map(email => email.trim().toLowerCase()) // Clean and normalize emails for checking
    .filter(email => email.length > 0); // Remove any empty strings

// Ensure required environment variables are present
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
    throw new Error('Missing NextAuth required environment variables. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET.');
}

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    // Use JWT strategy for stateless session management
    session: {
        strategy: 'jwt',
    },
    
    // Redirect all errors to a dedicated error page
    pages: {
        error: '/unauthorized', 
    },
    
    callbacks: {
        async signIn({ user }) {
            // Check if the user is authorized (email exists in the AUTHORIZED_ADMINS list)
            if (user.email && AUTHORIZED_ADMINS.includes(user.email.toLowerCase())) {
                console.log(`✅ Access granted for: ${user.email}`);
                
                // ✅ FINAL FIX: Return true to signal success and use the client's callbackUrl ('/console').
                return true; 
            } else {
                console.log(`🚫 Access denied for: ${user.email}`);
                // Unauthorized -> Deny session, redirect to the root page ('/')
                return '/'; 
            }
        },

        async jwt({ token, user }) {
            // Add custom properties to the JWT token
            if (user) {
                // Determine if the user is an admin and store it in the token
                token.isAdmin = user.email ? AUTHORIZED_ADMINS.includes(user.email.toLowerCase()) : false;
            }
            return token;
        },

        async session({ session, token }) {
            // Add custom properties from the JWT token to the session object passed to the client
            if (session.user && token.isAdmin !== undefined) {
                // Ensure the client session object gets the isAdmin flag
                // We use 'as any' since we are extending the default session type
                (session.user as any).isAdmin = token.isAdmin;
            }
            return session;
        },
    }
};

const handler = NextAuth(authOptions);

// Required exports for the Next.js App Router
export { handler as GET, handler as POST };