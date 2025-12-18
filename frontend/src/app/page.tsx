// frontend/src/app/page.tsx
import Link from 'next/link';
import { Bolt } from 'lucide-react'; 
import CapabilityCard from '@/components/CapabilityCard'; 
import LoginButton from '@/components/LoginButton'; 
import AccessConsoleButton from '@/components/AccessConsoleButton'; // <-- Now working!

// --- Color Palette ---
const RICH_BLACK = "#0a0a0a";
const NEON_VIOLET = "#9370db"; 
const ELECTRIC_TEAL = "#00ffff"; 
const CLEAN_WHITE = "#e0e0e0";
const DARK_SLATE = "#1f2937";


export default function LandingPage() {
    const currentYear = new Date().getFullYear(); 

    return (
        <div style={{ backgroundColor: RICH_BLACK, color: CLEAN_WHITE }} className="flex flex-col">
            
            {/* --- Navbar (Header) --- */}
            <header className="sticky top-0 z-40 w-full" style={{ backgroundColor: RICH_BLACK + 'e0', borderBottom: `1px solid ${CLEAN_WHITE}1a` }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    
                    {/* Logo with Bolt Icon */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Bolt className="w-6 h-6" style={{ color: ELECTRIC_TEAL }} /> 
                        <span className="text-2xl font-extrabold" style={{ color: NEON_VIOLET }}>
                            CognitoDesk
                        </span>
                    </Link>

                    {/* Navigation - Login CTA */}
                    <nav className="flex items-center space-x-6">
                        <LoginButton /> 
                    </nav>
                </div>
            </header>

            {/* FIRST SCROLL: Hero Section (Full Viewport Height) */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                {/* --- Hero Section: min-h-screen ensures it fills the viewport --- */}
                <section 
                    className="text-center flex flex-col items-center justify-center py-20"
                    style={{ minHeight: 'calc(100vh - 4rem)' }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                        <span style={{ color: NEON_VIOLET }}>Grounded Intelligence</span> For Enterprise AI
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 opacity-80 max-w-3xl mx-auto">
                        Leverage our Retrieval-Augmented Generation (RAG) platform to ensure your AI assistant provides accurate, context-aware responses every time.
                    </p>
                    
                    {/* Access Console CTA Button (The fixed component) */}
                    <AccessConsoleButton />
                </section>
            
            </main>

            {/* SECOND SCROLL CONTENT: Capabilities and Footer */}
            <div className="w-full">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h2 className="text-4xl font-bold text-center mb-12" style={{ color: ELECTRIC_TEAL }}>
                        Key Admin Capabilities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        <CapabilityCard 
                            icon="BookOpen"
                            title="Knowledge Base Editor"
                            description="Upload new documents, edit existing FAQs, and monitor AI training status in real-time."
                        />
                        <CapabilityCard 
                            icon="MessageCircle"
                            title="Agent Routing & Setup"
                            description="Configure live chat queues, assign agents to channels, and manage escalation rules."
                        />
                        <CapabilityCard 
                            icon="BarChart"
                            title="Comprehensive Analytics"
                            description="View user engagement, agent efficiency, bot deflection rates, and performance reports."
                        />
                        <CapabilityCard 
                            icon="Settings"
                            title="System Integrations"
                            description="Connect CognitoDesk with external systems like CRM, Slack, and billing services."
                        />
                    </div>
                </section>

                {/* --- Footer Section --- */}
                <footer 
                    className="w-full py-4 text-center text-sm"
                    style={{ backgroundColor: RICH_BLACK, borderTop: `1px solid ${CLEAN_WHITE}1a`, color: CLEAN_WHITE + '80' }}
                >
                    &copy; {currentYear} CognitoDesk. All Rights Reserved!
                </footer>
            </div>
        </div>
    );
}