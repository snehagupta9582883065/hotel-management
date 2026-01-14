"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Clock, CheckCircle2,
    ChefHat, ShoppingBag, X, Trash2,
    FileText, Eye, ChevronDown
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Mock Menu Items for "Add Item" dropdown
const MOCK_MENU_ITEMS = [
    { id: 1, name: 'Grilled Steak', price: 28 },
    { id: 2, name: 'Margherita Pizza', price: 18 },
    { id: 3, name: 'Caesar Salad', price: 12 },
    { id: 4, name: 'Club Sandwich', price: 16 },
    { id: 5, name: 'Pasta Carbonara', price: 22 },
    { id: 6, name: 'Mushroom Risotto', price: 24 },
    { id: 7, name: 'Chocolate Cake', price: 10 },
    { id: 8, name: 'Orange Juice', price: 5 },
];

// Initial Mock Orders
const INITIAL_ORDERS = [
    {
        id: 'R001',
        location: 'T2',
        type: 'Dine-In',
        items: [
            { name: 'Grilled Steak', qty: 1, price: 28 },
            { name: 'Caesar Salad', qty: 2, price: 12 },
            { name: 'Orange Juice', qty: 2, price: 5 }
        ],
        time: '12:30 PM',
        status: 'Preparing',
        waiter: 'John',
        total: 62
    },
    {
        id: 'R002',
        location: 'Room 205',
        type: 'Room Service',
        items: [
            { name: 'Club Sandwich', qty: 1, price: 16 },
            { name: 'Coffee', qty: 1, price: 5 }
        ],
        time: '1:15 PM',
        status: 'Ready',
        waiter: 'Sarah',
        total: 21
    },
    {
        id: 'R003',
        location: 'T4',
        type: 'Dine-In',
        items: [
            { name: 'Pasta Carbonara', qty: 2, price: 22 }
        ],
        time: '1:45 PM',
        status: 'Served',
        waiter: 'Mike',
        total: 44
    }
];

const containerVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

