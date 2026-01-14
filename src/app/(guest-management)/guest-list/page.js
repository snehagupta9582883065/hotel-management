"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  FileText,
  X
} from 'lucide-react';

export default function GuestListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Mock Data
  const [guests, setGuests] = useState([
    {
      id: "G001",
      name: "John Doe",
      mobile: "+1-555-0101",
      email: "john@email.com",
      nationality: "USA",
      type: "Regular",
      totalStays: 5,
      totalSpent: 2500,
      lastVisit: "05/01/2026",
      dob: "15/08/1985",
      gender: "Male",
      idType: "Passport",
      idNumber: "P12345678",
      address: "123 Main St, New York, NY 10001",
      history: [
        { room: "201 - Suite", date: "Dec 15-18, 2025", amount: 1350 },
        { room: "305 - Deluxe", date: "Nov 8-10, 2025", amount: 500 }
      ]
    },
    {
      id: "G002",
      name: "Jane Smith",
      mobile: "+1-555-0102",
      email: "jane@email.com",
      nationality: "UK",
      type: "VIP",
      totalStays: 12,
      totalSpent: 8900,
      lastVisit: "08/01/2026",
      dob: "22/11/1990",
      gender: "Female",
      idType: "Driver License",
      idNumber: "DL98765432",
      address: "45 Oxford St, London, UK",
      history: []
    },
    {
      id: "G003",
      name: "Raj Patel",
      mobile: "+91-98765-43210",
      email: "raj@email.com",
      nationality: "India",
      type: "Regular",
      totalStays: 3,
      totalSpent: 1200,
      lastVisit: "20/12/2025",
      dob: "10/05/1988",
      gender: "Male",
      idType: "Aadhaar",
      idNumber: "1234-5678-9012",
      address: "Mumbai, India",
      history: []
    }
  ]);

  // Filter Logic
  const filteredGuests = guests.filter(guest => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.mobile.includes(searchQuery) ||
      guest.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All Types' || guest.type === filterType;

    return matchesSearch && matchesType;
  });

  const getGuestTypeColor = (type) => {
    switch (type) {
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Corporate': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleViewProfile = (guest) => {
    setSelectedGuest(guest);
    setIsProfileModalOpen(true);
  };

  // Standard Styles
  const btnPrimary = "flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02]";
  const btnIcon = "p-1.5 text-[var(--text-secondary)] hover:text-purple-600 hover:bg-purple-600/10 rounded-lg transition-colors";
  const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-[var(--bg-primary)] border border-transparent rounded-xl focus:ring-2 focus:ring-purple-600/20 text-[var(--text-primary)] transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-2 max-w-[1600px] mx-auto space-y-8 text-[var(--text-primary)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Guest List</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage guest profiles and history</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={btnPrimary}
        >
          <Plus size={20} />
          <span className="font-medium">Add Guest</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl shadow-sm border border-[var(--border-color)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Search by name, mobile, or guest ID..."
            className={inputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              className="appearance-none bg-[var(--bg-primary)] pl-4 pr-10 py-2.5 rounded-xl border-none text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 cursor-pointer font-medium"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>All Types</option>
              <option>Regular</option>
              <option>VIP</option>
              <option>Corporate</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-color)]">
        <div className="">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[var(--bg-primary)]/50 border-b border-[var(--border-color)]">
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-20">ID</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-32">Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-32">Mobile</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-40">Email</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-24">Nation</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-24">Type</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-24">Stays</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-24">Spent</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-28">Last Visit</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-[var(--text-primary)] truncate">{guest.id}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--text-primary)] font-medium truncate" title={guest.name}>{guest.name}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)] truncate">{guest.mobile}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)] truncate" title={guest.email}>{guest.email}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)] truncate">{guest.nationality}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getGuestTypeColor(guest.type)}`}>
                      {guest.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)]">{guest.totalStays}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">${guest.totalSpent.toLocaleString()}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)]">{guest.lastVisit}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleViewProfile(guest)}
                        className={btnIcon}
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button className={btnIcon} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className={btnIcon} title="History">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGuests.length === 0 && (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            <p className="text-lg font-medium">No guests found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Guest Modal & Profile Modal placeholders */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddGuestModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(newGuest) => {
              setGuests([newGuest, ...guests]);
              setIsAddModalOpen(false);
            }}
          />
        )}
        {isProfileModalOpen && selectedGuest && (
          <GuestProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            guest={selectedGuest}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddGuestModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    nationality: '',
    dob: '',
    gender: 'Select',
    idType: 'Select',
    idNumber: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.nationality) {
      alert('Please fill in all required fields (*)');
      return;
    }

    const newGuest = {
      id: `G00${Math.floor(Math.random() * 1000)}`,
      ...formData,
      type: 'Regular',
      totalStays: 0,
      totalSpent: 0,
      lastVisit: '-',
      history: []
    };
    onAdd(newGuest);
  };

  const inputClass = "w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] outline-none transition-all text-sm text-[var(--text-primary)]";
  const labelClass = "text-xs font-medium text-[var(--text-secondary)]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Add New Guest</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Add a new guest to your hotel's guest database.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Full Name *</label>
              <input type="text" className={inputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Mobile Number *</label>
              <input type="text" className={inputClass} value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Email Address</label>
              <input type="email" className={inputClass} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Nationality *</label>
              <input type="text" className={inputClass} value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Date of Birth</label>
              <input type="date" className={inputClass} value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Gender</label>
              <select className={inputClass} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} >
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>ID Type</label>
              <select className={inputClass} value={formData.idType} onChange={e => setFormData({ ...formData, idType: e.target.value })} >
                <option>Select</option>
                <option>Passport</option>
                <option>National ID</option>
                <option>Driver License</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>ID Number</label>
              <input type="text" className={inputClass} value={formData.idNumber} onChange={e => setFormData({ ...formData, idNumber: e.target.value })} />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className={labelClass}>Address</label>
              <textarea className={`${inputClass} min-h-[80px]`} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} ></textarea>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-primary)]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-primary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:opacity-90 text-white text-sm font-medium transition-all"
          >
            Add Guest
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GuestProfileModal({ isOpen, onClose, guest }) {
  if (!guest) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Guest Profile - {guest.name}</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">View detailed information about this guest.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Guest ID</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{guest.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Guest Type</p>
              <span className="inline-block bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded mt-0.5">{guest.type}</span>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Mobile</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{guest.mobile}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Email</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{guest.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Nationality</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{guest.nationality}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Last Visit</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{guest.lastVisit}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)]">Total Stays</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{guest.totalStays}</p>
            </div>
            <div className="bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)]">Total Spent</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">${guest.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* History */}
          <div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2 text-sm">Stay History</h3>
            <div className="space-y-2">
              {guest.history && guest.history.length > 0 ? (
                guest.history.map((stay, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{stay.room}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">{stay.date}</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">${stay.amount}</p>
                  </div>
                ))
              ) : (
                <p className="text-[var(--text-secondary)] text-xs italic">No stay history available.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
