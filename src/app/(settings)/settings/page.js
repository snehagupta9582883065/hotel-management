"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Shield,
    Bell,
    Database,
    FileText,
    CreditCard,
    Save,
    RotateCcw,
    Download,
    Plus,
    Trash2,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Lock,
    Mail,
    Smartphone,
    Globe,
    Clock,
    X
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('system');

    const TABS = [
        { id: 'system', label: 'System', icon: Settings },
        { id: 'tax', label: 'Taxation', icon: FileText },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'backup', label: 'Backup & Restore', icon: Database },
        { id: 'audit', label: 'Audit Logs', icon: Shield },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'system': return <SystemSettings />;
            case 'tax': return <TaxSettings />;
            case 'notifications': return <NotificationSettings />;
            case 'backup': return <BackupSettings />;
            case 'audit': return <AuditLogs />;
            case 'subscription': return <SubscriptionSettings />;
            default: return <SystemSettings />;
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10 text-[var(--text-primary)] min-h-[calc(100vh-100px)]">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-purple-600 mb-2">Admin & Settings</h1>
                <p className="text-[var(--text-secondary)]">Manage system configurations, security, and preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 shrink-0 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden p-2">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
                                ? 'bg-purple-600/10 text-purple-600 shadow-sm'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full min-w-0">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

/* ================= SUB-COMPONENTS ================= */

// 1. SYSTEM SETTINGS
function SystemSettings() {
    const [formData, setFormData] = useState({
        hotelName: 'Grand Plaza Hotel',
        email: 'admin@grandplaza.com',
        phone: '+1 (555) 123-4567',
        website: 'https://www.grandplaza.com',
        address: '123 Luxury Ave, Beverly Hills, CA 90210',
        currency: 'USD ($)',
        timezone: '(GMT-08:00) Pacific Time',
        dateFormat: 'MM/DD/YYYY'
    });
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('System settings have been saved successfully.');
        }, 1000);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Hotel Name" value={formData.hotelName} onChange={(e) => handleChange('hotelName', e.target.value)} />
                    <InputGroup label="Contact Email" value={formData.email} type="email" onChange={(e) => handleChange('email', e.target.value)} />
                    <InputGroup label="Contact Phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    <InputGroup label="Website URL" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} />
                    <div className="md:col-span-2">
                        <InputGroup label="Address" value={formData.address} isTextarea onChange={(e) => handleChange('address', e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectGroup label="Currency" value={formData.currency} onChange={(e) => handleChange('currency', e.target.value)} options={['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)']} />
                    <SelectGroup label="Timezone" value={formData.timezone} onChange={(e) => handleChange('timezone', e.target.value)} options={['(GMT-08:00) Pacific Time', '(GMT+00:00) UTC', '(GMT+05:30) IST']} />
                    <SelectGroup label="Date Format" value={formData.dateFormat} onChange={(e) => handleChange('dateFormat', e.target.value)} options={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']} />
                </div>
            </div>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <AlertTriangle size={20} className="text-amber-500" />
                            Maintenance Mode
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                            Prevent non-admin users from accessing the system.
                        </p>
                    </div>
                    <ToggleSwitch checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                </div>
            </div>

            <div className="flex justify-end">
                <SettingsButton primary onClick={handleSave} icon={isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />} label={isSaving ? "Saving..." : "Save Changes"} />
            </div>
        </div>
    );
}

// 2. TAX SETTINGS
function TaxSettings() {
    const [taxes, setTaxes] = useState([
        { id: 1, name: 'GST', rate: 18, type: 'Inclusive', status: 'Active' },
        { id: 2, name: 'Service Charge', rate: 5, type: 'Exclusive', status: 'Active' },
        { id: 3, name: 'City Tax', rate: 2.5, type: 'Exclusive', status: 'Inactive' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTax, setNewTax] = useState({ name: '', rate: '', type: 'Exclusive', status: 'Active' });

    const handleAddTax = () => {
        if (!newTax.name || !newTax.rate) return;
        const taxEntry = {
            id: Date.now(),
            name: newTax.name,
            rate: parseFloat(newTax.rate),
            type: newTax.type,
            status: newTax.status
        };
        setTaxes([...taxes, taxEntry]);
        setIsModalOpen(false);
        setNewTax({ name: '', rate: '', type: 'Exclusive', status: 'Active' });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this tax rule?')) {
            setTaxes(taxes.filter(t => t.id !== id));
        }
    };

    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Tax Configuration</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Manage tax rates and rules</p>
                </div>
                <SettingsButton onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />} label="Add New Tax" />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-secondary)]">
                            <th className="py-3 px-4 font-semibold">Tax Name</th>
                            <th className="py-3 px-4 font-semibold">Percentage</th>
                            <th className="py-3 px-4 font-semibold">Type</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {taxes.map(tax => (
                            <tr key={tax.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{tax.name}</td>
                                <td className="py-3 px-4 text-[var(--text-primary)]">{tax.rate}%</td>
                                <td className="py-3 px-4 text-[var(--text-secondary)]">{tax.type}</td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={tax.status} />
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleDelete(tax.id)} className="text-[var(--danger)] hover:bg-[var(--danger)]/10 p-2 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Tax Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Add New Tax Rule</h3>
                                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-[var(--text-secondary)]" /></button>
                                </div>
                                <div className="space-y-4">
                                    <InputGroup label="Tax Name" value={newTax.name} onChange={(e) => setNewTax({ ...newTax, name: e.target.value })} placeholder="e.g. VAT" />
                                    <InputGroup label="Rate (%)" type="number" value={newTax.rate} onChange={(e) => setNewTax({ ...newTax, rate: e.target.value })} placeholder="0" />
                                    <SelectGroup label="Type" value={newTax.type} onChange={(e) => setNewTax({ ...newTax, type: e.target.value })} options={['Inclusive', 'Exclusive']} />
                                    <SelectGroup label="Status" value={newTax.status} onChange={(e) => setNewTax({ ...newTax, status: e.target.value })} options={['Active', 'Inactive']} />
                                    <SettingsButton primary onClick={handleAddTax} label="Add Tax Rule" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 3. NOTIFICATION SETTINGS
function NotificationSettings() {
    const [isSaving, setIsSaving] = useState(false);

    // In a real app, this state would be lifted or managed via Context
    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Notification preferences updated!');
        }, 800);
    };

    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Notification Preferences</h3>

                <div className="space-y-6">
                    <NotificationGroup
                        title="Booking Alerts"
                        description="Receive notifications for new bookings and cancellations."
                        icon={<Globe size={20} className="text-blue-500" />}
                    />
                    <NotificationGroup
                        title="System Updates"
                        description="Get notified about maintenance and software updates."
                        icon={<RefreshCw size={20} className="text-purple-500" />}
                    />
                    <NotificationGroup
                        title="Security Alerts"
                        description="Login attempts and password change alerts."
                        icon={<Lock size={20} className="text-amber-500" />}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
                <SettingsButton primary icon={isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />} onClick={handleSave} label={isSaving ? "Saving..." : "Save Preferences"} />
            </div>
        </div>
    );
}

