"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown,
    Star,
    Gift,
    DollarSign,
    Plus,
    MoreVertical,
    X
} from 'lucide-react';

export default function VipGuestPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        tier: 'Platinum',
        preferences: ''
    });

    // Mock Data
    const [guests, setGuests] = useState([
        { id: 1, name: 'Robert Anderson', room: '501', tier: 'Diamond', totalStays: '45 stays', totalSpent: '$125,000', preferences: ['Ocean View', 'King Bed', '+1'], status: 'checked-in', lastVisit: '15/01/2026' },
        { id: 2, name: 'Jennifer Thompson', room: '', tier: 'Platinum', totalStays: '28 stays', totalSpent: '$78,000', preferences: ['Suite', 'Quiet Floor', '+1'], status: 'active', lastVisit: '20/12/2025' },
        { id: 3, name: 'Marcus Chen', room: 'PH-01', tier: 'Diamond', totalStays: '62 stays', totalSpent: '$210,000', preferences: ['Penthouse', 'Late Checkout', 'Private Chef'], status: 'checked-in', lastVisit: '17/01/2026' },
        { id: 4, name: 'Sarah Miller', room: '', tier: 'Gold', totalStays: '15 stays', totalSpent: '$35,000', preferences: ['High Floor', 'Extra Pillows'], status: 'active', lastVisit: '05/11/2025' },
        { id: 5, name: 'James Wilson', room: '404', tier: 'Platinum', totalStays: '33 stays', totalSpent: '$92,500', preferences: ['Pool View', 'Vegan Meals'], status: 'checked-in', lastVisit: '10/01/2026' },
    ]);

    const stats = [
        { title: 'Total VIP Guests', value: guests.length, icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Diamond Tier', value: guests.filter(g => g.tier === 'Diamond').length, icon: Crown, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Currently Checked-in', value: guests.filter(g => g.status === 'checked-in').length, icon: Gift, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Avg. Spend', value: '$108K', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddGuest = () => {
        if (!formData.name) return;
        const newGuest = {
            id: Date.now(),
            name: formData.name,
            room: '',
            tier: formData.tier,
            totalStays: '0 stays',
            totalSpent: '$0',
            preferences: formData.preferences.split(',').map(p => p.trim()).filter(p => p),
            status: 'active',
            lastVisit: '-'
        };
        setGuests(prev => [...prev, newGuest]);
        setIsModalOpen(false);
        setFormData({ name: '', tier: 'Platinum', preferences: '' });
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Diamond': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
            case 'Platinum': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200';
            case 'Gold': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="py-6 space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-gradient">VIP Guests</h1>
                    <p className="text-secondary mt-1">Manage VIP guest profiles and special services</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-accent-primary hover:opacity-90 text-white rounded-lg transition-all shadow-lg shadow-blue-500/25 transform hover:scale-105"
                >
                    <Plus size={18} />
                    <span>Add VIP Guest</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6 flex items-center justify-between hover:shadow-lg transition-shadow bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
                    >
                        <div>
                            <p className="text-secondary text-sm font-medium mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* VIP Guest Directory */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900"
            >
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-primary">VIP Guest Directory</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Guest Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Tier</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Total Stays</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Total Spent</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Preferences</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Last Visit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {guests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary group-hover:text-accent-primary transition-colors">{guest.name}</span>
                                            {guest.room && <span className="text-xs text-secondary font-medium">Room {guest.room}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTierColor(guest.tier)}`}>
                                            {guest.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary font-medium">{guest.totalStays}</td>
                                    <td className="px-6 py-4 text-sm text-primary font-bold">{guest.totalSpent}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 flex-wrap">
                                            {guest.preferences.map((pref, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[10px] text-secondary font-bold whitespace-nowrap shadow-sm">
                                                    {pref}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm ${guest.status === 'checked-in'
                                            ? 'bg-accent-primary text-white'
                                            : 'bg-gray-100 dark:bg-slate-800 text-secondary'
                                            }`}>
                                            {guest.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.lastVisit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Add VIP Guest Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100/20"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-black text-primary">Add VIP Guest</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors opacity-70 hover:opacity-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-secondary">Guest Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 outline-none transition-all text-sm text-primary font-medium"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-secondary">VIP Tier</label>
                                    <div className="relative">
                                        <select
                                            name="tier"
                                            value={formData.tier}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 outline-none transition-all text-sm text-primary font-medium appearance-none cursor-pointer"
                                        >
                                            <option>Platinum</option>
                                            <option>Diamond</option>
                                            <option>Gold</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                                            <MoreVertical size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-secondary">Preferences</label>
                                    <input
                                        type="text"
                                        name="preferences"
                                        value={formData.preferences}
                                        onChange={handleInputChange}
                                        placeholder="Ocean View, King Bed, etc."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 outline-none transition-all text-sm text-primary font-medium"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-900/50">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-secondary hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded-xl transition-all border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddGuest}
                                    className="px-8 py-2.5 text-sm font-bold text-white bg-accent-primary rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                                >
                                    Add Guest
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
