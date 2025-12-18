// frontend/src/app/console/settings/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    GitBranch, 
    Bot, 
    Palette, 
    ShieldCheck, 
    Cloud, 
    Database, 
    Type, 
    Bell, 
    MessageSquare,
    Key,
    Globe,
    FileText,
    Sun,
    Moon,
} from 'lucide-react';

// --- Color Palette (Reused) ---
const ELECTRIC_TEAL = "#00ffff"; 
const NEON_VIOLET = "#9370db"; 

// Dynamic theme colors 
const getThemeColors = (theme: 'dark' | 'light') => ({
    dark: {
        background: "#0a0a0a",
        cardBg: "#1f2937",
        text: "#e0e0e0",
        accent: NEON_VIOLET,
        heading: ELECTRIC_TEAL,
        borderColor: "#e0e0e01a",
    },
    light: {
        background: "#f3f4f6",
        cardBg: "#ffffff",
        text: "#1f2937",
        accent: NEON_VIOLET,
        heading: ELECTRIC_TEAL,
        borderColor: "#d1d5db",
    }
})[theme];

// --- Tab Configuration ---
const settingTabs = [
    { id: 'integrations', name: 'Integrations', icon: GitBranch },
    { id: 'agent', name: 'Agent Behavior', icon: Bot },
    { id: 'admin', name: 'Administration & Security', icon: ShieldCheck },
    { id: 'ui', name: 'User Interface', icon: Palette },
];

// --- Helper Components ---

// 🛑 FIX APPLIED HERE: Checks 'as' prop to correctly render 'input' or 'select' 
// and ensures 'children' are only passed to 'select'.
const ThemedInput: React.FC<any> = ({ themeStyle, as, children, ...props }) => {
    const Component = as === 'select' ? 'select' : 'input';

    const baseStyle = {
        backgroundColor: themeStyle.cardBg, 
        color: themeStyle.text, 
        border: `1px solid ${themeStyle.accent}40`,
        padding: '10px 12px',
        borderRadius: '8px',
        width: '100%',
        transition: 'background-color 0.3s, border-color 0.3s',
    };

    return (
        <Component 
            style={baseStyle}
            {...props}
        >
            {/* Pass children ONLY if Component is 'select' */}
            {as === 'select' ? children : null} 
        </Component>
    );
};


// A standardized setting item row
const SettingItem: React.FC<any> = ({ label, description, children, themeStyle }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b" 
         style={{ borderColor: themeStyle.borderColor + '80' }}>
        <div className="mb-2 md:mb-0 md:w-2/3">
            <label className="block font-medium text-base" style={{ color: themeStyle.text }}>{label}</label>
            <p className="text-sm opacity-70" style={{ color: themeStyle.text }}>{description}</p>
        </div>
        <div className="w-full md:w-1/3 flex justify-end">
            {children}
        </div>
    </div>
);