function NotificationGroup({ title, description, icon }) {
    const [toggles, setToggles] = useState({ email: true, push: true, sms: false });

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-color)]">
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[var(--bg-secondary)] rounded-lg shadow-sm border border-[var(--border-color)] hidden sm:block">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{title}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{description}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                <CheckboxLabel label="Email" checked={toggles.email} onChange={() => setToggles(p => ({ ...p, email: !p.email }))} icon={<Mail size={14} />} />
                <CheckboxLabel label="Push" checked={toggles.push} onChange={() => setToggles(p => ({ ...p, push: !p.push }))} icon={<Bell size={14} />} />
                <CheckboxLabel label="SMS" checked={toggles.sms} onChange={() => setToggles(p => ({ ...p, sms: !p.sms }))} icon={<Smartphone size={14} />} />
            </div>
        </div>
    )
}


// 4. BACKUP & RESTORE
function BackupSettings() {
    const [backups, setBackups] = useState([
        { id: 1, name: 'auto_backup_weekly.sql', date: 'Oct 24, 2025 - 02:00 AM', size: '12.5 MB' },
        { id: 2, name: 'manual_backup_v2.sql', date: 'Oct 20, 2025 - 04:15 PM', size: '12.4 MB' },
        { id: 3, name: 'auto_backup_weekly.sql', date: 'Oct 17, 2025 - 02:00 AM', size: '11.8 MB' },
    ]);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateBackup = () => {
        setIsCreating(true);
        setTimeout(() => {
            const newBackup = {
                id: Date.now(),
                name: `manual_backup_${new Date().toISOString().split('T')[0]}.sql`,
                date: new Date().toLocaleString(),
                size: '12.6 MB'
            };
            setBackups([newBackup, ...backups]);
            setIsCreating(false);
        }, 2000);
    };

    const handleDownload = (name) => {
        alert(`Downloading ${name}...`);
    };

    const handleRestore = (name) => {
        if (confirm(`Are you sure you want to restore the system to ${name}? This will restart the application.`)) {
            alert('System restore initiated. Please wait...');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Database Backup</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Create a manual backup of your entire system.</p>
                </div>
                <SettingsButton onClick={handleCreateBackup} icon={isCreating ? <RefreshCw className="animate-spin" size={18} /> : <Database size={18} />} label={isCreating ? "Creating Backup..." : "Create Backup Now"} />
            </div>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Recent Backups</h3>
                <div className="space-y-3">
                    {backups.map(backup => (
                        <div key={backup.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--accent-primary)]">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[var(--text-primary)]">{backup.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {backup.date}</span>
                                        <span>•</span>
                                        <span>{backup.size}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDownload(backup.name)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-lg transition-colors" title="Download">
                                    <Download size={18} />
                                </button>
                                <button onClick={() => handleRestore(backup.name)} className="p-2 text-[var(--text-secondary)] hover:text-green-600 hover:bg-green-500/10 rounded-lg transition-colors" title="Restore">
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 5. AUDIT LOGS
function AuditLogs() {
    const LOGS = [
        { id: 1, user: 'Admin User', action: 'Modified Tax Settings', module: 'Settings', ip: '192.168.1.5', time: '10 mins ago' },
        { id: 2, user: 'Sarah Johnson', action: 'Checked In Guest G005', module: 'Front Office', ip: '192.168.1.12', time: '25 mins ago' },
        { id: 3, user: 'System', action: 'Auto Backup Completed', module: 'System', ip: 'localhost', time: '2 hours ago' },
        { id: 4, user: 'Michael Chen', action: 'Updated Menu Item', module: 'Restaurant', ip: '192.168.1.8', time: '4 hours ago' },
        { id: 5, user: 'Admin User', action: 'Added New Staff Member', module: 'Staff', ip: '192.168.1.5', time: 'Yesterday' },
    ];

    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">System Audit Logs</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Track all user activities and system events</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:underline">
                    <Download size={16} /> Export Logs
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-secondary)]">
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Action</th>
                            <th className="py-3 px-4">Module</th>
                            <th className="py-3 px-4">IP Address</th>
                            <th className="py-3 px-4 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {LOGS.map(log => (
                            <tr key={log.id} className="text-sm hover:bg-[var(--bg-primary)]/50 transition-colors">
                                <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{log.user}</td>
                                <td className="py-3 px-4 text-[var(--text-primary)]">{log.action}</td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex px-2 py-0.5 rounded textxs font-medium bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                                        {log.module}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-[var(--text-secondary)] font-mono text-xs">{log.ip}</td>
                                <td className="py-3 px-4 text-right text-[var(--text-secondary)]">{log.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// 6. SUBSCRIPTION
function SubscriptionSettings() {
    const [activePlan, setActivePlan] = useState({
        name: 'SMART CHAIN',
        type: 'Professional Plan',
        status: 'Active',
        renewalDate: 'Nov 01, 2026',
        price: '₹39,999/year',
        billing: 'Yearly'
    });
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const RESOURCE_USAGE = [
        { label: 'Properties', used: 2, total: 4, color: 'text-blue-600 bg-blue-600' },
        { label: 'Rooms', used: 45, total: 80, color: 'text-purple-600 bg-purple-600' },
        { label: 'Users', used: 4, total: 6, color: 'text-green-600 bg-green-600' }
    ];

    const BILLING_HISTORY = [
        { id: 1, date: 'Nov 01, 2025', amount: '₹39,999', status: 'Paid', invoice: 'INV-2025-001' },
        { id: 2, date: 'Nov 01, 2024', amount: '₹39,999', status: 'Paid', invoice: 'INV-2024-001' },
    ];

    const ACTIVE_ADDONS = [
        'Guest CRM & Foreign Guest Management',
        'Restaurant Management',
        'Reports & Analytics (PDF / Excel)'
    ];

    const AVAILABLE_PLANS = [
        { name: 'SOLO STAY', type: 'Starter Plan', price: '₹14,999/year' },
        { name: 'SMART CHAIN', type: 'Professional Plan', price: '₹39,999/year' },
        { name: 'GRAND SUITE', type: 'Enterprise Plan', price: 'Custom' }
    ];

    const handleSelectPlan = (plan) => {
        if (confirm(`Are you sure you want to switch to the ${plan.name}?`)) {
            setActivePlan(prev => ({
                ...prev,
                name: plan.name,
                type: plan.type,
                price: plan.price
            }));
            setShowPlanModal(false);
            alert(`Successfully switched to ${plan.name}!`);
        }
    };

    const handleDownloadInvoice = (id) => {
        alert(`Downloading invoice ${id}... Check your downloads folder.`);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Current Plan & Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plan Details Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <CreditCard size={180} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                    {activePlan.status}
                                </span>
                                <h2 className="text-3xl font-bold mb-1">{activePlan.name}</h2>
                                <p className="opacity-90">{activePlan.type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{activePlan.price}</p>
                                <p className="text-sm opacity-80">Next billing: {activePlan.renewalDate}</p>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 mb-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">Resource Usage</h4>
                            <div className="space-y-4">
                                {RESOURCE_USAGE.map((res, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{res.label}</span>
                                            <span className="font-bold">{res.used} / {res.total}</span>
                                        </div>
                                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-white`}
                                                style={{ width: `${(res.used / res.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowPlanModal(true)} className="px-6 py-2.5 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
                                Change Plan
                            </button>
                            <button onClick={() => setShowPaymentModal(true)} className="px-6 py-2.5 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                                Manage Payment Method
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Features / Addons */}
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-[var(--accent-primary)]" />
                        Included Features
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {ACTIVE_ADDONS.map((addon, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                                <div className="mt-0.5 text-green-500">
                                    <CheckCircle size={14} />
                                </div>
                                <span className="text-sm text-[var(--text-secondary)] font-medium leading-tight">{addon}</span>
                            </div>
                        ))}
                        <div className="p-3 rounded-xl border border-dashed border-[var(--border-color)] text-center">
                            <p className="text-xs text-[var(--text-secondary)] mb-2">Want more features?</p>
                            <button onClick={() => alert("Browse Add-ons feature coming soon!")} className="text-xs font-bold text-purple-600 hover:underline">View All Add-ons</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Billing History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-secondary)]">
                                <th className="py-3 px-4">Invoice ID</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {BILLING_HISTORY.map(bill => (
                                <tr key={bill.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                    <td className="py-3 px-4 font-mono text-xs text-[var(--text-secondary)]">{bill.invoice}</td>
                                    <td className="py-3 px-4 text-sm text-[var(--text-primary)]">{bill.date}</td>
                                    <td className="py-3 px-4 text-sm font-bold text-[var(--text-primary)]">{bill.amount}</td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={bill.status} />
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => handleDownloadInvoice(bill.invoice)} className="p-2 text-[var(--text-secondary)] hover:text-purple-600 transition-colors">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showPlanModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowPlanModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)] max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Change Subscription Plan</h3>
                                    <button onClick={() => setShowPlanModal(false)}><X size={20} className="text-[var(--text-secondary)]" /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {AVAILABLE_PLANS.map((plan, i) => (
                                        <div key={i} className={`p-4 rounded-xl border cursor-pointer transition-all ${activePlan.name === plan.name ? 'border-purple-600 bg-purple-600/5 ring-2 ring-purple-600' : 'border-[var(--border-color)] hover:border-purple-600'}`}
                                            onClick={() => handleSelectPlan(plan)}>
                                            <h4 className="font-bold text-[var(--text-primary)]">{plan.name}</h4>
                                            <p className="text-sm text-[var(--text-secondary)]">{plan.type}</p>
                                            <p className="text-xl font-bold text-[var(--accent-primary)] mt-2">{plan.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Payment Methods</h3>
                                    <button onClick={() => setShowPaymentModal(false)}><X size={20} className="text-[var(--text-secondary)]" /></button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold tracking-wider">VISA</div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-[var(--text-primary)]">•••• 4242</p>
                                                <p className="text-xs text-[var(--text-secondary)]">Expires 12/28</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2 py-1 rounded">Default</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] opacity-60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-orange-600 rounded flex items-center justify-center text-white text-[10px] font-bold tracking-wider">MC</div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-[var(--text-primary)]">•••• 5599</p>
                                                <p className="text-xs text-[var(--text-secondary)]">Expires 09/25</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full py-2.5 mt-2 rounded-xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-secondary)] font-medium hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all flex items-center justify-center gap-2">
                                        <Plus size={16} /> Add New Card
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ================= UI HELPERS =================

const InputGroup = ({ label, value, onChange, placeholder, type = "text", isTextarea = false }) => (
    <div>
        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{label}</label>
        {isTextarea ? (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[80px]"
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            />
        )}
    </div>
);

const SelectGroup = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const SettingsButton = ({ label, icon, primary = false, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all transform hover:scale-[1.02] shadow-sm ${primary
            ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20'
            : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--border-color)]'
            }`}>
        {icon}
        <span>{label}</span>
    </button>
);

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
        {status}
    </span>
);

const CheckboxLabel = ({ label, checked, onChange, icon }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked
            ? 'bg-purple-600 border-purple-600 text-white'
            : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-transparent group-hover:border-purple-600'
            }`}>
            <CheckCircle size={12} fill="currentColor" className={checked ? 'opacity-100' : 'opacity-0'} />
            <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
            <span className="text-[var(--text-secondary)]">{icon}</span>
            {label}
        </div>
    </label>
);