// frontend/src/components/LoginButton.tsx
'use client'; 

import Link from 'next/link';
import { Lock } from 'lucide-react';
import React, { useState } from 'react';

// --- Color Palette ---
const RICH_BLACK = "#0a0a0a";
const NEON_VIOLET = "#9370db"; 
const ELECTRIC_TEAL = "#00ffff"; 
const CLEAN_WHITE = "#e0e0e0"; 
// Define a subtle hover glow color derived from Teal
const TEAL_GLOW_COLOR = "rgba(0, 255, 255, 0.8)"; 

export default function LoginButton() {
    const [isHovered, setIsHovered] = useState(false);

    // --- Dynamic Style Object for Motion and Colors ---
    const buttonStyle = {
        // --- Color Configuration ---
        // CRITICAL FIX: Background MUST stay ELECTRIC_TEAL for both states
        backgroundColor: ELECTRIC_TEAL, 
        color: RICH_BLACK, 
        border: `1px solid ${NEON_VIOLET}`,
        
        // --- Interactivity & Motion ---
        transition: 'all 0.3s ease-in-out', 
        
        // 1. Subtle Lift Effect (Motion)
        transform: isHovered ? 'translateY(-1.5px)' : 'translateY(0)', // Increased lift slightly
        
        // 2. Enhanced Shadow/Glow (Motion)
        boxShadow: isHovered 
            // Teal color intensifies, button lifts, and shadow deepens
            ? `0 0 10px ${TEAL_GLOW_COLOR}, 0 5px 10px rgba(0, 0, 0, 0.4)` 
            : '0 1px 3px rgba(0, 0, 0, 0.2)', // Default, subtle shadow
    };

    return (
        <Link 
            href="/login"
            className="text-sm font-medium py-2 px-4 rounded-full flex items-center space-x-2" 
            
            // Use state handlers
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            
            // Apply the dynamic style object
            style={buttonStyle} 
        >
            <Lock className="w-4 h-4" /> 
            <span>Login</span>
        </Link>
    );
}