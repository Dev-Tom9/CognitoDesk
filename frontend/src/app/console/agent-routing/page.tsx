// frontend/src/app/console/agent-routing/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Users, Bot, GitBranch, Save, PlusCircle, Trash2, ArrowLeft } from 'lucide-react'; 

// --- Color Palette (Reused) ---
const ELECTRIC_TEAL = "#00ffff"; 
const CLEAN_WHITE = "#e0e0e0";
const DARK_SLATE = "#1f2937";
const NEON_VIOLET = "#9370db"; 
const RICH_BLACK = "#0a0a0a";

// --- Sub-Component: Individual Routing Rule Card ---
interface RoutingRuleProps {
    id: number;
    title: string;
    condition: string;
    action: string;
    onDelete: (id: number) => void;
    // 💡 ADDED PROP: Style object is now passed down
    inputStyle: React.CSSProperties;
}

const RoutingRule: React.FC<RoutingRuleProps> = ({ id, title, condition, action, onDelete, inputStyle }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="rounded-xl border transition-shadow duration-300" 
             style={{ borderColor: `${NEON_VIOLET}40`, backgroundColor: DARK_SLATE }}>
            
            {/* Header / Summary Bar */}
            <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <GitBranch className="w-5 h-5" style={{ color: NEON_VIOLET }} />
                    <span className="font-semibold text-lg">{title}</span>
                    <span className="text-sm opacity-60 ml-4">
                        Condition: {condition} $\rightarrow$ Action: {action}
                    </span>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>

            {/* Expanded Content / Editor */}
            {isExpanded && (
                <div className="p-4 border-t" style={{ borderColor: `${NEON_VIOLET}40` }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Condition Input */}
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: ELECTRIC_TEAL }}>
                                IF Condition (Keywords/Context)
                            </label>
                            <input 
                                type="text" 
                                defaultValue={condition}
                                className="w-full p-2 rounded text-sm focus:ring-1 focus:ring-neon-violet"
                                // 💡 inputStyle IS NOW ACCESSIBLE VIA PROPS
                                style={inputStyle}
                                placeholder="e.g., 'billing, refund, chargeback'"
                            />
                        </div>

                        {/* Action Selector */}
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: ELECTRIC_TEAL }}>
                                THEN Action
                            </label>
                            <select 
                                defaultValue={action}
                                className="w-full p-2 rounded text-sm appearance-none focus:ring-1 focus:ring-neon-violet"
                                // 💡 inputStyle IS NOW ACCESSIBLE VIA PROPS
                                style={inputStyle}
                            >
                                <option value="Escalate to Human Agent">Escalate to Human Agent</option>
                                <option value="Use AI Search (KB)">Use AI Search (KB)</option>
                                <option value="Call External API">Call External API</option>
                                <option value="End Conversation">End Conversation</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                         <button 
                            className="flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors duration-200"
                            style={{ backgroundColor: NEON_VIOLET, color: DARK_SLATE }}
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Rule</span>
                        </button>
                        <button 
                            onClick={() => onDelete(id)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors duration-200"
                            style={{ backgroundColor: '#dc2626', color: CLEAN_WHITE }}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Page Component ---
export default function AgentRoutingPage() {
    // 💡 FIXED: inputStyle is defined within the component where it's needed globally
    const inputStyle = {
        backgroundColor: RICH_BLACK, 
        color: CLEAN_WHITE, 
        border: `1px solid ${NEON_VIOLET}40`,
    };

    const [rules, setRules] = useState([
        { id: 1, title: 'Billing & Payments Escalation', condition: 'Keywords: "refund", "charge"', action: 'Escalate to Human Agent' },
        { id: 2, title: 'General FAQ Lookup', condition: 'Confidence Score < 60%', action: 'Use AI Search (KB)' },
        { id: 3, title: 'Product Status Check', condition: 'Keywords: "status", "uptime"', action: 'Call External API' },
    ]);

    const handleAddRule = () => {
        const newRule = {
            id: Date.now(),
            title: 'New Routing Rule',
            condition: 'Default Condition',
            action: 'Use AI Search (KB)',
        };
        setRules([...rules, newRule]);
    };

    const handleDeleteRule = (id: number) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            
            <header className="mb-8 pb-4 border-b" style={{ borderColor: `${CLEAN_WHITE}1a` }}>
                <Link 
                    href="/console" 
                    className="flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-200 hover:opacity-100 opacity-80"
                    style={{ color: NEON_VIOLET }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>

                <h1 className="text-3xl font-extrabold" style={{ color: ELECTRIC_TEAL }}>
                    Agent Routing Configuration
                </h1>
                <p className="text-sm opacity-70 mt-1">
                    Define the rules and logic for directing user queries to the correct response pipeline.
                </p>
            </header>

            <div className="space-y-8">
                
                {/* 1. Routing Rule Editor */}
                <section className="p-6 rounded-xl space-y-4" style={{ backgroundColor: DARK_SLATE, color: CLEAN_WHITE }}>
                    <h2 className="text-2xl font-semibold flex items-center space-x-2" style={{ color: NEON_VIOLET }}>
                        <GitBranch className="w-6 h-6" />
                        <span>Decision Tree Rules</span>
                    </h2>
                    <p className="opacity-70 text-sm pb-2">Rules are evaluated from top to bottom. The first matching rule dictates the action.</p>

                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <RoutingRule 
                                key={rule.id} 
                                {...rule} 
                                onDelete={handleDeleteRule} 
                                // 💡 PASSED PROP: Passing the style down
                                inputStyle={inputStyle}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleAddRule}
                        className="flex items-center space-x-2 px-4 py-2 mt-4 rounded-lg font-medium transition-colors duration-200 border"
                        style={{ backgroundColor: DARK_SLATE, color: ELECTRIC_TEAL, borderColor: ELECTRIC_TEAL }}
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Add New Routing Rule</span>
                    </button>
                </section>
                
                {/* 2. Fallback and Default Settings */}
                <section className="p-6 rounded-xl" style={{ backgroundColor: DARK_SLATE, color: CLEAN_WHITE }}>
                    <h2 className="text-2xl font-semibold flex items-center space-x-2 mb-4" style={{ color: ELECTRIC_TEAL }}>
                        <Bot className="w-6 h-6" />
                        <span>Fallback & Defaults</span>
                    </h2>

                    <div className="space-y-4">
                         {/* Default Bot Action */}
                         <div>
                            <label className="block text-sm font-medium mb-1 opacity-80">
                                Default Action (If no rules match)
                            </label>
                            <select 
                                defaultValue="Use AI Search (KB)"
                                className="w-full md:w-1/2 p-2 rounded text-sm appearance-none focus:ring-1 focus:ring-neon-violet"
                                // 💡 inputStyle IS NOW ACCESSIBLE
                                style={inputStyle}
                            >
                                <option value="Use AI Search (KB)">Use AI Search (KB)</option>
                                <option value="Escalate to Human Agent">Escalate to Human Agent</option>
                                <option value="End Conversation">End Conversation</option>
                            </select>
                        </div>
                        
                        {/* Human Escalation Settings */}
                        <div className="pt-4 border-t" style={{ borderColor: `${CLEAN_WHITE}1a` }}>
                            <h3 className="text-lg font-medium flex items-center space-x-2 mb-2" style={{ color: NEON_VIOLET }}>
                                <Users className="w-5 h-5" />
                                <span>Human Agent Settings</span>
                            </h3>
                            <label className="block text-sm font-medium mb-1 opacity-80">
                                Escalation Queue/Channel
                            </label>
                            <input 
                                type="text" 
                                defaultValue="Slack: #support-escalations"
                                className="w-full md:w-1/2 p-2 rounded text-sm focus:ring-1 focus:ring-neon-violet"
                                // 💡 inputStyle IS NOW ACCESSIBLE
                                style={inputStyle}
                            />
                            <p className="text-xs opacity-50 mt-1">Specify the endpoint or channel where handoffs occur.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}