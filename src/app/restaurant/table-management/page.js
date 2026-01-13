"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, Filter,
    CheckCircle2, XCircle, Clock, AlertCircle, LayoutGrid, Timer, X,
    ChevronLeft, Receipt
} from 'lucide-react';

// Mock Data
const initialTablesData = [
    { id: 'T1', capacity: 2, status: 'available', shape: 'round' },
    { id: 'T2', capacity: 4, status: 'occupied', guests: 3, orderId: 'R001', timeElapsed: '45m', shape: 'rect', since: '12:30 PM' },
    { id: 'T3', capacity: 4, status: 'available', shape: 'rect' },
    { id: 'T4', capacity: 2, status: 'reserved', time: '7:00 PM', shape: 'round' },
    { id: 'T5', capacity: 6, status: 'occupied', guests: 6, orderId: 'R003', timeElapsed: '1h 15m', shape: 'rect', since: '1:15 PM' },
    { id: 'T6', capacity: 2, status: 'cleaning', shape: 'round' },
    { id: 'T7', capacity: 4, status: 'available', shape: 'rect' },
    { id: 'T8', capacity: 8, status: 'reserved', time: '8:30 PM', shape: 'rect' },
    { id: 'T9', capacity: 2, status: 'available', shape: 'round' },
    { id: 'T10', capacity: 4, status: 'occupied', guests: 2, orderId: 'R005', timeElapsed: '12m', shape: 'rect', since: '2:00 PM' },
    { id: 'T11', capacity: 6, status: 'available', shape: 'rect' },
    { id: 'T12', capacity: 2, status: 'available', shape: 'round' },
];

const stats = [
    { label: 'Total Tables', field: 'total', value: 12, icon: LayoutGrid, color: 'bg-purple-600', textColor: 'text-purple-600', bgClass: 'bg-purple-50 dark:bg-purple-900/10' },
    { label: 'Available', field: 'available', icon: CheckCircle2, color: 'bg-green-600', textColor: 'text-green-600', bgClass: 'bg-green-50 dark:bg-green-900/10' },
    { label: 'Occupied', field: 'occupied', icon: XCircle, color: 'bg-red-600', textColor: 'text-red-600', bgClass: 'bg-red-50 dark:bg-red-900/10' },
    { label: 'Reserved', field: 'reserved', icon: Clock, color: 'bg-yellow-500', textColor: 'text-yellow-600', bgClass: 'bg-yellow-50 dark:bg-yellow-900/10' },
];

const statusConfig = {
    available: {
        label: 'Available',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        fill: 'bg-green-100/50 dark:bg-green-900/20',
        stroke: 'border-green-300 dark:border-green-700',
        icon: CheckCircle2,
        iconColor: 'text-green-500',
        buttonClass: 'bg-green-600 text-white hover:bg-green-700 border-green-600'
    },
    occupied: {
        label: 'Occupied',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        fill: 'bg-red-100/50 dark:bg-red-900/20',
        stroke: 'border-red-300 dark:border-red-700',
        icon: XCircle,
        iconColor: 'text-red-500',
        buttonClass: 'bg-red-600 text-white hover:bg-red-700 border-red-600'
    },
    reserved: {
        label: 'Reserved',
        badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        fill: 'bg-yellow-100/50 dark:bg-yellow-900/20',
        stroke: 'border-yellow-300 dark:border-yellow-700',
        icon: Clock,
        iconColor: 'text-yellow-500',
        buttonClass: 'bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500'
    },
    cleaning: {
        label: 'Cleaning',
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
        fill: 'bg-slate-100/50 dark:bg-slate-900/20',
        stroke: 'border-slate-300 dark:border-slate-700',
        icon: AlertCircle,
        iconColor: 'text-slate-500',
        buttonClass: 'bg-slate-600 text-white hover:bg-slate-700 border-slate-600'
    }
};

const mockOrderItems = [
    { name: 'Grilled Chicken', qty: 2, price: 450 },
    { name: 'Caesar Salad', qty: 1, price: 280 },
    { name: 'Fresh Lime Soda', qty: 3, price: 120 },
    { name: 'Garlic Bread', qty: 1, price: 180 },
];

const containerVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
};

