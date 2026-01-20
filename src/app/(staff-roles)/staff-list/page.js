"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Briefcase,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

const MOCK_STAFF = [
  {
    id: "EMP-001",
    name: "Sarah Johnson",
    role: "General Manager",
    department: "Management",
    status: "Active",
    email: "sarah.j@grandplaza.com",
    phone: "+1 (555) 123-4567",
    shift: "Morning",
    joinDate: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?u=EMP-001"
  },
  {
    id: "EMP-002",
    name: "Michael Chen",
    role: "Head Chef",
    department: "Kitchen",
    status: "Active",
    email: "michael.c@grandplaza.com",
    phone: "+1 (555) 234-5678",
    shift: "Evening",
    joinDate: "2024-02-01",
    avatar: "https://i.pravatar.cc/150?u=EMP-002"
  },
  {
    id: "EMP-003",
    name: "Jessica Davis",
    role: "Front Desk Agent",
    department: "Reception",
    status: "Inactive",
    email: "jessica.d@grandplaza.com",
    phone: "+1 (555) 345-6789",
    shift: "Night",
    joinDate: "2024-03-10",
    avatar: "https://i.pravatar.cc/150?u=EMP-003"
  },
  {
    id: "EMP-004",
    name: "David Wilson",
    role: "Housekeeping Lead",
    department: "Housekeeping",
    status: "Active",
    email: "david.w@grandplaza.com",
    phone: "+1 (555) 456-7890",
    shift: "Morning",
    joinDate: "2024-01-20",
    avatar: "https://i.pravatar.cc/150?u=EMP-004"
  },
  {
    id: "EMP-005",
    name: "Emily Brown",
    role: "Concierge",
    department: "Front Office",
    status: "Active",
    email: "emily.b@grandplaza.com",
    phone: "+1 (555) 567-8901",
    shift: "Evening",
    joinDate: "2024-04-05",
    avatar: "https://i.pravatar.cc/150?u=EMP-005"
  }
];

