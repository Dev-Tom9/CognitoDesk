// frontend/src/app/layout.tsx
import './globals.css'; // Your global styles
import NextAuthSessionProvider from '@/components/NextAuthSessionProvider'; // <-- The provider you need

export const metadata = {
    title: 'CognitoDesk - RAG Admin Console',
    description: 'AI-Powered Knowledge Management Platform',
};

// Define the root color palette for the whole application
const RICH_BLACK = "#0a0a0a"; 

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ backgroundColor: RICH_BLACK }}>
                <NextAuthSessionProvider>
                    {children}
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}