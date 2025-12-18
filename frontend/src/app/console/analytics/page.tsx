// frontend/src/app/console/analytics/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
    BarChart3, 
    ArrowLeft,
    Zap, 
    TrendingUp, 
    Users, 
    ThumbsUp 
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
    PieLabelRenderProps,
} from 'recharts'; 

// 💡 NEW/FINAL FIX: Use the specific type definition from the Recharts structure for the formatter value.
// We are explicitly defining the expected type for the formatter function to avoid the broken export.
type FormatterValueType = string | number | string[] | number[] | undefined;


// --- Color Palette (Reused) ---
const ELECTRIC_TEAL = "#00ffff"; 
const CLEAN_WHITE = "#e0e0e0";
const DARK_SLATE = "#1f2937";
const NEON_VIOLET = "#9370db"; 
const RICH_BLACK = "#0a0a0a";
const GREEN_SUCCESS = "#4caf50";

// --- Dummy Data ---
// (Data remains the same)
const conversationData = [
  { name: 'Wk 1', sessions: 400, handoffs: 40 },
  { name: 'Wk 2', sessions: 420, handoffs: 50 },
  { name: 'Wk 3', sessions: 380, handoffs: 45 },
  { name: 'Wk 4', sessions: 450, handoffs: 60 },
  { name: 'Wk 5', sessions: 510, handoffs: 75 },
  { name: 'Wk 6', sessions: 490, handoffs: 70 },
  { name: 'Wk 7', sessions: 550, handoffs: 65 },
];

const handoffData = [
    { name: 'Billing/Refund', value: 350, color: NEON_VIOLET },
    { name: 'Tech Support', value: 200, color: ELECTRIC_TEAL },
    { name: 'Product Inquiry', value: 150, color: GREEN_SUCCESS },
    { name: 'Other/Misc', value: 100, color: CLEAN_WHITE },
];

const csatData = [
    { name: 'Jan', score: 4.2, color: NEON_VIOLET },
    { name: 'Feb', score: 4.5, color: ELECTRIC_TEAL },
    { name: 'Mar', score: 4.1, color: NEON_VIOLET },
    { name: 'Apr', score: 4.7, color: ELECTRIC_TEAL },
];

const deflectionData = [
    { name: 'Deflection', value: 87.5, fill: ELECTRIC_TEAL },
    { name: 'Handoff', value: 12.5, fill: NEON_VIOLET },
];

// --- Chart Components ---

const ChartContainer: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="p-6 rounded-xl shadow-lg h-96" style={{ backgroundColor: DARK_SLATE, border: `1px solid ${NEON_VIOLET}40` }}>
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2" style={{ color: NEON_VIOLET }}>
            {icon}
            <span>{title}</span>
        </h3>
        <div className="h-72 w-full">
            {children}
        </div>
    </div>
);

const ConversationVolumeChart: React.FC = () => (
    <ChartContainer title="Conversation Volume vs. Handoffs" icon={<TrendingUp className="w-5 h-5" />}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={conversationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ELECTRIC_TEAL} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={ELECTRIC_TEAL} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorHandoffs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={NEON_VIOLET} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={NEON_VIOLET} stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke={`${CLEAN_WHITE}20`} strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke={CLEAN_WHITE} opacity={0.7} />
                <YAxis stroke={CLEAN_WHITE} opacity={0.7} />
                <Tooltip 
                    contentStyle={{ backgroundColor: RICH_BLACK, border: `1px solid ${ELECTRIC_TEAL}70`, color: CLEAN_WHITE }} 
                    labelStyle={{ color: ELECTRIC_TEAL }}
                />
                <Area type="monotone" dataKey="sessions" stroke={ELECTRIC_TEAL} fillOpacity={1} fill="url(#colorSessions)" name="Total Sessions" />
                <Area type="monotone" dataKey="handoffs" stroke={NEON_VIOLET} fillOpacity={1} fill="url(#colorHandoffs)" name="Handoffs to Human" />
            </AreaChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const DeflectionRateChart: React.FC = () => (
    <ChartContainer title="Bot Deflection Rate" icon={<Zap className="w-5 h-5" />}>
        <div className="flex justify-center items-center h-full -mt-4">
            <RadialBarChart 
                width={200} 
                height={200} 
                innerRadius="80%" 
                outerRadius="90%" 
                data={deflectionData} 
                startAngle={90} 
                endAngle={-270}
            >
                <RadialBar background dataKey='value' /> 
                {/* Background circle to complete the look */}
                <RadialBar dataKey='value' background fill="#2d3748" cornerRadius={10} stroke={CLEAN_WHITE} opacity={0.1} />
                
                <text 
                    x={100} 
                    y={100} 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    style={{ fontSize: '2.5rem', fontWeight: 'bold', fill: ELECTRIC_TEAL }}
                >
                    87.5%
                </text>
                
                <Tooltip 
                    contentStyle={{ backgroundColor: RICH_BLACK, border: `1px solid ${ELECTRIC_TEAL}70`, color: CLEAN_WHITE }} 
                    labelStyle={{ color: ELECTRIC_TEAL }}
                />
            </RadialBarChart>
            <div className="ml-6 text-sm">
                <p className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: ELECTRIC_TEAL }}></span><span>Deflected (87.5%)</span></p>
                <p className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: NEON_VIOLET }}></span><span>Handoffs (12.5%)</span></p>
            </div>
        </div>
    </ChartContainer>
);

