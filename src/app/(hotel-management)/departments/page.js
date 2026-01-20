"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Users,
    Briefcase,
    MoreVertical,
    Edit2,
    Trash2,
    X,
    CheckCircle,
    Clock
} from 'lucide-react';

const MOCK_DEPARTMENTS = [
    {
        id: "DEPT-001",
        name: "Management",
        head: "Sarah Johnson",
        staffCount: 5,
        status: "Active",
        description: "Executive leadership and administration",
        createdAt: "2024-01-01"
    },
    {
        id: "DEPT-002",
        name: "Kitchen",
        head: "Michael Chen",
        staffCount: 12,
        status: "Active",
        description: "Food preparation and culinary operations",
        createdAt: "2024-01-15"
    },
    {
        id: "DEPT-003",
        name: "Front Office",
        head: "Jessica Davis",
        staffCount: 8,
        status: "Active",
        description: "Guest reception and reservations",
        createdAt: "2024-02-01"
    },
    {
        id: "DEPT-004",
        name: "Housekeeping",
        head: "David Wilson",
        staffCount: 15,
        status: "Active",
        description: "Room cleaning and maintenance",
        createdAt: "2024-01-20"
    },
    {
        id: "DEPT-005",
        name: "Security",
        head: "Robert Black",
        staffCount: 6,
        status: "Active",
        description: "Safety and surveillance",
        createdAt: "2024-03-10"
    }
];

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        head: '',
        description: '',
        status: 'Active'
    });

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingDept(null);
        setFormData({ name: '', head: '', description: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (dept) => {
        setEditingDept(dept);
        setFormData({ ...dept });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this department?')) {
            setDepartments(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingDept) {
            setDepartments(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...formData } : d));
        } else {
            const newDept = {
                id: `DEPT-${String(departments.length + 1).padStart(3, '0')}`,
                ...formData,
                staffCount: 0,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setDepartments([...departments, newDept]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto text-[var(--text-primary)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-purple-600 mb-2">Departments</h1>
                    <p className="text-[var(--text-secondary)]">Manage hotel departments and structure</p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add Department</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Departments"
                    value={departments.length}
                    icon={<Building2 size={24} className="text-purple-600" />}
                    bg="bg-purple-50 dark:bg-purple-900/20"
                    border="border-purple-100 dark:border-purple-800"
                />
                <StatsCard
                    title="Total Staff"
                    value={departments.reduce((acc, curr) => acc + curr.staffCount, 0)}
                    icon={<Users size={24} className="text-blue-600" />}
                    bg="bg-blue-50 dark:bg-blue-900/20"
                    border="border-blue-100 dark:border-blue-800"
                />
                <StatsCard
                    title="Active Departments"
                    value={departments.filter(d => d.status === 'Active').length}
                    icon={<CheckCircle size={24} className="text-green-600" />}
                    bg="bg-green-50 dark:bg-green-900/20"
                    border="border-green-100 dark:border-green-800"
                />
            </div>

            {/* Main Content */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden min-h-[500px]">
                {/* Toolbar */}
                <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h2 className="text-lg font-bold">All Departments</h2>
                    <div className="relative w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                        />
                    </div>
                </div>

                {/* Grid View of Departments */}
                {/* Grid View of Departments */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredDepartments.map((dept) => (
                        <motion.div
                            key={dept.id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="group relative bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase size={22} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button onClick={() => handleOpenEdit(dept)} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-purple-600 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(dept.id)} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 relative z-10">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-purple-600 transition-colors">{dept.name}</h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{dept.description}</p>
                            </div>

                            <div className="space-y-4 pt-5 border-t border-[var(--border-color)] relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-secondary)] font-medium">Head of Dept</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                            {dept.head.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-[var(--text-primary)]">{dept.head}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-secondary)] font-medium">Team Size</span>
                                    <span className="font-semibold text-[var(--text-primary)] flex items-center gap-2 bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                                        <Users size={14} className="text-blue-500" />
                                        {dept.staffCount}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-secondary)] font-medium">Status</span>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${dept.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                                        {dept.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add New Card Button */}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleOpenAdd}
                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-secondary)] hover:border-purple-500/50 hover:text-purple-600 hover:bg-purple-50/10 transition-all group min-h-[300px]"
                    >
                        <div className="p-5 rounded-full bg-[var(--bg-secondary)] group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors shadow-sm">
                            <Plus size={28} />
                        </div>
                        <div className="text-center">
                            <span className="block text-lg font-bold mb-1">Add New Department</span>
                            <span className="text-xs opacity-70">Create a new department card</span>
                        </div>
                    </motion.button>
                </motion.div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]/30">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">{editingDept ? 'Edit Department' : 'Add Department'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors text-[var(--text-secondary)]">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Department Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Marketing"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Head of Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.head}
                                        onChange={e => setFormData({ ...formData, head: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of responsibilities..."
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--border-color)] transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all">
                                        {editingDept ? 'Save Changes' : 'Create Department'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function StatsCard({ title, value, icon, bg, border }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl border ${border} ${bg} relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                {React.cloneElement(icon, { size: 64 })}
            </div>

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{value}</h3>
                </div>
                <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl backdrop-blur-md shadow-sm">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}
