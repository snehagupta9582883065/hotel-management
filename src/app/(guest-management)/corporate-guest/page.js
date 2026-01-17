"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Users,
    TrendingUp,
    CreditCard,
    Plus,
    X
} from 'lucide-react';

export default function CorporateGuestPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data
    const [accounts, setAccounts] = useState([
        { id: 1, company: 'Tech Corp Inc.', contact: 'Alice Johnson', email: 'alice@techcorp.com', phone: '+1 234 567 8900', limit: 50000, balance: 12500, bookings: '145 total', activeBookings: '8 active', discount: '15%', terms: 'Net 30', status: 'active' },
        { id: 2, company: 'Global Solutions Ltd.', contact: 'David Brown', email: 'david@globalsolutions.com', phone: '+1 234 567 8901', limit: 75000, balance: 25000, bookings: '230 total', activeBookings: '12 active', discount: '20%', terms: 'Net 45', status: 'active' },
        { id: 3, company: 'Innovate Systems', contact: 'Sarah Connor', email: 'sarah@innovate.com', phone: '+1 555 123 4567', limit: 25000, balance: 5000, bookings: '45 total', activeBookings: '2 active', discount: '10%', terms: 'Net 15', status: 'active' },
        { id: 4, company: 'Future Dynamics', contact: 'Elon M.', email: 'musk@future.com', phone: '+1 987 654 3210', limit: 100000, balance: 80000, bookings: '500 total', activeBookings: '25 active', discount: '25%', terms: 'Net 60', status: 'review' },
        { id: 5, company: 'Blue Ocean Trading', contact: 'Captain Jack', email: 'jack@ocean.com', phone: '+1 111 222 3333', limit: 60000, balance: 1000, bookings: '88 total', activeBookings: '5 active', discount: '12%', terms: 'Net 30', status: 'active' },
    ]);

    const stats = [
        { title: 'Total Accounts', value: accounts.length, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Active Bookings', value: accounts.reduce((acc, curr) => acc + parseInt(curr.activeBookings), 0), icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Outstanding Balance', value: '$' + (accounts.reduce((acc, curr) => acc + curr.balance, 0) / 1000).toFixed(1) + 'K', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Total Credit Limit', value: '$' + (accounts.reduce((acc, curr) => acc + curr.limit, 0) / 1000).toFixed(0) + 'K', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="py-6 space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-gradient">Corporate Accounts</h1>
                    <p className="text-secondary mt-1">Manage corporate accounts and billing</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-accent-primary hover:opacity-90 text-white rounded-lg transition-all shadow-lg shadow-blue-500/25 transform hover:scale-105"
                >
                    <Plus size={18} />
                    <span>Add Corporate Account</span>
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

            {/* Corporate Accounts Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900"
            >
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-primary">Corporate Accounts Registry</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Contact Person</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Contact Info</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Credit Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Bookings</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Discount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Payment Terms</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {accounts.map((account) => (
                                <tr key={account.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-primary group-hover:text-accent-primary transition-colors">{account.company}</td>
                                    <td className="px-6 py-4 text-sm text-secondary font-medium">{account.contact}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{account.email}</span>
                                            <span className="text-xs text-secondary font-medium">{account.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[200px] space-y-1">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-secondary">Limit: ${account.limit.toLocaleString()}</span>
                                                <span className="text-secondary">Used: {Math.round((account.balance / account.limit) * 100)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                                                <div
                                                    className={`h-full rounded-full transition-all ${(account.balance / account.limit) > 0.8 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                                        (account.balance / account.limit) > 0.5 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                        }`}
                                                    style={{ width: `${(account.balance / account.limit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-primary">{account.bookings}</span>
                                            <span className="text-xs text-green-600 font-medium">{account.activeBookings}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary font-bold">{account.discount}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">{account.terms}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm ${account.status === 'active'
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                            : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                            }`}>
                                            {account.status}
                                        </span>
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
                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-black text-primary">Add Corporate Account</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-12 text-center text-secondary">
                                <p>Form implementation placeholder...</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
