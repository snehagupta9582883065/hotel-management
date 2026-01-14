"use client";
import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp,
    Users,
    DollarSign,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard
} from 'lucide-react';

// Mock Data
const REVENUE_DATA = [
    { name: 'Jan', revenue: 45000, expenses: 32000 },
    { name: 'Feb', revenue: 52000, expenses: 34000 },
    { name: 'Mar', revenue: 48000, expenses: 31000 },
    { name: 'Apr', revenue: 61000, expenses: 38000 },
    { name: 'May', revenue: 55000, expenses: 36000 },
    { name: 'Jun', revenue: 67000, expenses: 41000 },
    { name: 'Jul', revenue: 82000, expenses: 48000 },
];

const OCCUPANCY_DATA = [
    { day: 'Mon', rate: 65 },
    { day: 'Tue', rate: 70 },
    { day: 'Wed', rate: 78 },
    { day: 'Thu', rate: 85 },
    { day: 'Fri', rate: 92 },
    { day: 'Sat', rate: 95 },
    { day: 'Sun', rate: 88 },
];

const PAYMENT_METHODS_DATA = [
    { name: 'Credit Card', value: 65, color: '#8884d8' },
    { name: 'Cash', value: 15, color: '#82ca9d' },
    { name: 'Online Transfer', value: 12, color: '#ffc658' },
    { name: 'Corporate Bill', value: 8, color: '#ff8042' },
];

