// frontend/src/components/NextAuthSessionProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// This component wraps the entire app to provide the NextAuth context
export default function NextAuthSessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}