export default function TableManagement() {
    const [tables, setTables] = useState(initialTablesData);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Filtering & Searching State
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Add Table Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTable, setNewTable] = useState({ id: '', capacity: 4, shape: 'rect' });

    // Derived state for the table details modal
    const selectedTable = tables.find(t => t.id === selectedTableId);

    // Derived state for the floor plan grid
    const filteredTables = tables.filter(table => {
        const matchesFilter = activeFilter === 'all' || table.status === activeFilter;
        const matchesSearch = table.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const closeModal = () => {
        setSelectedTableId(null);
        setShowOrderDetails(false);
    };

    const handleStatusChange = (newStatus) => {
        if (!selectedTableId) return;

        setTables(prevTables => prevTables.map(table => {
            if (table.id === selectedTableId) {
                if (newStatus === 'occupied' && table.status !== 'occupied') {
                    return {
                        ...table,
                        status: newStatus,
                        guests: table.guests || table.capacity,
                        orderId: `R${Math.floor(Math.random() * 1000)}`,
                        since: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timeElapsed: 'Just now'
                    };
                }
                if (newStatus !== 'occupied' && newStatus !== 'reserved') {
                    const { orderId, guests, timeElapsed, since, time, ...rest } = table;
                    setShowOrderDetails(false);
                    return { ...rest, status: newStatus };
                }
                return { ...table, status: newStatus };
            }
            return table;
        }));
    };

    const handleAddTable = (e) => {
        e.preventDefault();
        if (!newTable.id) return;

        // Simple check to prevent duplicate IDs
        if (tables.some(t => t.id === newTable.id)) {
            alert('Table ID already exists!');
            return;
        }

        const tableToAdd = {
            ...newTable,
            status: 'available'
        };

        setTables([...tables, tableToAdd]);
        setIsAddModalOpen(false);
        setNewTable({ id: '', capacity: 4, shape: 'rect' }); // Reset form
    };

    const handlePrintReceipt = () => {
        if (!selectedTable) return;

        const total = mockOrderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const receiptContent = `
            <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; margin: 0; padding: 20px; text-align: center; }
                        h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
                        p { margin: 5px 0; }
                        .divider { border-top: 1px dashed #000; margin: 10px 0; }
                        table { width: 100%; text-align: left; }
                        th { border-bottom: 1px dashed #000; padding: 5px 0; }
                        td { padding: 5px 0; }
                        .right { text-align: right; }
                        .footer { margin-top: 20px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h2>NeuralStay Restaurant</h2>
                    <p>Phone: +91 92519 16025</p>
                    <div class="divider"></div>
                    <div style="text-align: left;">
                        <p>Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                        <p>Order #: ${selectedTable.orderId}</p>
                        <p>Table: ${selectedTable.id}</p>
                    </div>
                    <div class="divider"></div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="right">Qty</th>
                                <th class="right">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockOrderItems.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td class="right">${item.qty}</td>
                                    <td class="right">${item.price * item.qty}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="divider"></div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Subtotal:</span>
                        <span>₹${total}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Tax (5%):</span>
                        <span>₹${Math.round(total * 0.05)}</span>
                    </div>
                    <div class="divider"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
                        <span>Total:</span>
                        <span>₹${total + Math.round(total * 0.05)}</span>
                    </div>
                    <div class="footer">
                        <p>Thank you for visiting!</p>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `;

        const printWindow = window.open('', 'PRINT', 'height=600,width=400');
        if (printWindow) {
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.focus();
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariant}
            className="flex flex-col gap-8 pb-10"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Table Management</h1>
                    <p className="text-text-secondary text-sm">Monitor and manage restaurant table status</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add Table</span>
                </button>
            </div>

            {/* Stats Cards - Dynamic Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => {
                    // Update stats to reflect dynamically added tables too if 'total', otherwise filter
                    const count = stat.field === 'total'
                        ? tables.length
                        : tables.filter(t => t.status === stat.field).length;

                    return (
                        <motion.div
                            key={idx}
                            variants={itemVariant}
                            whileHover={{ y: -4 }}
                            className="bg-bg-secondary p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between transition-all"
                        >
                            <div>
                                <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-text-primary tracking-tight">{count}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgClass}`}>
                                <stat.icon size={24} className={stat.textColor} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filter Bar */}
            <motion.div
                variants={itemVariant}
                className="bg-bg-secondary/60 backdrop-blur-sm p-2 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex overflow-x-auto no-scrollbar gap-2"
            >
                {/* 'All' Option in Filter Bar */}
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`flex-1 min-w-[120px] flex items-center justify-center px-4 py-3 rounded-lg transition-colors group
                        ${activeFilter === 'all' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-bg-primary/50'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            <LayoutGrid size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs text-text-secondary font-medium uppercase tracking-wide">All Tables</span>
                            <span className="text-lg font-bold text-text-primary">{tables.length}</span>
                        </div>
                    </div>
                </button>

                {Object.entries(statusConfig).map(([key, config]) => {
                    const count = tables.filter(t => t.status === key).length;
                    const isActive = activeFilter === key;

                    return (
                        <button
                            key={key}
                            onClick={() => setActiveFilter(key)}
                            className={`flex-1 min-w-[140px] flex items-center justify-between px-4 py-3 rounded-lg transition-colors group
                                ${isActive ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-gray-200 dark:ring-white/10' : 'hover:bg-bg-primary/50'}
                            `}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={`p-2 rounded-full ${config.badge.split(' ')[0]} bg-opacity-50`}>
                                    <config.icon size={16} className={config.iconColor} />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-text-secondary font-medium uppercase tracking-wide">{config.label}</span>
                                    <span className="text-lg font-bold text-text-primary">{count}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </motion.div>

            {/* Table Floor Plan Grid */}
            <div className="bg-bg-secondary rounded-3xl border border-gray-100 dark:border-white/5 p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h3 className="text-lg font-bold text-text-primary">Floor Plan</h3>

                    {/* Search Bar */}
                    <div className="flex gap-2 relative">
                        {showSearch && (
                            <motion.input
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 200, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                type="text"
                                placeholder="Search Table ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-bg-primary border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                            />
                        )}
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className={`p-2 rounded-lg text-text-secondary transition-colors ${showSearch ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' : 'hover:bg-bg-primary'}`}
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
                >
                    {filteredTables.map((table) => {
                        const config = statusConfig[table.status];
                        const isRound = table.shape === 'round';

                        return (
                            <motion.div
                                key={table.id}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                onClick={() => setSelectedTableId(table.id)}
                                className={`relative group bg-bg-primary/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20 dark:border-white/5 shadow-sm transition-all hover:shadow-lg hover:border-purple-500/30 min-h-[160px] flex flex-col justify-between cursor-pointer`}
                            >
                                {/* Top Status Border */}
                                <div className={`absolute top-0 left-0 w-full h-1 bg-current opacity-80 ${config.iconColor}`} />

                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xl font-bold text-text-primary group-hover:text-purple-600 transition-colors">{table.id}</h4>
                                    {table.orderId && (
                                        <div className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-[10px] font-bold rounded shadow-sm border border-purple-100 dark:border-purple-800">
                                            {table.orderId}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex items-center justify-center py-4 relative">
                                    <div className={`absolute inset-0 flex items-center justify-center ${isRound ? 'animate-spin-slow-off' : ''}`}>
                                        {Array.from({ length: table.capacity }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`absolute w-8 h-2 ${config.stroke.replace('border', 'bg')} rounded-full opacity-40`}
                                                style={{
                                                    transform: `rotate(${i * (360 / table.capacity)}deg) translate(${isRound ? '28px' : '36px'})`
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className={`relative z-10 border-2 ${config.stroke} ${config.fill} backdrop-blur-md flex items-center justify-center transition-all duration-500
                                        ${isRound ? 'w-16 h-16 rounded-full' : 'w-24 h-14 rounded-lg'}
                                        ${table.status === 'occupied' ? 'shadow-[0_0_15px_rgba(0,0,0,0.1)]' : ''}
                                    `}>
                                        <span className="text-xs font-bold opacity-60 mix-blend-multiply dark:mix-blend-screen">{table.capacity}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.iconColor}`}>
                                            {config.label}
                                        </span>
                                        {table.status === 'occupied' && (
                                            <span className="flex items-center gap-1 text-[10px] text-text-secondary font-medium mt-0.5">
                                                <Timer size={10} /> {table.timeElapsed}
                                            </span>
                                        )}
                                        {table.status === 'reserved' && (
                                            <span className="flex items-center gap-1 text-[10px] text-text-secondary font-medium mt-0.5">
                                                <Clock size={10} /> {table.time}
                                            </span>
                                        )}
                                    </div>

                                    {table.guests && (
                                        <span className="text-xs font-semibold text-text-primary bg-bg-secondary px-2 py-1 rounded-md border border-border-color/50">
                                            {table.guests} Guests
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filteredTables.length === 0 && (
                    <div className="text-center py-10 text-text-secondary">
                        <p>No tables found matching your filter.</p>
                        <button
                            onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                            className="mt-2 text-purple-600 hover:underline text-sm font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Add Table Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-bg-secondary rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30">
                                <h3 className="text-base font-bold text-text-primary">Add New Table</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-bg-primary transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleAddTable} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Table ID (e.g. T15)</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTable.id}
                                        onChange={(e) => setNewTable({ ...newTable, id: e.target.value })}
                                        className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        placeholder="Enter Table ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Capacity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        required
                                        value={newTable.capacity}
                                        onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) })}
                                        className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Shape</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['rect', 'round'].map(shape => (
                                            <button
                                                key={shape}
                                                type="button"
                                                onClick={() => setNewTable({ ...newTable, shape })}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium border capitalize ${newTable.shape === shape ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-gray-200 dark:border-white/10 text-text-secondary'}`}
                                            >
                                                {shape}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all mt-4"
                                >
                                    Create Table
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table Details Modal */}
            <AnimatePresence>
                {selectedTable && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={closeModal}
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
                        >
                            {!showOrderDetails ? (
                                // STATUS MANAGEMENT VIEW
                                <>
                                    {/* Modal Header */}
                                    <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30">
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary">Table {selectedTable.id} Details</h3>
                                            <p className="text-xs text-text-secondary mt-0.5">Manage table status and information</p>
                                        </div>
                                        <button onClick={closeModal} className="text-text-secondary hover:text-text-primary p-1.5 rounded-full hover:bg-bg-primary transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="p-5 space-y-5">
                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Table Number</p>
                                                <p className="text-sm font-bold text-text-primary">{selectedTable.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Capacity</p>
                                                <p className="text-sm font-bold text-text-primary">{selectedTable.capacity} persons</p>
                                            </div>

                                            {selectedTable.guests && (
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Current Guests</p>
                                                    <p className="text-sm font-bold text-text-primary">{selectedTable.guests} persons</p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Current Status</p>
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${statusConfig[selectedTable.status].badge.replace('text', 'border-transparent text')}`}>
                                                    {statusConfig[selectedTable.status].label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Information Box (Occupied only) */}
                                        {selectedTable.status === 'occupied' && selectedTable.orderId && (
                                            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30 flex items-start justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-blue-500/80 mb-0.5">Order Number</p>
                                                    <p className="text-sm font-bold text-text-primary">{selectedTable.orderId}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase tracking-wider text-blue-500/80 mb-0.5">Started</p>
                                                    <p className="text-xs font-semibold text-text-secondary">{selectedTable.since}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status Buttons */}
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-2">Change Status</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(statusConfig).map(([key, config]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleStatusChange(key)}
                                                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200
                                                    ${selectedTable.status === key
                                                                ? config.buttonClass + ' shadow-md scale-[1.02]'
                                                                : 'bg-transparent border-gray-200 dark:border-white/10 text-text-secondary hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                            }
                                                `}
                                                    >
                                                        {config.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30">
                                        <button
                                            onClick={closeModal}
                                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                                        >
                                            Close
                                        </button>
                                        {selectedTable.status === 'occupied' && (
                                            <button
                                                onClick={() => setShowOrderDetails(true)}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-blue-500/20"
                                            >
                                                View Order
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // ORDER DETAILS VIEW
                                <>
                                    {/* Header */}
                                    <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30">
                                        <button
                                            onClick={() => setShowOrderDetails(false)}
                                            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/50 text-text-secondary transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary">Order {selectedTable.orderId}</h3>
                                            <p className="text-xs text-text-secondary">Items ordered at {selectedTable.since}</p>
                                        </div>
                                    </div>

                                    {/* Order List */}
                                    <div className="p-5 max-h-[300px] overflow-y-auto">
                                        <div className="space-y-3">
                                            {mockOrderItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-2 border-b border-border-color/30 last:border-0 border-dashed">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-bold">
                                                            {item.qty}x
                                                        </div>
                                                        <span className="text-sm font-medium text-text-primary">{item.name}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-text-primary">₹{item.price * item.qty}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total Footer */}
                                    <div className="p-4 bg-gray-50/50 dark:bg-slate-950/30 border-t border-gray-100 dark:border-white/5">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm text-text-secondary">Subtotal</span>
                                            <span className="text-sm font-bold text-text-primary">₹{mockOrderItems.reduce((acc, item) => acc + (item.price * item.qty), 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => setShowOrderDetails(false)}
                                                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handlePrintReceipt}
                                                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium shadow-sm shadow-purple-500/20 hover:bg-purple-700 transition-colors"
                                            >
                                                Print Receipt
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
