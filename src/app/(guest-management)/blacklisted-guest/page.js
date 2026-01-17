"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Plus,
    Trash2,
    X,
    ShieldAlert
} from 'lucide-react';

export default function BlacklistedGuestPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data
    const [guests, setGuests] = useState([
        { id: 1, name: 'John Troublemaker', email: 'trouble@email.com', phone: '+1 234 567 8999', reason: 'Property damage, unpaid bills', date: '15/11/2025', reportedBy: 'Front Desk Manager', severity: 'high' },
        { id: 2, name: 'Karen Smith', email: 'karen@complain.com', phone: '+1 555 666 7777', reason: 'Harassing staff repeatedly, shouting in lobby', date: '02/12/2025', reportedBy: 'Security Head', severity: 'medium' },
        { id: 3, name: 'Rob Burglar', email: 'rob@unknown.com', phone: '+1 911 911 9111', reason: 'Attempted theft in guest room', date: '20/01/2024', reportedBy: 'General Manager', severity: 'critical' },
        { id: 4, name: 'Fake ID Guy', email: 'fake@fraud.com', phone: '+1 000 000 0000', reason: 'Presented forged identification documents', date: '10/10/2025', reportedBy: 'Receptionist', severity: 'high' },
    ]);

    return (
        <div className="py-6 space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-gradient">Blacklisted Guests</h1>
                    <p className="text-secondary mt-1">Manage blacklisted guest records and security warnings</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-lg shadow-red-500/30 transform hover:scale-105"
                >
                    <Plus size={18} />
                    <span>Add to Blacklist</span>
                </button>
            </div>

            {/* Warning Alert */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card p-6 border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">Security Alert</h3>
                        <p className="text-red-600/80 dark:text-red-400/80 text-sm">There are currently {guests.length} blacklisted individuals in the database.</p>
                    </div>
                </div>
            </motion.div>

            {/* Blacklist Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card overflow-hidden border border-red-100 dark:border-red-900/30 shadow-xl bg-white dark:bg-slate-900"
            >
                <div className="p-6 border-b border-red-100 dark:border-red-900/30 bg-red-50/20 dark:bg-red-900/10">
                    <h2 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Blacklist Registry
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-red-50/10 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Guest Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Contact Info</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Blacklisted Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Reported By</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Severity</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-red-50 dark:divide-red-900/20">
                            {guests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors group">
                                    <td className="px-6 py-4 font-black text-primary group-hover:text-red-600 transition-colors">{guest.name}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{guest.email}</span>
                                            <span className="text-xs text-secondary font-medium">{guest.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary italic">"{guest.reason}"</td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.date}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.reportedBy}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${guest.severity === 'critical' ? 'bg-red-700 shadow-red-900/40' :
                                            guest.severity === 'high' ? 'bg-red-500 shadow-red-500/30' : 'bg-orange-500 shadow-orange-500/30'
                                            }`}>
                                            {guest.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal Placeholder */}
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
                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-red-50/50 dark:bg-red-950/30">
                                <h3 className="text-xl font-black text-red-600 dark:text-red-500 uppercase tracking-tight">Add to Blacklist</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-12 text-center text-secondary">
                                <p>Warning: This action is irreversible.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