export default function OrderManagement() {
    // State
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // For View Modal

    // New Order Form State
    const [newOrder, setNewOrder] = useState({
        location: '',
        type: 'Dine-In',
        waiter: '',
        items: []
    });

    // Temp Item State for Modal
    const [tempItem, setTempItem] = useState({
        menuId: '',
        qty: 1
    });

    // Derived Stats
    const stats = useMemo(() => {
        return {
            active: orders.filter(o => !['Completed', 'Served'].includes(o.status)).length,
            pending: orders.filter(o => o.status === 'Pending').length,
            preparing: orders.filter(o => o.status === 'Preparing').length,
            ready: orders.filter(o => o.status === 'Ready').length
        };
    }, [orders]);

    // Handlers
    const handleAddTempItem = () => {
        if (!tempItem.menuId) return;
        const menuItem = MOCK_MENU_ITEMS.find(i => i.id === parseInt(tempItem.menuId));
        if (!menuItem) return;

        const newItem = {
            name: menuItem.name,
            price: menuItem.price,
            qty: parseInt(tempItem.qty)
        };

        setNewOrder(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));

        setTempItem({ menuId: '', qty: 1 });
    };

    const handleRemoveTempItem = (index) => {
        setNewOrder(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleCreateOrder = () => {
        if (!newOrder.location || newOrder.items.length === 0) return;

        const totalor = newOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const finalizedOrder = {
            id: `R${Math.floor(1000 + Math.random() * 9000)}`,
            location: newOrder.location,
            type: newOrder.type,
            items: newOrder.items,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Pending',
            waiter: newOrder.waiter || 'Unassigned',
            total: totalor
        };

        setOrders([finalizedOrder, ...orders]);
        setIsCreateModalOpen(false);
        setNewOrder({ location: '', type: 'Dine-In', waiter: '', items: [] });
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Order Management</h1>
                    <p className="text-text-secondary text-sm">Monitor and manage restaurant orders</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} />
                        <span>New Order</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <PremiumStatCard label="Active Orders" value={stats.active} icon={FileText} color="purple" />
                <PremiumStatCard label="Pending" value={stats.pending} icon={Clock} color="orange" />
                <PremiumStatCard label="Preparing" value={stats.preparing} icon={ChefHat} color="yellow" />
                <PremiumStatCard label="Ready" value={stats.ready} icon={CheckCircle2} color="green" />
            </motion.div>

            {/* Active Orders Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-text-primary">Active Orders</h2>

                <div className="bg-bg-secondary rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                                    <th className="px-6 py-5">Order No.</th>
                                    <th className="px-6 py-5">Table/Room</th>
                                    <th className="px-6 py-5">Type</th>
                                    <th className="px-6 py-5">Items</th>
                                    <th className="px-6 py-5">Time</th>
                                    <th className="px-6 py-5">Total</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Waiter</th>
                                    <th className="px-6 py-5 text-right flex justify-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-text-secondary">
                                            No active orders found
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="group border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-bg-primary/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-bold text-text-primary">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-text-primary border border-gray-200 dark:border-white/10">
                                                    {order.location}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${order.type === 'Room Service'
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30'
                                                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30'
                                                    }`}>
                                                    {order.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                {order.items.reduce((acc, i) => acc + i.qty, 0)} Items
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary tabular-nums font-medium">{order.time}</td>
                                            <td className="px-6 py-4 font-bold text-text-primary">${order.total}</td>
                                            <td className="px-6 py-4">
                                                <StatusDropdown
                                                    currentStatus={order.status}
                                                    onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary text-xs font-medium">{order.waiter}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Order Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsCreateModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30">
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">Create New Order</h3>
                                    <p className="text-xs text-text-secondary mt-1">Add items and create a new order</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Top Form Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Table/Room *</label>
                                        <input
                                            type="text"
                                            className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                                            placeholder="e.g. T1 or Room 21"
                                            value={newOrder.location}
                                            onChange={(e) => setNewOrder({ ...newOrder, location: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Order Type *</label>
                                        <select
                                            className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-text-primary"
                                            value={newOrder.type}
                                            onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value })}
                                        >
                                            <option value="Dine-In">Dine-In</option>
                                            <option value="Room Service">Room Service</option>
                                            <option value="Takeaway">Takeaway</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Waiter Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                                            placeholder="Optional"
                                            value={newOrder.waiter}
                                            onChange={(e) => setNewOrder({ ...newOrder, waiter: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-100 dark:border-white/5" />

                                {/* Add Items Section */}
                                <div>
                                    <h4 className="text-sm font-bold text-text-primary mb-3">Add Items</h4>
                                    <div className="flex flex-col md:flex-row gap-3 items-end">
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Menu Item</label>
                                            <select
                                                className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 transition-all font-medium"
                                                value={tempItem.menuId}
                                                onChange={(e) => setTempItem({ ...tempItem, menuId: e.target.value })}
                                            >
                                                <option value="">Select Item</option>
                                                {MOCK_MENU_ITEMS.map(item => (
                                                    <option key={item.id} value={item.id}>{item.name} - ${item.price}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Quantity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full bg-bg-primary dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 transition-all font-medium"
                                                value={tempItem.qty}
                                                onChange={(e) => setTempItem({ ...tempItem, qty: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddTempItem}
                                            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Added Items List */}
                                <div className="bg-gray-50/50 dark:bg-slate-950/30 rounded-xl border border-gray-100 dark:border-white/5 p-4 min-h-[120px]">
                                    {newOrder.items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-text-secondary/50 py-4">
                                            <ShoppingBag size={24} className="mb-2 opacity-50" />
                                            <p className="text-sm">No items added yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {newOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary">{item.name}</p>
                                                        <p className="text-xs text-text-secondary">${item.price} x {item.qty}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-bold text-text-primary">${item.price * item.qty}</span>
                                                        <button
                                                            onClick={() => handleRemoveTempItem(idx)}
                                                            className="text-red-400 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex items-center justify-end pt-3 border-t border-gray-200/50 dark:border-white/5 mt-4">
                                                <span className="text-sm font-medium text-text-secondary mr-2">Total Estimated:</span>
                                                <span className="text-lg font-bold text-text-primary">
                                                    ${newOrder.items.reduce((s, i) => s + (i.price * i.qty), 0)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateOrder}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
                                >
                                    Create Order
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-start justify-between p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/30">
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">Order Details - {selectedOrder.id}</h3>
                                    <p className="text-xs text-text-secondary mt-1">View complete order information</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-text-secondary hover:text-text-primary p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-5">
                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Table/Room</p>
                                        <p className="text-sm font-bold text-text-primary">{selectedOrder.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Order Type</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${selectedOrder.type === 'Room Service'
                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30'
                                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30'
                                            }`}>
                                            {selectedOrder.type}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Order Time</p>
                                        <p className="text-sm font-bold text-text-primary">{selectedOrder.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Waiter</p>
                                        <p className="text-sm font-bold text-text-primary">{selectedOrder.waiter}</p>
                                    </div>
                                </div>

                                {/* Order Items List */}
                                <div className="bg-gray-50/50 dark:bg-slate-950/30 border border-gray-100 dark:border-white/5 rounded-lg p-4">
                                    <h4 className="text-xs font-bold text-text-primary mb-3 uppercase tracking-wider">Order Items</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 dark:border-white/5 last:border-0 border-dashed">
                                                <span className="text-text-primary font-medium text-xs">{item.name}</span>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-text-secondary text-xs">x{item.qty}</span>
                                                    <span className="text-text-primary font-semibold font-mono text-xs">${(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 space-y-1.5">
                                        <div className="flex justify-between items-center text-xs text-text-secondary">
                                            <span>Subtotal</span>
                                            <span>${selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-text-secondary">
                                            <span>Tax (12%)</span>
                                            <span>${(selectedOrder.total * 0.12).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold text-text-primary pt-2">
                                            <span>Total</span>
                                            <span>${(selectedOrder.total * 1.12).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

// Components
const PremiumStatCard = ({ label, value, icon: Icon, color }) => {
    // Map color names to Tailwind classes
    const colorMap = {
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-600 dark:text-purple-400' },
        orange: { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-600 dark:text-orange-400' },
        yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/10', text: 'text-yellow-600 dark:text-yellow-400' },
        green: { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-600 dark:text-green-400' },
    };

    const theme = colorMap[color] || colorMap.purple;

    return (
        <motion.div variants={itemVariant} className="bg-bg-secondary p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">{label}</span>
                <h3 className="text-3xl font-bold text-text-primary mt-1">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg}`}>
                <Icon size={24} className={theme.text} />
            </div>
        </motion.div>
    );
};

// Portal Component
const Portal = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(children, document.body);
};

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = React.useRef(null);
    const buttonRef = React.useRef(null);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            // Close on scroll to avoid position desync
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 6,
                left: rect.left,
                width: rect.width
            });
        }
        setIsOpen(!isOpen);
    };

    const styles = {
        'Pending': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/30',
        'Preparing': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30',
        'Ready': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30',
        'Served': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30',
        'Completed': 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
    };

    const statuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Completed'];

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className={`w-32 flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${styles[currentStatus] || styles['Pending']}`}
            >
                <span>{currentStatus}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <Portal>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{
                                position: 'fixed',
                                top: position.top,
                                left: position.left,
                                width: position.width,
                                zIndex: 9999
                            }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden"
                        >
                            <div className="p-1">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            onStatusChange(status);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currentStatus === status
                                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                                : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-primary'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Portal>
        </>
    );
};
