"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, CheckCircle2, ChefHat, AlertCircle,
    Utensils, MoreVertical, Timer, Flame
} from 'lucide-react';

// Mock Data for Initial State
const INITIAL_KOT_ORDERS = [
    {
        id: 'KOT-001',
        orderId: 'R001',
        table: 'T2',
        items: [
            { name: 'Grilled Steak', qty: 1, notes: 'Medium Rare' },
            { name: 'Caesar Salad', qty: 2, notes: 'No Croutons' }
        ],
        startTime: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
        status: 'Preparing',
        waiter: 'John',
        priority: 'high'
    },
    {
        id: 'KOT-002',
        orderId: 'R002',
        table: 'Room 205',
        items: [
            { name: 'Club Sandwich', qty: 1, notes: '' },
            { name: 'French Fries', qty: 1, notes: 'Extra Crispy' }
        ],
        startTime: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
        status: 'Ready',
        waiter: 'Sarah',
        priority: 'normal'
    },
    {
        id: 'KOT-003',
        orderId: 'R004',
        table: 'T5',
        items: [
            { name: 'Margherita Pizza', qty: 2, notes: '' },
            { name: 'Chocolate Cake', qty: 1, notes: '' }
        ],
        startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        status: 'New',
        waiter: 'Mike',
        priority: 'normal'
    },
    {
        id: 'KOT-004',
        orderId: 'R006',
        table: 'T1',
        items: [
            { name: 'Pasta Carbonara', qty: 3, notes: '' },
            { name: 'Garlic Bread', qty: 2, notes: '' }
        ],
        startTime: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
        status: 'New',
        waiter: 'Emma',
        priority: 'high'
    }
];

export default function KOTManagement() {
    const [orders, setOrders] = useState(INITIAL_KOT_ORDERS);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update timer every minute
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Filter orders by status
    const columns = {
        'New': orders.filter(o => o.status === 'New'),
        'Preparing': orders.filter(o => o.status === 'Preparing'),
        'Ready': orders.filter(o => o.status === 'Ready')
    };

    // Handlers
    const moveStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
    };

    const markServed = (orderId) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const getElapsedTime = (startTime) => {
        const diff = Math.floor((currentTime - new Date(startTime)) / 60000);
        return `${diff} min`;
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    <ChefHat className="text-orange-500" />
                    Kitchen Order Ticket (KOT)
                </h1>
                <p className="text-text-secondary text-sm">Kitchen display and order tracking system</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="New Orders"
                    count={columns['New'].length}
                    icon={AlertCircle}
                    iconBg="bg-red-100 dark:bg-red-900/30"
                    iconColor="text-red-600 dark:text-red-400"
                    subtext="Waiting for preparation"
                />
                <StatCard
                    label="Preparing"
                    count={columns['Preparing'].length}
                    icon={Flame}
                    iconBg="bg-orange-100 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                    subtext="Currently on stove"
                />
                <StatCard
                    label="Ready"
                    count={columns['Ready'].length}
                    icon={CheckCircle2}
                    iconBg="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400"
                    subtext="Waiting for pickup"
                />
                <StatCard
                    label="Total Active"
                    count={orders.length}
                    icon={Utensils}
                    iconBg="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                    subtext="Across all stations"
                />
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
                {/* Column 1: New Orders */}
                <KanbanColumn
                    title="New Orders"
                    count={columns['New'].length}
                    color="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5"
                    headerColor="text-red-600 dark:text-red-400"
                    accentColor="bg-red-500"
                >
                    {columns['New'].map(order => (
                        <KOTCard
                            key={order.id}
                            order={order}
                            elapsed={getElapsedTime(order.startTime)}
                            actionLabel="Start Preparing"
                            actionColor="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700 dark:border-slate-600"
                            onAction={() => moveStatus(order.id, 'Preparing')}
                            statusColor="red"
                        />
                    ))}
                </KanbanColumn>

                {/* Column 2: Preparing */}
                <KanbanColumn
                    title="Preparing"
                    count={columns['Preparing'].length}
                    color="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5"
                    headerColor="text-orange-600 dark:text-orange-400"
                    accentColor="bg-orange-500"
                >
                    {columns['Preparing'].map(order => (
                        <KOTCard
                            key={order.id}
                            order={order}
                            elapsed={getElapsedTime(order.startTime)}
                            actionLabel="Mark as Ready"
                            actionColor="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                            onAction={() => moveStatus(order.id, 'Ready')}
                            isPreparing
                            statusColor="orange"
                        />
                    ))}
                </KanbanColumn>

                {/* Column 3: Ready */}
                <KanbanColumn
                    title="Ready to Serve"
                    count={columns['Ready'].length}
                    color="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5"
                    headerColor="text-green-600 dark:text-green-400"
                    accentColor="bg-green-500"
                >
                    {columns['Ready'].map(order => (
                        <KOTCard
                            key={order.id}
                            order={order}
                            elapsed={getElapsedTime(order.startTime)}
                            actionLabel="Mark as Served"
                            actionColor="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                            onAction={() => markServed(order.id)}
                            isReady
                            statusColor="green"
                        />
                    ))}
                </KanbanColumn>
            </div>
        </div>
    );
}

