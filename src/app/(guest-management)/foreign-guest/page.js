"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    FileText,
    CheckCircle,
    Plus,
    Download,
    X,
    ChevronDown
} from 'lucide-react';

export default function ForeignGuestPage() {
    const [activeTab, setActiveTab] = useState('Personal Info');

    // Mock Data
    const [guests, setGuests] = useState([
        { id: 1, name: 'James Wilson', nationality: 'United Kingdom', passport: 'GB123456789', visa: 'VI987654321', visaType: 'Tourist Visa', room: '305', checkIn: '15/01/2026', checkOut: '25/01/2026', purpose: 'Tourism', status: 'Submitted' },
        { id: 2, name: 'Marie Dubois', nationality: 'France', passport: 'FR987654321', visa: 'VI123456789', visaType: 'Business Visa', room: '412', checkIn: '17/01/2026', checkOut: '20/01/2026', purpose: 'Business', status: 'Approved' },
    ]);

    const initialFormState = {
        fullName: '',
        nationality: '',
        passportNumber: '',
        visaNumber: '',
        visaType: 'Tourist Visa',
        arrivalFrom: '',
        nextDestination: '',
        purposeOfVisit: 'Tourism',
        checkInDate: '',
        checkOutDate: '',
        roomNumber: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const stats = [
        { title: 'Total Foreign Guests', value: guests.length, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Pending C-Forms', value: guests.filter(g => g.status === 'Pending' || g.status === 'Submitted').length, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Approved C-Forms', value: guests.filter(g => g.status === 'Approved').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = () => {
        if (!formData.fullName || !formData.passportNumber) {
            alert("Please fill in basic information");
            return;
        }

        const newGuest = {
            id: Date.now(),
            name: formData.fullName,
            nationality: formData.nationality,
            passport: formData.passportNumber,
            visa: formData.visaNumber,
            visaType: formData.visaType,
            room: formData.roomNumber,
            checkIn: formData.checkInDate || new Date().toLocaleDateString('en-GB'),
            checkOut: formData.checkOutDate,
            purpose: formData.purposeOfVisit,
            status: 'Submitted'
        };

        setGuests(prev => [...prev, newGuest]);
        setIsModalOpen(false);
        setFormData(initialFormState);
        setActiveTab('Personal Info');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Personal Info':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary">Passport Number</label>
                                <input
                                    type="text"
                                    name="passportNumber"
                                    value={formData.passportNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary">Visa Number</label>
                                <input
                                    type="text"
                                    name="visaNumber"
                                    value={formData.visaNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary">Visa Type</label>
                            <select
                                name="visaType"
                                value={formData.visaType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm cursor-pointer"
                            >
                                <option>Tourist Visa</option>
                                <option>Business Visa</option>
                                <option>Student Visa</option>
                                <option>Transit Visa</option>
                            </select>
                        </div>
                    </div>
                );
            case 'Travel Details':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary">Arrival From</label>
                            <input
                                type="text"
                                name="arrivalFrom"
                                value={formData.arrivalFrom}
                                onChange={handleInputChange}
                                placeholder="City, Country"
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary">Next Destination</label>
                            <input
                                type="text"
                                name="nextDestination"
                                value={formData.nextDestination}
                                onChange={handleInputChange}
                                placeholder="City, Country"
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary">Purpose of Visit</label>
                            <select
                                name="purposeOfVisit"
                                value={formData.purposeOfVisit}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm cursor-pointer"
                            >
                                <option>Tourism</option>
                                <option>Business</option>
                                <option>Medical</option>
                                <option>Conference</option>
                            </select>
                        </div>
                    </div>
                );
            case 'Stay Information':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary">Check-in Date</label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary">Check-out Date</label>
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary">Room Number</label>
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary font-medium focus:border-accent-primary outline-none transition-all text-sm"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="py-6 space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-gradient">Foreign Guest</h1>
                    <p className="text-secondary mt-1">Manage foreign guest documentation and C-Form</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-bold text-primary hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <Download size={18} />
                        <span>Export C-Forms</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6 flex items-center justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
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

            {/* Registry Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
            >
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-primary">Foreign Guests Registry</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Guest Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Nationality</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Passport</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Visa</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Room</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Check-in/Out</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Purpose</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">C-Form Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {guests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-primary">{guest.name}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.nationality}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.passport}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{guest.visa}</span>
                                            <span className="text-xs text-gray-500">{guest.visaType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.room}</td>
                                    <td className="px-6 py-4 text-sm text-secondary">
                                        <div className="flex flex-col">
                                            <span>{guest.checkIn}</span>
                                            <span className="text-xs text-gray-400">{guest.checkOut}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary">{guest.purpose}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm ${guest.status === 'Submitted'
                                            ? 'bg-accent-primary text-white'
                                            : 'bg-green-500/10 text-green-600 dark:text-green-400'
                                            }`}>
                                            {guest.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Actions placeholder */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
