// frontend/src/components/CapabilityCard.tsx
'use client'; // <-- CRITICAL: Marks this component as client-side interactive

import { BookOpen, MessageCircle, BarChart, Settings } from 'lucide-react';
import React from 'react';

// --- Color Palette ---
const NEON_VIOLET = "#9370db"; 
const ELECTRIC_TEAL = "#00ffff"; 
const CLEAN_WHITE = "#e0e0e0";
const DARK_SLATE = "#1f2937";

// Helper component for Platform Capabilities with hover effect
interface CapabilityCardProps {
    icon: 'BookOpen' | 'MessageCircle' | 'BarChart' | 'Settings'; // Use string literal for serialization
    title: string;
    description: string;
}

const IconMap: { [key: string]: React.ElementType } = { BookOpen, MessageCircle, BarChart, Settings };

export default function CapabilityCard({ icon, title, description }: CapabilityCardProps) {
    const Icon = IconMap[icon];

    return (
        <div 
            className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.03] flex flex-col items-center text-center cursor-pointer"
            style={{ backgroundColor: DARK_SLATE, border: `1px solid ${CLEAN_WHITE}1a` }}
            
            // --- Interactive Hover Logic (Now allowed in a Client Component) ---
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${ELECTRIC_TEAL}`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <Icon className="w-8 h-8 mb-4" style={{ color: NEON_VIOLET }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: CLEAN_WHITE }}>{title}</h3>
            <p className="text-sm opacity-75" style={{ color: CLEAN_WHITE }}>{description}</p>
        </div>
    );
}