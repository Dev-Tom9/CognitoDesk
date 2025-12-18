// frontend/src/app/console/page.tsx
'use client'; 

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; 
import React, { useState, useEffect } from 'react'; 
import WelcomeModal from '@/components/WelcomeModal'; 
import { StatCard } from '@/components/StatCard'; 
import { useCountingAnimation } from '@/hooks/useCountingAnimation'; 

import {
    LayoutDashboard, 
    BookOpen,         
    MessageSquare,    
    BarChart3,        
    Settings,         
    User,             
    LogOut,           
    Bolt,             
} from 'lucide-react';

// --- Color Palette ---
const RICH_BLACK = "#0a0a0a";
const NEON_VIOLET = "#9370db"; 
const ELECTRIC_TEAL = "#00ffff"; 
const CLEAN_WHITE = "#e0e0e0";
const DARK_SLATE = "#1f2937";
const SIDEBAR_BG = "#131313"; 

// Define the Sidebar Navigation Items (same as before)
const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/console' },
    { name: 'KB Editor', icon: BookOpen, href: '/console/kb-editor' },
    { name: 'Agent Routing', icon: MessageSquare, href: '/console/agent-routing' },
    { name: 'Analytics', icon: BarChart3, href: '/console/analytics' },
    { name: 'System Integrations', icon: Settings, href: '/console/settings' },
];

// Helper Component for Sidebar Links (same as before)
const SidebarLink = ({ name, icon: Icon, href }: typeof navItems[0]) => (
    <Link 
        href={href} 
        className={`flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 
                    ${name === 'Dashboard' ? 'bg-white/10' : 'hover:bg-white/10'}`} 
        style={{ color: CLEAN_WHITE }}
    >
        <Icon className="w-5 h-5" style={{ color: NEON_VIOLET }} />
        <span>{name}</span>
    </Link>
);


// Wrapper Component for Animation and Hydration Safety (same as before)
interface AnimatedStatCardProps {
    title: string;
    finalValue: number;
    unit?: string;
    valueColor: string;
    style: React.CSSProperties;
    shouldAnimate: boolean; 
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
    title, finalValue, unit, valueColor, style, shouldAnimate
}) => {
    const [isMounted, setIsMounted] = useState(false); 
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const valueToAnimate = shouldAnimate ? finalValue : 0; 
    const animatedValue = useCountingAnimation(valueToAnimate); 
    
    let displayValue = shouldAnimate ? animatedValue : finalValue;

    let finalDisplayValue: string | number = displayValue;
    
    if (title.includes("Rate") && typeof displayValue === 'number') {
        if (displayValue < finalValue) {
            finalDisplayValue = displayValue.toFixed(0); 
        } else {
            finalDisplayValue = finalValue.toFixed(1); 
        }
    }
    
    if (!isMounted) {
         finalDisplayValue = finalValue; 
         if (title.includes("Rate")) finalDisplayValue = finalValue.toFixed(1);
    }
    
    return (
        <StatCard 
            title={title} 
            displayValue={finalDisplayValue} 
            unit={unit}
            valueColor={valueColor}
            style={style}
        />
    );
};