const HandoffBreakdownChart: React.FC = () => (
    <ChartContainer title="Handoff Breakdown" icon={<Users className="w-5 h-5" />}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={handoffData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={(props: PieLabelRenderProps) => {
                        const { name, percent } = props;
                        if (name !== undefined && percent !== undefined) {
                            return `${name} (${(percent * 100).toFixed(0)}%)`;
                        }
                        return '';
                    }}
                >
                    {handoffData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={DARK_SLATE} strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: RICH_BLACK, border: `1px solid ${NEON_VIOLET}70`, color: CLEAN_WHITE }} 
                    labelStyle={{ color: NEON_VIOLET }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ color: CLEAN_WHITE, fontSize: '0.8rem' }} />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const CSATScoreChart: React.FC = () => (
    <ChartContainer title="Avg. CSAT Score Trend (Out of 5)" icon={<ThumbsUp className="w-5 h-5" />}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={csatData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke={`${CLEAN_WHITE}20`} strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke={CLEAN_WHITE} opacity={0.7} />
                <YAxis domain={[4.0, 5.0]} stroke={CLEAN_WHITE} opacity={0.7} />
                <Tooltip 
                    contentStyle={{ backgroundColor: RICH_BLACK, border: `1px solid ${ELECTRIC_TEAL}70`, color: CLEAN_WHITE }} 
                    labelStyle={{ color: ELECTRIC_TEAL }}
                    // 💡 FINAL FIX: Use our newly defined robust type for the formatter function
                    formatter={(value: FormatterValueType) => {
                        if (typeof value === 'number') {
                            return value.toFixed(2);
                        }
                        return '';
                    }}
                />
                <Legend wrapperStyle={{ color: CLEAN_WHITE }} />
                <Bar dataKey="score" name="CSAT Score" radius={[10, 10, 0, 0]}>
                    {csatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
);


// --- Main Page Component ---
export default function AnalyticsPage() {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            
            <header className="mb-8 pb-4 border-b" style={{ borderColor: `${CLEAN_WHITE}1a` }}>
                {/* Back to Dashboard Link */}
                <Link 
                    href="/console" 
                    className="flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-200 hover:opacity-100 opacity-80"
                    style={{ color: NEON_VIOLET }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>

                <h1 className="text-3xl font-extrabold" style={{ color: ELECTRIC_TEAL }}>
                    Agent Performance Analytics
                </h1>
                <p className="text-sm opacity-70 mt-1">
                    Key metrics and visualizations for bot performance and human agent handoffs.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top Row: Conversation Volume and Deflection Rate */}
                <div className="lg:col-span-2">
                    <ConversationVolumeChart />
                </div>
                
                <DeflectionRateChart />
                <CSATScoreChart />
                <HandoffBreakdownChart />

            </div>
            
            <section className="mt-6 p-6 rounded-xl" style={{ backgroundColor: DARK_SLATE, border: `1px solid ${ELECTRIC_TEAL}40` }}>
                <h2 className="text-2xl font-bold mb-3" style={{ color: ELECTRIC_TEAL }}>Key Insights</h2>
                <ul className="list-disc list-inside space-y-1 text-sm opacity-80">
                    <li>The Bot Deflection Rate has remained consistently above 85% for the last quarter.</li>
                    <li>Billing/Refunds remains the largest single category for human handoffs (43.8% of escalations).</li>
                    <li>CSAT score dipped slightly in March, correlating with a high volume of tech support queries.</li>
                </ul>
            </section>
        </div>
    );
}