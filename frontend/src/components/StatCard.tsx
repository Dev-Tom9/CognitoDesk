// frontend/src/components/StatCard.tsx
// 🛑 REMOVED: 'use client'; 
// 🛑 REMOVED: import { useCountingAnimation } from '../hooks/useCountingAnimation'; 

import React from 'react';

// --- Interface Definition ---
interface StatCardProps {
    title: string;
    // 💡 CHANGE: Accept displayValue instead of finalValue
    displayValue: string | number; 
    unit?: string;
    style: React.CSSProperties;
    valueColor: string;
}

// --- Component Definition (Pure Server Component) ---
export const StatCard: React.FC<StatCardProps> = ({ title, displayValue, unit = '', style, valueColor }) => {
    
    // Logic to format number (now much simpler)
    let formattedValue: string = displayValue.toString();
    
    // We keep the special formatting, but rely on the wrapper component for calculation
    if (title.includes("Health") && formattedValue === '100') {
        formattedValue = 'Good';
    } 
    // All other numbers (no more complex counting logic here)
    else if (typeof displayValue === 'number') {
        formattedValue = displayValue.toLocaleString(undefined, { maximumFractionDigits: 1 });
    }
    
    return (
        <div className="p-6 rounded-lg h-32" style={style}>
            <p className="text-sm opacity-70">{title}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: valueColor }}>
                {formattedValue}{unit}
            </p>
        </div>
    );
};

// Removed export default, keeping the named export as established.