export default function ConsolePage() { 
    const { data: session, status } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(true); 
    const [startAnimation, setStartAnimation] = useState(false); 
    const [isSignOutHovered, setIsSignOutHovered] = useState(false);
    
    // Check if modal has been seen using sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('welcomeModalSeen') === 'true') {
            setIsModalOpen(false);
            // Start animation immediately if modal is skipped
            setStartAnimation(true); 
        } else {
            // If the modal should open, start animation only after dismissal (in handleModalClose)
            setStartAnimation(false);
        }
    }, []); 

    const isAuthenticated = status === 'authenticated' && session != null && session.user?.isAdmin;

    // Function to handle modal close and start animation
    const handleModalClose = () => {
        setIsModalOpen(false);
        
        // 💡 NEW: Set flag in sessionStorage so modal doesn't reappear on navigation
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('welcomeModalSeen', 'true');
        }

        // Start animation after a short delay
        setTimeout(() => setStartAnimation(true), 50); 
    };
    
    // --- AUTHENTICATION & LOADING STATES (same as before) ---
    if (status === 'loading') {
        return (
             <div className="min-h-screen flex items-center justify-center text-xl" style={{ backgroundColor: RICH_BLACK, color: ELECTRIC_TEAL }}>
                Loading Console...
            </div>
        );
    }
    
    if (!isAuthenticated) {
        window.location.href = '/'; 
        return null;
    }
    
    const currentSession = session!;
    const userName = currentSession.user.name || currentSession.user.email;
    const userEmail = currentSession.user.email;

    // Sign Out Button Style (Interactive) (same as before)
    const signOutButtonStyle = {
        backgroundColor: 'transparent',
        color: CLEAN_WHITE,
        border: `1px solid ${NEON_VIOLET}`,
        
        transition: 'all 0.3s ease-in-out',
        
        transform: isSignOutHovered ? 'translateY(-1.5px)' : 'translateY(0)',
        
        boxShadow: isSignOutHovered 
            ? `0 0 8px ${NEON_VIOLET}90, 0 3px 5px rgba(0, 0, 0, 0.4)`
            : 'none',
        
        '& > span': { color: CLEAN_WHITE },
    };

    return (
        <div style={{ backgroundColor: RICH_BLACK, color: CLEAN_WHITE }} className="min-h-screen flex">
            
            {/* MODAL */}
            {isModalOpen && (
                <WelcomeModal 
                    userName={userName} 
                    onClose={handleModalClose} 
                />
            )}

            {/* --- Main Content Area Wrapper (same as before) --- */}
            <div className={`flex flex-1 transition-all duration-300 ${isModalOpen ? 'blur-sm pointer-events-none' : 'blur-none'}`}>
                
                {/* --- Left Sidebar (same as before) --- */}
                <aside 
                    className="w-64 flex flex-col justify-between p-4 border-r"
                    style={{ backgroundColor: SIDEBAR_BG, borderColor: `${CLEAN_WHITE}1a` }}
                >
                    <div>
                        {/* Logo/Header */}
                        <div className="flex items-center space-x-2 py-4 mb-6">
                            <Bolt className="w-6 h-6" style={{ color: ELECTRIC_TEAL }} />
                            <span className="text-xl font-extrabold" style={{ color: NEON_VIOLET }}>
                                CognitoDesk
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <SidebarLink key={item.name} {...item} />
                            ))}
                        </nav>
                    </div>

                    {/* --- Bottom User Profile & Sign Out Section --- */}
                    <div className="pt-4 border-t" style={{ borderColor: `${CLEAN_WHITE}1a` }}>
                        
                        {/* User Profile */}
                        <div className="flex items-center space-x-3 p-3 mb-2 rounded-lg" style={{ backgroundColor: DARK_SLATE }}>
                            <User className="w-8 h-8 rounded-full p-1" style={{ color: NEON_VIOLET, backgroundColor: `${NEON_VIOLET}20` }} />
                            <div className="leading-snug">
                                <p className="text-sm font-semibold">{userName}</p>
                                <p className="text-xs opacity-60">Admin</p>
                            </div>
                        </div>

                        {/* Sign Out Button */}
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })} 
                            onMouseEnter={() => setIsSignOutHovered(true)} 
                            onMouseLeave={() => setIsSignOutHovered(false)} 
                            className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                            style={signOutButtonStyle} 
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* --- Main Content Area (Dashboard View) --- */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <header className="mb-8 pb-4 border-b" style={{ borderColor: `${CLEAN_WHITE}1a` }}>
                        <h1 className="text-3xl font-extrabold" style={{ color: ELECTRIC_TEAL }}>
                            Dashboard Overview
                        </h1>
                        <p className="text-sm opacity-70 mt-1">
                            Welcome to the CognitoDesk Admin Console. Manage your capabilities below.
                        </p>
                    </header>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <AnimatedStatCard 
                            title="Total User Sessions" 
                            finalValue={1452} 
                            shouldAnimate={startAnimation} 
                            unit=""
                            valueColor={ELECTRIC_TEAL}
                            style={{ backgroundColor: DARK_SLATE, border: `1px dashed ${NEON_VIOLET}50` }} 
                        />
                        <AnimatedStatCard 
                            title="Bot Deflection Rate" 
                            finalValue={87.5} 
                            shouldAnimate={startAnimation} 
                            unit="%"
                            valueColor={ELECTRIC_TEAL}
                            style={{ backgroundColor: DARK_SLATE, border: `1px dashed ${NEON_VIOLET}50` }} 
                        />
                        <AnimatedStatCard 
                            title="Knowledge Base Health" 
                            finalValue={100} 
                            shouldAnimate={startAnimation} 
                            unit=""
                            valueColor={NEON_VIOLET}
                            style={{ backgroundColor: DARK_SLATE, border: `1px dashed ${NEON_VIOLET}50` }} 
                        />
                        <AnimatedStatCard 
                            title="Avg. Agent Response Time" 
                            finalValue={3} 
                            shouldAnimate={startAnimation} 
                            unit="s"
                            valueColor={ELECTRIC_TEAL}
                            style={{ backgroundColor: DARK_SLATE, border: `1px dashed ${NEON_VIOLET}50` }} 
                        />
                    </div>

                    <section className="mt-12 p-6 rounded-xl" style={{ backgroundColor: DARK_SLATE }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: NEON_VIOLET }}>Getting Started Guide</h2>
                        <p className="opacity-80">You are logged in as {userEmail}. Use the sidebar navigation to jump between the KB Editor, Agent Routing, Analytics, and System Integrations.</p>
                    </section>
                </main>
            </div>
        </div>
    );
}