// Custom Toggle Component (replaces standard checkbox for a cleaner look)
const CustomToggle: React.FC<any> = ({ checked, onChange, themeStyle }) => (
    <div 
        className={`relative w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300`}
        style={{ 
            backgroundColor: checked ? themeStyle.accent : themeStyle.borderColor,
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
        }}
        onClick={() => onChange(!checked)}
    >
        <div 
            className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300`}
            style={{ 
                transform: checked ? 'translateX(100%)' : 'translateX(0)',
            }}
        />
    </div>
);


// --- Content Components ---

const IntegrationsContent: React.FC<any> = ({ themeStyle }) => (
    <div className="space-y-6">
        <SettingItem label="Slack Handoff" description="Routes high-priority queries to a designated Slack channel." themeStyle={themeStyle}>
            <ThemedInput themeStyle={themeStyle} placeholder="Webhook URL" style={{ maxWidth: 280 }} />
        </SettingItem>
        <SettingItem label="Salesforce CRM" description="Logs chat transcripts and tickets directly into Salesforce objects." themeStyle={themeStyle}>
            <ThemedInput themeStyle={themeStyle} placeholder="Instance Domain" style={{ maxWidth: 280 }} />
        </SettingItem>
        <SettingItem label="External Database" description="Allows the agent to query a database for dynamic information retrieval." themeStyle={themeStyle}>
            <ThemedInput themeStyle={themeStyle} as="select" style={{ maxWidth: 280 }} >
                <option value="none" style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Select Auth Method</option>
                <option value="userpass" style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Username/Password</option>
                <option value="key" style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>API Key</option>
            </ThemedInput>
        </SettingItem>
    </div>
);

const AgentContent: React.FC<any> = ({ themeStyle, retention, setRetention, isAnonymized, setIsAnonymized }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="md:col-span-2">
            <h3 className="text-xl font-medium mb-4" style={{ color: themeStyle.accent }}>Behavior</h3>
            <div className="space-y-6">
                <SettingItem label="Default Tone" description="Sets the conversational style of the bot." themeStyle={themeStyle}>
                    <ThemedInput themeStyle={themeStyle} as="select" style={{ maxWidth: 280 }}>
                        <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Professional</option>
                        <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Casual</option>
                        <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Empathetic</option>
                    </ThemedInput>
                </SettingItem>
                <SettingItem label="Max Response Length" description="Caps the length of generated responses (in tokens)." themeStyle={themeStyle}>
                    <ThemedInput themeStyle={themeStyle} type="number" defaultValue={250} style={{ maxWidth: 280 }} />
                </SettingItem>
            </div>
        </div>

        <div className="md:col-span-2">
            <h3 className="text-xl font-medium mb-4" style={{ color: themeStyle.accent }}>Data & Compliance</h3>
            <div className="space-y-6">
                <SettingItem label="Retention Period (Days)" description="How long raw conversation logs are retained." themeStyle={themeStyle}>
                    <ThemedInput themeStyle={themeStyle} type="number" value={retention} onChange={(e: any) => setRetention(e.target.value)} style={{ maxWidth: 280 }} />
                </SettingItem>
                <SettingItem label="Anonymize Data" description="Automatically scrubs PII from logs before storage." themeStyle={themeStyle}>
                     <CustomToggle checked={isAnonymized} onChange={setIsAnonymized} themeStyle={themeStyle} />
                </SettingItem>
                <SettingItem label="Download Audit Log" description="Export a log of all configuration changes for compliance." themeStyle={themeStyle}>
                    <button 
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-opacity hover:opacity-90"
                        style={{ backgroundColor: themeStyle.accent, color: themeStyle.cardBg, width: 280 }}
                    >
                        <FileText className="w-4 h-4 inline mr-2" /> Download Log
                    </button>
                </SettingItem>
            </div>
        </div>
    </div>
);

const AdminContent: React.FC<any> = ({ themeStyle }) => (
    <div className="space-y-6">
        <SettingItem label="User Roles & Access" description="Manage team member permissions and access levels." themeStyle={themeStyle}>
            <button 
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: themeStyle.accent, color: themeStyle.cardBg, width: 280 }}
            >
                <ShieldCheck className="w-4 h-4 inline mr-2" /> Manage Roles
            </button>
        </SettingItem>
        <SettingItem label="API Keys Management" description="Generate and revoke keys used for external access to the bot API." themeStyle={themeStyle}>
            <button 
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: themeStyle.accent, color: themeStyle.cardBg, width: 280 }}
            >
                <Key className="w-4 h-4 inline mr-2" /> Manage Keys
            </button>
        </SettingItem>
        <SettingItem label="Time Zone & Locale" description="Set the default time zone and language for logs and dashboard." themeStyle={themeStyle}>
             <ThemedInput themeStyle={themeStyle} as="select" style={{ maxWidth: 280 }}>
                <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>UTC (Coordinated Universal Time)</option>
                <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>America/New_York</option>
                <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Europe/London</option>
                <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Asia/Tokyo</option>
            </ThemedInput>
        </SettingItem>
    </div>
);

const UIContent: React.FC<any> = ({ themeStyle, theme, setTheme, notificationSound, setNotificationSound, realTime, setRealTime }) => {
    // Component to handle the theme toggle switch
    const ThemeToggle: React.FC = () => (
        <div 
            className="flex items-center cursor-pointer p-1 rounded-full w-20 h-10 transition-colors duration-300"
            style={{ backgroundColor: themeStyle.accent + '80' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            <div 
                className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300`}
                style={{ 
                    backgroundColor: themeStyle.cardBg, 
                    transform: theme === 'dark' ? 'translateX(0)' : 'translateX(calc(100% - 8px))' 
                }}
            >
                {theme === 'dark' ? <Moon className="w-5 h-5" style={{ color: themeStyle.text }} /> : <Sun className="w-5 h-5" style={{ color: themeStyle.text }} />}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <SettingItem label="Application Theme" description="Switch between Dark and Light color modes." themeStyle={themeStyle}>
                <ThemeToggle />
            </SettingItem>
            <SettingItem label="Console Font Size" description="Adjusts the base font size for better readability." themeStyle={themeStyle}>
                <ThemedInput themeStyle={themeStyle} as="select" style={{ maxWidth: 280 }}>
                    <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Medium (Default)</option>
                    <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Small</option>
                    <option style={{ color: themeStyle.text, backgroundColor: themeStyle.cardBg }}>Large</option>
                </ThemedInput>
            </SettingItem>
            <SettingItem label="Notification Sounds" description="Toggle sounds for alerts and new messages." themeStyle={themeStyle}>
                 <CustomToggle checked={notificationSound} onChange={setNotificationSound} themeStyle={themeStyle} />
            </SettingItem>
            <SettingItem label="Real-time Feedback" description="Enables features like live typing indicators." themeStyle={themeStyle}>
                <CustomToggle checked={realTime} onChange={setRealTime} themeStyle={themeStyle} />
            </SettingItem>
        </div>
    );
};


