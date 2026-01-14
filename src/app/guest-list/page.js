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
  MoreVertical,
  X,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  Flag
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
    },
    {
      id: "G004",
      name: "Sarah Johnson",
      mobile: "+1-555-0103",
      email: "sarah@email.com",
      nationality: "Canada",
      type: "Corporate",
      totalStays: 8,
      totalSpent: 5600,
      lastVisit: "02/01/2026",
      dob: "03/03/1982",
      gender: "Female",
      idType: "Passport",
      idNumber: "C12345678",
      address: "Toronto, Canada",
      history: []
    },
    {
      id: "G005",
      name: "Ahmed Hassan",
      mobile: "+971-50-123-4567",
      email: "ahmed@email.com",
      nationality: "UAE",
      type: "VIP",
      totalStays: 15,
      totalSpent: 12000,
      lastVisit: "09/01/2026",
      dob: "12/09/1980",
      gender: "Male",
      idType: "National ID",
      idNumber: "784-1234-5678901-1",
      address: "Dubai, UAE",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-2 max-w-[1600px] mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">Guest List</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage guest profiles and history</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2  bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 px-5 py-2.5 rounded-xl"
        >
          <Plus size={20} />
          <span className="font-medium">Add Guest</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, mobile, or guest ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-gray-700 dark:text-gray-200 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 dark:bg-gray-700 pl-4 pr-10 py-2.5 rounded-xl border-none text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 cursor-pointer font-medium"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>All Types</option>
              <option>Regular</option>
              <option>VIP</option>
              <option>Corporate</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">ID</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Mobile</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">Email</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Nation</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Type</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Stays</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Spent</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Last Visit</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white truncate">{guest.id}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium truncate" title={guest.name}>{guest.name}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 truncate">{guest.mobile}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 truncate" title={guest.email}>{guest.email}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 truncate">{guest.nationality}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getGuestTypeColor(guest.type)}`}>
                      {guest.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{guest.totalStays}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${guest.totalSpent.toLocaleString()}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{guest.lastVisit}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleViewProfile(guest)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="History">
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
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
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
    // Basic validation
    if (!formData.name || !formData.mobile || !formData.nationality) {
      alert('Please fill in all required fields (*)');
      return;
    }

    const newGuest = {
      id: `G00${Math.floor(Math.random() * 1000)}`, // Simple ID generation
      ...formData,
      type: 'Regular',
      totalStays: 0,
      totalSpent: 0,
      lastVisit: '-',
      history: []
    };
    onAdd(newGuest);
  };

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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Guest</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add a new guest to your hotel's guest database.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Mobile Number *</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Nationality *</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <select
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">ID Type</label>
              <select
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm"
                value={formData.idType}
                onChange={e => setFormData({ ...formData, idType: e.target.value })}
              >
                <option>Select</option>
                <option>Passport</option>
                <option>National ID</option>
                <option>Driver License</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">ID Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                value={formData.idNumber}
                onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Address</label>
              <textarea
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[80px] resize-y text-sm"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 text-white text-sm font-medium"
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Guest Profile - {guest.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View detailed information about this guest.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Guest ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{guest.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Guest Type</p>
              <span className="inline-block bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded mt-0.5">{guest.type}</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Mobile</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{guest.mobile}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{guest.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Nationality</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{guest.nationality}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Last Visit</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{guest.lastVisit}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Stays</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{guest.totalStays}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">${guest.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* History */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Stay History</h3>
            <div className="space-y-2">
              {guest.history && guest.history.length > 0 ? (
                guest.history.map((stay, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{stay.room}</p>
                      <p className="text-[10px] text-gray-500">{stay.date}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${stay.amount}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs italic">No stay history available.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
