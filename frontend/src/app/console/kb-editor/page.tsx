'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Save, 
    FileText, 
    Trash2, 
    Wrench,
    BookOpen,
    UploadCloud,
    X,
} from 'lucide-react';

// --- Color Palette (Reused) ---
const ELECTRIC_TEAL = "#00ffff"; 
const NEON_VIOLET = "#9370db"; 
const DARK_SLATE = "#1f2937";
const CLEAN_WHITE = "#e0e0e0";
const RICH_BLACK = "#0a0a0a";
const GREEN_SUCCESS = "#4caf50";
const RED_ERROR = "#ef4444";

// --- Utility Functions ---

// Simple utility to generate a pseudo-unique ID for the article
const generateUUID = () => {
    return 'kb-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// --- Main Page Component ---

export default function KBEditorPage() {
    const [title, setTitle] = useState('How to Reset Your Password');
    const [content, setContent] = useState('If you have forgotten your password, navigate to the login page and click the "Forgot Password" link. You will be prompted to enter your registered email address. A password reset link will be sent to your inbox. This process ensures secure access to your account.');
    const [tag, setTag] = useState('authentication, security, login');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    // --- FUNCTIONAL UPDATE: ARTICLE SAVE AND BACKEND INGESTION ---
    const saveArticle = async () => {
        const articleId = generateUUID(); // Generate a new ID for the article
        
        // **✅ THE CRITICAL FIX: Read the backend URL from the environment variable**
        // This variable is loaded from the .env.local file we updated.
        const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

        // Simple validation
        if (!title || !content) {
            setNotification({ message: 'Title and content cannot be empty.', type: 'error' });
            return;
        }

        // Configuration Check: Ensures the .env.local variable was loaded
        if (!BACKEND_BASE_URL) {
            setNotification({ message: 'Configuration Error: NEXT_PUBLIC_BACKEND_BASE_URL is not set.', type: 'error' });
            // 🛑 RETURN the output of this debugging line 🛑
            console.error("Configuration Error: NEXT_PUBLIC_BACKEND_BASE_URL is undefined. Please check .env.local and restart the frontend server.");
            return;
        }

        // **🛑 DEBUGGING LINE: CHECKING THE URL IN THE BROWSER CONSOLE 🛑**
        console.log("DEBUG: BACKEND URL BEING USED:", BACKEND_BASE_URL);

        // Set the notification to processing state
        setNotification({ message: 'Saving article and ingesting data...', type: 'success' });
        
        try {
            const articleData = {
                article_id: articleId,
                title: title,
                content: content,
            };

            // 🛑 CORRECTED API CALL: Using the environment-set base URL 🛑
            const response = await fetch(`${BACKEND_BASE_URL}/api/v1/knowledge/ingest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(articleData),
            });

            const result = await response.json();

            if (response.ok && result.message === "Article ingestion successful.") {
                setStatus('published');
                setNotification({ 
                    message: `Article successfully saved and ingested! Chunks processed: ${result.data.chunks_processed}`, 
                    type: 'success' 
                });
            } else {
                // Handle non-2xx responses or specific failure messages from the backend
                setNotification({ 
                    message: `Ingestion failed: ${result.message || 'Unknown API error.'}`, 
                    type: 'error' 
                });
            }
        } catch (error) {
            console.error("Ingestion API call failed:", error);
            // This message now only appears if the fetch call fails completely (e.g., DNS error, or CORS blockage)
            setNotification({ 
                message: `Network error: Could not connect to the backend at ${BACKEND_BASE_URL}. Check server status.`, 
                type: 'error' 
            });
        }
    };
    // -----------------------------------------------------------------


    const deleteArticle = () => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            // Placeholder for actual delete logic
            setTitle('');
            setContent('');
            setTag('');
            setStatus('draft');
            setNotification({ message: 'Article deleted.', type: 'success' });
        }
    };

    const handleNotificationClose = () => {
        setNotification({ message: '', type: null });
    };

    // --- UI Components ---

    const Notification: React.FC = () => {
        if (!notification.type) return null;

        const bgColor = notification.type === 'success' ? GREEN_SUCCESS : RED_ERROR;
        const icon = notification.type === 'success' ? <UploadCloud className="w-5 h-5" /> : <X className="w-5 h-5" />;

        return (
            <div 
                className="fixed top-4 right-4 p-4 rounded-lg shadow-xl flex items-center space-x-3 z-50 transition-all duration-300 transform"
                style={{ backgroundColor: bgColor, color: RICH_BLACK, fontWeight: 'bold' }}
            >
                {icon}
                <span>{notification.message}</span>
                <button onClick={handleNotificationClose} className="ml-4 opacity-80 hover:opacity-100">
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto min-h-screen" style={{ backgroundColor: RICH_BLACK }}>
            
            <Notification />

            <header className="mb-8 pb-4 border-b" style={{ borderColor: `${CLEAN_WHITE}1a` }}>
                <Link 
                    href="/console" 
                    className="flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-200 hover:opacity-100 opacity-80"
                    style={{ color: NEON_VIOLET }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>

                <h1 className="text-3xl font-extrabold flex items-center space-x-3" style={{ color: ELECTRIC_TEAL }}>
                    <BookOpen className="w-7 h-7" />
                    <span>Knowledge Base Editor</span>
                </h1>
                <p className="text-sm opacity-70 mt-1" style={{ color: CLEAN_WHITE }}>
                    Create and manage documentation used to train and ground your AI agent.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Column: Editor & Main Content --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: DARK_SLATE, border: `1px solid ${NEON_VIOLET}40` }}>
                        <h2 className="text-xl font-semibold mb-4" style={{ color: NEON_VIOLET }}>Article Details</h2>
                        
                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: CLEAN_WHITE }}>Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 rounded-lg text-lg"
                                style={{ backgroundColor: RICH_BLACK, color: CLEAN_WHITE, border: `1px solid ${ELECTRIC_TEAL}40` }}
                                placeholder="e.g., Refund Policy"
                            />
                        </div>

                        {/* Content Area (Placeholder for a Rich Text Editor) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: CLEAN_WHITE }}>Content (HTML/Markdown)</label>
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-4 rounded-lg text-base h-80 resize-y"
                                style={{ backgroundColor: RICH_BLACK, color: CLEAN_WHITE, border: `1px solid ${ELECTRIC_TEAL}40` }}
                                placeholder="Enter your detailed knowledge article content here..."
                            />
                        </div>

                        {/* Tags Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: CLEAN_WHITE }}>Tags (Comma separated)</label>
                            <input 
                                type="text" 
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full p-3 rounded-lg text-sm"
                                style={{ backgroundColor: RICH_BLACK, color: CLEAN_WHITE, border: `1px solid ${ELECTRIC_TEAL}40` }}
                                placeholder="e.g., billing, refunds, payment"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Actions & Status --- */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Status Card */}
                    <div className="p-6 rounded-xl shadow-lg space-y-4" style={{ backgroundColor: DARK_SLATE, border: `1px solid ${ELECTRIC_TEAL}40` }}>
                        <h3 className="text-xl font-semibold flex items-center space-x-2" style={{ color: ELECTRIC_TEAL }}>
                            <FileText className="w-5 h-5" />
                            <span>Article Status</span>
                        </h3>
                        <div 
                            className={`p-3 rounded-lg font-bold text-center`}
                            style={{ 
                                backgroundColor: status === 'published' ? GREEN_SUCCESS : NEON_VIOLET,
                                color: RICH_BLACK
                            }}
                        >
                            {status.toUpperCase()}
                        </div>
                        <p className="text-sm opacity-80" style={{ color: CLEAN_WHITE }}>
                            The agent will only use information from published articles. Saving triggers the RAG ingestion pipeline.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 rounded-xl shadow-lg space-y-4" style={{ backgroundColor: DARK_SLATE, border: `1px solid ${NEON_VIOLET}40` }}>
                        <h3 className="text-xl font-semibold flex items-center space-x-2" style={{ color: NEON_VIOLET }}>
                            <Wrench className="w-5 h-5" />
                            <span>Actions</span>
                        </h3>
                        
                        {/* Save Button (Now Triggers Backend Ingestion) */}
                        <button
                            onClick={saveArticle}
                            className="w-full p-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-transform duration-150 hover:scale-[1.02]"
                            style={{ backgroundColor: NEON_VIOLET, color: RICH_BLACK }}
                        >
                            <Save className="w-5 h-5" />
                            <span>SAVE & INGEST KNOWLEDGE</span>
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={deleteArticle}
                            className="w-full p-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors duration-150 hover:bg-red-700"
                            style={{ backgroundColor: RED_ERROR, color: CLEAN_WHITE }}
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>DELETE ARTICLE</span>
                        </button>
                    </div>

                </div>
            </div>
            
        </div>
    );
}