"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    FileText,
    CreditCard,
    Calendar,
    DollarSign,
    User,
    MoreVertical,
    X,
    ChevronDown
} from 'lucide-react';

export default function FolioManagementPage() {
    const [selectedFolioId, setSelectedFolioId] = useState(null);
    const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);

    // Mock Data
    const [folios, setFolios] = useState([
        {
            id: "F001",
            room: "205",
            guestName: "Jane Smith",
            checkInDate: "09/01/2026",
            totalCharges: 1460,
            totalPaid: 1000,
            balance: 460,
            status: "Active",
            transactions: [
                { id: "T1", date: "09/01/2026", description: "Room Charge - Night 1", category: "Room", charge: 450, payment: 0 },
                { id: "T2", date: "09/01/2026", description: "Advance Payment", category: "Payment", charge: 0, payment: 1000 },
                { id: "T3", date: "10/01/2026", description: "Room Charge - Night 2", category: "Room", charge: 450, payment: 0 },
                { id: "T4", date: "10/01/2026", description: "Restaurant - Dinner", category: "Restaurant", charge: 85, payment: 0 },
                { id: "T5", date: "11/01/2026", description: "Room Charge - Night 3", category: "Room", charge: 450, payment: 0 },
                { id: "T6", date: "11/01/2026", description: "Laundry Service", category: "Extra", charge: 25, payment: 0 },
            ]
        },
        {
            id: "F002",
            room: "103",
            guestName: "Bob Wilson",
            checkInDate: "08/01/2026",
            totalCharges: 780,
            totalPaid: 500,
            balance: 280,
            status: "Active",
            transactions: [
                { id: "T1", date: "08/01/2026", description: "Room Charge - Night 1", category: "Room", charge: 350, payment: 0 },
                { id: "T2", date: "08/01/2026", description: "Deposit", category: "Payment", charge: 0, payment: 500 },
                { id: "T3", date: "09/01/2026", description: "Room Charge - Night 2", category: "Room", charge: 350, payment: 0 },
                { id: "T4", date: "09/01/2026", description: "Mini Bar", category: "Extra", charge: 80, payment: 0 },
            ]
        }
    ]);

    const selectedFolio = folios.find(f => f.id === selectedFolioId);

    const handleAddCharge = (newCharge) => {
        if (!selectedFolio) return;

        const updatedFolios = folios.map(folio => {
            if (folio.id === selectedFolioId) {
                const chargeAmount = parseFloat(newCharge.amount);
                return {
                    ...folio,
                    totalCharges: folio.totalCharges + chargeAmount,
                    balance: folio.balance + chargeAmount,
                    transactions: [
                        ...folio.transactions,
                        {
                            id: `T${Date.now()}`,
                            date: new Date().toLocaleDateString('en-US'), // Simple date format
                            description: newCharge.description,
                            category: newCharge.category,
                            charge: chargeAmount,
                            payment: 0
                        }
                    ]
                };
            }
            return folio;
        });

        setFolios(updatedFolios);
        setIsAddChargeModalOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 max-w-[1600px] mx-auto space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">Folio Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage guest folios and charges</p>
            </div>

            {/* Folio Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {folios.map((folio) => (
                    <FolioCard
                        key={folio.id}
                        folio={folio}
                        isSelected={selectedFolioId === folio.id}
                        onClick={() => setSelectedFolioId(folio.id)}
                    />
                ))}
            </div>

            {/* Folio Details Section */}
            <AnimatePresence mode="wait">
                {selectedFolio && (
                    <motion.div
                        key={selectedFolio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Folio Details - Room {selectedFolio.room}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{selectedFolio.guestName}</p>
                            </div>
                            <button
                                onClick={() => setIsAddChargeModalOpen(true)}
                                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-md shadow-purple-500/20"
                            >
                                <Plus size={16} />
                                Add Charge
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Description</th>
                                        <th className="px-6 py-4 font-semibold">Category</th>
                                        <th className="px-6 py-4 font-semibold text-right">Charges</th>
                                        <th className="px-6 py-4 font-semibold text-right">Payments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {selectedFolio.transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-gray-700 dark:text-gray-300">
                                            <td className="px-6 py-4 whitespace-nowrap">{t.date}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.description}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium">
                                                {t.charge > 0 ? `$${t.charge}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">
                                                {t.payment > 0 ? `$${t.payment}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Totals Row */}
                                    <tr className="bg-gray-50/80 dark:bg-gray-700/30 font-bold text-gray-900 dark:text-white border-t-2 border-gray-100 dark:border-gray-600">
                                        <td colSpan="3" className="px-6 py-4 text-right">Total</td>
                                        <td className="px-6 py-4 text-right">${selectedFolio.totalCharges}</td>
                                        <td className="px-6 py-4 text-right text-green-600 dark:text-green-400">${selectedFolio.totalPaid}</td>
                                    </tr>
                                    <tr className="bg-orange-50/50 dark:bg-orange-900/10 font-bold text-gray-900 dark:text-white">
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="flex justify-between items-center">
                                                <span>Balance Due</span>
                                                <span className="text-orange-600 dark:text-orange-400">${selectedFolio.balance}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AddChargeModal
                isOpen={isAddChargeModalOpen}
                onClose={() => setIsAddChargeModalOpen(false)}
                onAdd={handleAddCharge}
            />
        </motion.div>
    );
}

function FolioCard({ folio, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`
        relative group overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 border
        ${isSelected
                    ? 'bg-white dark:bg-gray-800 border-purple-500 ring-1 ring-purple-500 shadow-xl scale-[1.02]'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-lg hover:-translate-y-1'
                }
      `}
        >
            {/* Decorative Gradient Background for Selected State */}
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 pointer-events-none" />
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex flex-col gap-1">
                        <span className={`
                w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border
                ${isSelected
                                ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                                : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 group-hover:border-purple-100 dark:group-hover:bg-purple-900/20 dark:group-hover:text-purple-400 dark:group-hover:border-purple-800 transition-colors'}
              `}>
                            Room {folio.room}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {folio.guestName}
                        </h3>
                    </div>
                    <div className="text-gray-300 dark:text-gray-600 group-hover:text-purple-500 transition-colors">
                        <FileText size={24} strokeWidth={1.5} />
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg w-fit">
                    <Calendar size={14} />
                    <span>In: {folio.checkInDate}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-5">
                    <div>
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Charges</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">${folio.totalCharges}</p>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Paid</p>
                        <p className="font-bold text-green-600 dark:text-green-400 text-lg">${folio.totalPaid}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Due</p>
                        <p className={`font-bold text-lg ${folio.balance > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600'}`}>
                            ${folio.balance}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddChargeModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        amount: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.description || !formData.category || !formData.amount) return;
        onAdd(formData);
        setFormData({ description: '', category: '', amount: '' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">Add Charge</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">New transaction details</p>
                            </div>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-400">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Description <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400 text-sm"
                                        placeholder="e.g. Room Service"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer text-sm"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="" disabled>Select category</option>
                                            <option value="Room">Room Service</option>
                                            <option value="Restaurant">Restaurant</option>
                                            <option value="Bar">Bar</option>
                                            <option value="Laundry">Laundry</option>
                                            <option value="Spa">Spa</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Extra">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Amount ($) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400 text-sm"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>

                                <div className="pt-3 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-medium transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        Add Charge
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
