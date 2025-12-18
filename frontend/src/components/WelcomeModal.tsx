// frontend/src/components/WelcomeModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
    userName: string | null | undefined;
    // 💡 NEW PROP: Function to tell the parent component (ConsolePage) when the modal is closed
    onClose: () => void; 
}

const RICH_BLACK = "#0a0a0a";
const NEON_VIOLET = "#9370db";
const CLEAN_WHITE = "#e0e0e0";

export default function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
    // State to control modal visibility internally
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose(); // Notify parent component that the modal is closed
    };

    // Optional: Hide modal after 8 seconds automatically (UX improvement)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isVisible) handleClose();
        }, 8000);
        return () => clearTimeout(timer);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        // Modal Backdrop: Fixed inset-0 covers the entire screen
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            // Using a slightly more transparent black overlay for better blur effect
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)' }} 
        >
            {/* Modal Content Container */}
            <div 
                className="relative p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100"
                style={{ backgroundColor: NEON_VIOLET, color: CLEAN_WHITE }}
            >
                {/* Exit Button (X mark) */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" style={{ color: CLEAN_WHITE }} />
                </button>

                {/* Content */}
                <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: CLEAN_WHITE }} />
                    <h2 className="text-3xl font-extrabold mb-2">Login Successful!</h2>
                    <h3 className="text-xl font-semibold mb-6">Welcome, {userName || 'Admin User'}</h3>
                    <p className="text-sm opacity-80">
                        You have securely accessed Admin Console. 
                        Use the left navigation bar to manage your platform functionalities.
                    </p>
                </div>
            </div>
        </div>
    );
}