// Sub-components
const StatCard = ({ label, count, icon: Icon, iconBg, iconColor, subtext }) => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
                <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-text-primary">{count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={22} className={iconColor} />
            </div>
        </div>
        {subtext && <p className="text-xs text-text-secondary font-medium">{subtext}</p>}
    </div>
);

const KanbanColumn = ({ title, count, children, color, headerColor, accentColor }) => (
    <div className={`flex flex-col h-full rounded-2xl border ${color} overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm`}>
        {/* Column Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${accentColor}`}></div>
                <span className={`font-bold text-sm tracking-wide ${headerColor}`}>{title}</span>
            </div>
            <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm border border-gray-100 dark:border-white/5">{count}</span>
        </div>

        {/* Drop Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
            {children.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-text-secondary/40 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-xl">
                    <p className="text-sm font-medium">No orders</p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {children}
                </AnimatePresence>
            )}
        </div>
    </div>
);

const KOTCard = ({ order, elapsed, actionLabel, actionColor, onAction, isPreparing, isReady, statusColor }) => {
    const statusColors = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        green: 'bg-green-500'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 group hover:shadow-md transition-all relative overflow-hidden"
        >
            {/* Status Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${statusColors[statusColor] || 'bg-slate-500'} opacity-80`}></div>

            {/* Card Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-text-primary text-sm">{order.id}</h4>
                    <p className="text-xs text-text-secondary">Order: {order.orderId}</p>
                </div>
                {isReady ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                        Ready
                    </span>
                ) : isPreparing ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30">
                        Preparing
                    </span>
                ) : (
                    <Timer size={16} className="text-text-secondary" />
                )}
            </div>

            {/* Location Badge */}
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-text-primary border border-slate-200 dark:border-white/5">
                    {order.table}
                </span>
                {order.priority === 'high' && (
                    <span className="px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-xs font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 animate-pulse">
                        High Priority
                    </span>
                )}
            </div>

            {/* Items List */}
            <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-sm">
                        <div>
                            <span className="font-bold text-text-primary">{item.name}</span>
                            {item.notes && <p className="text-[10px] text-red-500 italic">{item.notes}</p>}
                        </div>
                        <span className="font-bold text-text-primary">x{item.qty}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 dark:border-white/5 my-3"></div>

            {/* Footer */}
            <div className="flex items-center justify-between mb-3 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{elapsed}</span>
                </div>
                <span>Waiter: {order.waiter}</span>
            </div>

            {/* Action Button */}
            <button
                onClick={onAction}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 ${actionColor}`}
            >
                {actionLabel}
            </button>
        </motion.div>
    );
};
