// frontend/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
// Import necessary icons: Lock, LogIn, Mail
import { LogIn, Lock, Mail } from 'lucide-react';

// --- Color Palette ---
const RICH_BLACK = "#0a0a0a";
const NEON_VIOLET = "#9370db";
const DARK_PURPLE = "#6a0dad";
const CLEAN_WHITE = "#e0e0e0";
const DARK_SLATE = "#1f2937";
const LIGHT_PURPLE_HOVER = "#b097e8"; // A lighter shade of NEON_VIOLET for hover

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleCredentialsLogin = async () => {
        setError("Credentials login is disabled. Please use Google for Admin access.");
    };

    const handleGoogleLogin = async () => {
        setError('');
        await signIn('google', { callbackUrl: '/console' });
    };

    // Helper state for Google button hover effect (must be client-side)
    const [isGoogleHovered, setIsGoogleHovered] = useState(false);

    // Dynamic styles for the Google button
    const googleButtonStyle = {
        // Base state
        backgroundColor: isGoogleHovered ? LIGHT_PURPLE_HOVER : CLEAN_WHITE,
        color: isGoogleHovered ? CLEAN_WHITE : RICH_BLACK,
        border: `1px solid ${NEON_VIOLET}`,
        // Motion and shadow controlled by hover state
        transform: isGoogleHovered ? 'translateY(-2px)' : 'translateY(0)', // Lift effect
        boxShadow: isGoogleHovered ? `0 6px 15px ${NEON_VIOLET}90` : `0 4px 6px ${RICH_BLACK}50`, // Stronger shadow glow
    };

    return (
        <div style={{ backgroundColor: RICH_BLACK, color: CLEAN_WHITE }} className="min-h-screen flex items-center justify-center p-4">
            <div
                className="w-full max-w-md p-8 rounded-xl shadow-2xl"
                style={{ backgroundColor: DARK_SLATE, border: `1px solid ${NEON_VIOLET}` }}
            >
                {/* Admin Access with Padlock Icon and Text */}
                <div className="flex flex-col items-center mb-6">
                    <Lock className="w-8 h-8 mb-2" style={{ color: NEON_VIOLET }} />
                    <h1 className="text-3xl font-extrabold text-center" style={{ color: NEON_VIOLET }}>
                        Admin Access
                    </h1>
                    <p className="text-sm mt-2 opacity-75 text-center max-w-xs">
                        Securely manage your platform configuration and user data.
                    </p>
                </div>

                {error && (
                    <div className="p-3 mb-4 rounded text-sm text-red-300 bg-red-900/50 border border-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleCredentialsLogin(); }} className="space-y-4 mb-6">
                    {/* ... (Credential inputs remain the same) ... */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700/50 border border-gray-600 focus:ring-1 focus:ring-neon-violet transition"
                            style={{ color: CLEAN_WHITE }}
                            placeholder="admin@cognitodesk.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700/50 border border-gray-600 focus:ring-1 focus:ring-neon-violet transition"
                            style={{ color: CLEAN_WHITE }}
                            placeholder="********"
                            required
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg text-lg font-bold transition-colors duration-300 flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
                        style={{ backgroundColor: DARK_PURPLE, color: CLEAN_WHITE, border: `1px solid ${NEON_VIOLET}` }}
                        disabled={true}
                    >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                    </button>
                </form>

                <div className="relative text-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <span className="relative inline-block px-3 text-sm" style={{ backgroundColor: DARK_SLATE, color: CLEAN_WHITE }}>
                        OR
                    </span>
                </div>

                {/* Continue with Google Button (Motion Interaction Added) */}
                <button
                    onClick={handleGoogleLogin}
                    onMouseEnter={() => setIsGoogleHovered(true)} // Set Hover State
                    onMouseLeave={() => setIsGoogleHovered(false)} // Clear Hover State
                    className="w-full py-3 rounded-lg text-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                    style={googleButtonStyle} // Apply the dynamic style object
                >
                    {/* Icon - Mail as the professional stand-in */}
                    <Mail
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: isGoogleHovered ? CLEAN_WHITE : RICH_BLACK }} // Dynamic Icon color
                    />
                    <span>Continue with Google</span>
                </button>
            </div>
        </div>
    );
}