// frontend/src/components/AccessConsoleButton.tsx
'use client'; 

import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; 
import { useState } from 'react';

// --- Color Palette ---
const RICH_BLACK = "#0a0a0a";
const ELECTRIC_TEAL = "#00ffff"; 
const ELECTRIC_TEAL_LIGHT = "#14ffff"; 

export default function AccessConsoleButton() {
    const [isHovered, setIsHovered] = useState(false);
    const ANIMATION_NAME = "suckPower"; // Reference the name defined in globals.css

    // --- Dynamic Styles ---

    const baseButtonStyle = {
        backgroundColor: isHovered ? ELECTRIC_TEAL_LIGHT : ELECTRIC_TEAL,
        color: RICH_BLACK,
        transition: 'all 0.3s ease-in-out',
        
        // 💡 FIX: The animation MUST be applied via the className 
        // OR the style property MUST be static on the server.
        // Since we want it running constantly when not hovered, we use the CSS class.
        
        // Motion controlled by hover state
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHovered 
            ? `0 0 25px ${ELECTRIC_TEAL}99, 0 10px 20px rgba(0, 0, 0, 0.5)` // Strong hover shadow
            : '0 5px 8px rgba(0, 0, 0, 0.3)', // Base shadow for contrast
    };
    
    // Use a class name for the animation when idle
    const animationClass = isHovered ? '' : 'animate-suck-power';

    return (
        <>
            {/* 💡 REMOVED: <style jsx global> block (The source of the Hydration Error) */}
            
            <Link 
                href="/login" 
                // 💡 FIX: Apply the animation class name here
                className={`text-lg font-bold py-3 px-8 rounded-full inline-flex items-center justify-center space-x-3 cursor-pointer ${animationClass}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={baseButtonStyle} 
            >
                <span>Access Console</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </>
    );
}