const RESTAURANT_SALES_DATA = [
    { name: 'Food', sales: 12400 },
    { name: 'Beverage', sales: 5600 },
    { name: 'Alcohol', sales: 3200 },
    { name: 'Events', sales: 8500 },
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('Overview');

    const TABS = ['Overview', 'Financials', 'Occupancy', 'Restaurant'];

    // Standard Button Styles
    const btnPrimary = "flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all";
    const btnSecondary = "px-6 py-2 rounded-lg text-sm font-semibold transition-all";
    const selectStyle = "appearance-none bg-[var(--bg-secondary)] border border-[var(--border-color)] pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 text-[var(--text-primary)] shadow-sm";

    // Export Handler
    const handleExport = () => {
        let dataToExport = [];
        let filename = 'report.csv';

        switch (activeTab) {
            case 'Overview':
            case 'Financials':
                dataToExport = REVENUE_DATA;
                filename = 'financial_report.csv';
                break;
            case 'Occupancy':
                dataToExport = OCCUPANCY_DATA;
                filename = 'occupancy_report.csv';
                break;
            case 'Restaurant':
                dataToExport = RESTAURANT_SALES_DATA;
                filename = 'restaurant_sales_report.csv';
                break;
            default:
                dataToExport = REVENUE_DATA;
        }

        if (!dataToExport || !dataToExport.length) return;

        const headers = Object.keys(dataToExport[0]).join(',');
        const csvContent = [
            headers,
            ...dataToExport.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto text-[var(--text-primary)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                        Reports & Analytics
                    </h1>
                    <p className="text-[var(--text-secondary)]">Comprehensive insights into hotel performance</p>
                </div>

                <div className="flex gap-3">
                    <button className={btnPrimary} onClick={handleExport}>
                        <Download size={18} />
                        <span className="hidden sm:inline">Export Report</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-xl shadow-sm border border-[var(--border-color)] w-fit">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${btnSecondary} ${activeTab === tab
                            ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <div className="flex flex-col gap-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KPICard
                                title="Total Revenue"
                                value="$410,000"
                                change="+12.5%"
                                isPositive={true}
                                icon={<DollarSign size={20} className="text-green-600" />}
                                color="green"
                            />
                            <KPICard
                                title="Avg Occupancy"
                                value="82.4%"
                                change="+5.2%"
                                isPositive={true}
                                icon={<Users size={20} className="text-blue-600" />}
                                color="blue"
                            />
                            <KPICard
                                title="RevPAR"
                                value="$145.20"
                                change="-2.1%"
                                isPositive={false}
                                icon={<TrendingUp size={20} className="text-purple-600" />}
                                color="purple"
                            />
                            <KPICard
                                title="Pending Invoices"
                                value="$12,450"
                                change="High"
                                isPositive={false}
                                icon={<CreditCard size={20} className="text-amber-600" />}
                                color="amber"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Revenue Chart */}
                            <div className="lg:col-span-2 bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                                <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Revenue vs Expenses</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={REVENUE_DATA}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-secondary)' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="expenses" stroke="#82ca9d" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Payment Methods Pie */}
                            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                                <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Payment Breakdown</h3>
                                <div className="h-[300px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={PAYMENT_METHODS_DATA}
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {PAYMENT_METHODS_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FINANCIALS TAB */}
                {activeTab === 'Financials' && (
                    <div className="grid grid-cols-1 gap-6">
                        {/* Detailed Financial Table or Charts */}
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Monthly Financial Performance</h3>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={REVENUE_DATA} barSize={40}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Total Revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expenses" name="Operational Expenses" fill="#ff8042" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SummaryCard title="GST Collected" value="$18,450" subtext="12% of Revenue" color="blue" />
                            <SummaryCard title="Service Tax" value="$8,320" subtext="Included in bill" color="indigo" />
                            <SummaryCard title="Net Profit" value="$145,200" subtext="After tax deduction" color="green" />
                        </div>
                    </div>
                )}

                {/* OCCUPANCY TAB */}
                {activeTab === 'Occupancy' && (
                    <div className="flex flex-col gap-6">
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                            <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Weekly Occupancy Rate</h3>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={OCCUPANCY_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                                        <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-color)]">
                                <h4 className="font-bold text-[var(--text-primary)] mb-4">Most Popular Room Types</h4>
                                <div className="space-y-4">
                                    <ProgressBar label="Deluxe Suite" percent={88} color="bg-purple-600" />
                                    <ProgressBar label="Standard Room" percent={74} color="bg-blue-500" />
                                    <ProgressBar label="Executive Suite" percent={65} color="bg-amber-500" />
                                    <ProgressBar label="Family Room" percent={50} color="bg-green-500" />
                                </div>
                            </div>
                            <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-color)]">
                                <h4 className="font-bold text-[var(--text-primary)] mb-4">Guest Demographics</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-secondary)]">Business Travelers</span>
                                        <span className="font-bold">45%</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-secondary)]">Couples / Leisure</span>
                                        <span className="font-bold">30%</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-secondary)]">Families</span>
                                        <span className="font-bold">15%</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-[var(--text-secondary)]">International</span>
                                        <span className="font-bold">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESTAURANT TAB */}
                {activeTab === 'Restaurant' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">Category Sales</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">Revenue breakdown by food category</p>

                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={RESTAURANT_SALES_DATA} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                                        <Bar dataKey="sales" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SummaryCard title="Total Orders" value="1,245" subtext="This month" color="orange" />
                            <SummaryCard title="Avg Check Size" value="$42.50" subtext="Per table" color="teal" />
                            <SummaryCard title="Room Service" value="$8,500" subtext="Revenue" color="blue" />
                            <SummaryCard title="Dine-in" value="$21,200" subtext="Revenue" color="purple" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components
function KPICard({ title, value, change, isPositive, icon, color }) {
    const colorClasses = {
        green: 'bg-green-50 text-green-700 dark:bg-green-900/20',
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20',
        purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20',
        amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20',
    };

    return (
        <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{value}</h3>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, subtext, color }) {
    const colors = {
        blue: 'bg-blue-600',
        indigo: 'bg-indigo-600',
        green: 'bg-green-600',
        purple: 'bg-purple-600',
        teal: 'bg-teal-600',
        orange: 'bg-orange-600'
    };
    return (
        <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-color)] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform`}>
                <div className={`w-24 h-24 rounded-full ${colors[color]}`} />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">{title}</p>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{value}</h3>
            <p className="text-xs font-medium text-[var(--accent-primary)]">{subtext}</p>
        </div>
    );
}

function ProgressBar({ label, percent, color }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-[var(--text-primary)]">{label}</span>
                <span className="text-[var(--text-secondary)]">{percent}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