export default function StaffListPage() {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [activeTab, setActiveTab] = useState('All Staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null); // For View Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // For Add/Edit Form

  // Form State
  const [formData, setFormData] = useState({
    name: '', role: '', department: '', email: '', phone: '', shift: 'Morning', status: 'Active'
  });

  // Derived Data
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All Staff' ||
      (activeTab === 'Management' && staff.department === 'Management') ||
      (activeTab === 'Service' && ['Reception', 'Front Office', 'Housekeeping'].includes(staff.department)) ||
      (activeTab === 'Kitchen' && staff.department === 'Kitchen');
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: staffList.length,
    active: staffList.filter(s => s.status === 'Active').length,
    inactive: staffList.filter(s => s.status === 'Inactive').length,
    departments: new Set(staffList.map(s => s.department)).size
  };

  // Handlers
  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({ name: '', role: '', department: '', email: '', phone: '', shift: 'Morning', status: 'Active' });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setIsFormModalOpen(true);
    setSelectedStaff(null); // Close view modal if open
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(prev => prev.filter(s => s.id !== id));
      setSelectedStaff(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      // Edit
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
    } else {
      // Add
      const newStaff = {
        id: `EMP-${String(staffList.length + 1).padStart(3, '0')}`,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}` // Random avatar
      };
      setStaffList([newStaff, ...staffList]);
    }
    setIsFormModalOpen(false);
  };

  // Standard Styles
  const btnPrimary = "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-95";
  const btnSecondary = "px-5 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--border-color)] transition-colors";
  const btnTab = "px-4 py-1.5 rounded-md text-sm font-medium transition-all";
  const cardStyle = "bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden";
  const inputStyle = "w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all";

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Staff Directory</h1>
          <p className="text-[var(--text-secondary)]">Manage your hotel staff and departments</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className={btnPrimary}
        >
          <UserPlus size={18} />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Staff"
          value={stats.total}
          icon={<Users size={20} className="text-blue-600 dark:text-blue-400" />}
          bg="bg-blue-50 dark:bg-blue-900/20"
          border="border-blue-100 dark:border-blue-800"
        />
        <StatsCard
          title="Active Now"
          value={stats.active}
          icon={<CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
          bg="bg-green-50 dark:bg-green-900/20"
          border="border-green-100 dark:border-green-800"
        />
        <StatsCard
          title="Inactive"
          value={stats.inactive}
          icon={<Clock size={20} className="text-amber-600 dark:text-amber-400" />}
          bg="bg-amber-50 dark:bg-amber-900/20"
          border="border-amber-100 dark:border-amber-800"
        />
        <StatsCard
          title="Departments"
          value={stats.departments}
          icon={<Briefcase size={20} className="text-purple-600 dark:text-purple-400" />}
          bg="bg-purple-50 dark:bg-purple-900/20"
          border="border-purple-100 dark:border-purple-800"
        />
      </div>

      {/* Main Content Card */}
      <div className={`${cardStyle} min-h-[500px]`}>
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Tabs */}
          <div className="flex bg-[var(--bg-primary)] p-1 rounded-lg">
            {['All Staff', 'Management', 'Service', 'Kitchen'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${btnTab} ${activeTab === tab
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputStyle} pl-10`}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-primary)]/50 text-xs uppercase font-semibold text-[var(--text-secondary)]">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Shift</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    No staff members found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    className="hover:bg-[var(--bg-primary)]/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--bg-secondary)] shadow-sm" />
                        <div>
                          <h3 className="font-bold text-[var(--text-primary)]">{staff.name}</h3>
                          <p className="text-xs text-[var(--text-secondary)]">{staff.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--text-primary)]">{staff.role}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{staff.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={staff.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-primary)] text-xs font-medium text-[var(--text-secondary)]">
                        <Clock size={12} />
                        {staff.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(staff); }}
                          className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(staff.id); }}
                          className="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
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

      {/* Staff Details Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStaff(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex justify-between items-end mb-6">
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    className="w-24 h-24 rounded-2xl border-4 border-[var(--bg-secondary)] shadow-lg object-cover bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(selectedStaff)}
                      className="p-2 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--border-color)] transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedStaff.id)}
                      className="p-2 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl hover:bg-[var(--danger)]/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedStaff.name}</h2>
                  <p className="text-[var(--accent-primary)] font-medium">{selectedStaff.role} • {selectedStaff.department}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Employee ID</p>
                    <p className="font-semibold text-[var(--text-primary)]">{selectedStaff.id}</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${selectedStaff.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {selectedStaff.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-primary)] transition-colors">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Email Address</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{selectedStaff.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-primary)] transition-colors">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Phone Number</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{selectedStaff.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-primary)] transition-colors">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Shift Timing</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{selectedStaff.shift}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]/30">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Fill in the employee details below</p>
                </div>
                <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors text-[var(--text-secondary)]">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" required />
                  <FormInput label="Role/Position" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Chef" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect label="Department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} options={['Management', 'Kitchen', 'Reception', 'Housekeeping', 'Front Office']} required />
                  <FormSelect label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={['Active', 'Inactive']} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Email Address" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" />
                  <FormInput label="Phone Number" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" />
                </div>
                <div>
                  <FormSelect label="Shift" value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })} options={['Morning', 'Evening', 'Night']} />
                </div>
              </form>

              <div className="p-5 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-primary)]/30">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className={btnSecondary}>
                  Cancel
                </button>
                <button onClick={handleSubmit} className={btnPrimary}>
                  {editingStaff ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Components
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' :
    'bg-gray-50 text-gray-700 border border-gray-200'
    }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
    {status}
  </span>
);

const FormInput = ({ label, type = "text", ...props }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all hover:bg-[var(--bg-secondary)]"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative">
      <select
        className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all hover:bg-[var(--bg-secondary)]"
        {...props}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </div>
    </div>
  </div>
);

function StatsCard({ title, value, icon, bg, border }) {
  return (
    <div className={`p-5 rounded-2xl border ${border} ${bg} flex items-start justify-between transition-all hover:shadow-md`}>
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1 opacity-80">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">{value}</h3>
      </div>
      <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
    </div>
  );
}