// --- Main Page Component ---
export default function SettingsPage() {
    // Local States (for interactive UI controls)
    const [activeTab, setActiveTab] = useState('integrations');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [retention, setRetention] = useState(365);
    const [isAnonymized, setIsAnonymized] = useState(true);
    const [notificationSound, setNotificationSound] = useState(true);
    const [realTime, setRealTime] = useState(true);

    const themeStyle = useMemo(() => getThemeColors(theme), [theme]);
    
    // Function to render the active tab content
    const renderContent = () => {
        switch (activeTab) {
            case 'integrations':
                return <IntegrationsContent themeStyle={themeStyle} />;
            case 'agent':
                return <AgentContent themeStyle={themeStyle} retention={retention} setRetention={setRetention} isAnonymized={isAnonymized} setIsAnonymized={setIsAnonymized} />;
            case 'admin':
                return <AdminContent themeStyle={themeStyle} />;
            case 'ui':
                return <UIContent themeStyle={themeStyle} theme={theme} setTheme={setTheme} notificationSound={notificationSound} setNotificationSound={setNotificationSound} realTime={realTime} setRealTime={setRealTime} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto min-h-screen" style={{ backgroundColor: themeStyle.background, color: themeStyle.text, transition: 'background-color 0.5s' }}>
            
            <header className="mb-8 pb-4 border-b" style={{ borderColor: themeStyle.borderColor }}>
                {/* Back to Dashboard Link */}
                <Link 
                    href="/console" 
                    className="flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-200 hover:opacity-100 opacity-80"
                    style={{ color: themeStyle.accent }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>

                <h1 className="text-3xl font-extrabold" style={{ color: themeStyle.heading }}>
                    System Settings & Configuration
                </h1>
                <p className="text-sm opacity-70 mt-1">
                    Manage integrations, bot behavior, UI preferences, and security settings.
                </p>
            </header>

            {/* Tabbed Navigation */}
            <div className="flex space-x-4 mb-6 pb-2 overflow-x-auto border-b" style={{ borderColor: themeStyle.borderColor }}>
                {settingTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap`}
                            style={{
                                color: isActive ? themeStyle.heading : themeStyle.text,
                                borderBottom: isActive ? `3px solid ${themeStyle.heading}` : '3px solid transparent',
                                opacity: isActive ? 1 : 0.7,
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content Area */}
            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyle.cardBg, border: `1px solid ${themeStyle.accent}40`, minHeight: '500px' }}>
                {renderContent()}
            </div>
        </div>
    );
}