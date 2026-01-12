"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  Users,
  BedDouble,
  CreditCard,
  Building2,
  Filter,
  X
} from 'lucide-react';

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const StatCard = ({ title, value, icon: Icon }) => (
  <motion.div
    variants={itemVariant}
    whileHover={{ y: -4 }}
    className="bg-bg-secondary rounded-2xl p-6 border border-border-color hover:border-purple-500/30 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div>
        <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
      </div>
    </div>
  </motion.div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-bg-secondary rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border-color"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
              <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ViewBookingModal = ({ isOpen, onClose, group }) => {
  if (!group) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Checked-in': return 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Group Booking: ${group.groupName}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-text-primary">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Group ID</p>
          <p className="text-lg font-semibold">{group.id}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Status</p>
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-semibold text-xs ${getStatusClass(group.status)}`}>
            {group.status}
          </span>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Contact Person</p>
          <p className="text-lg font-semibold">{group.contactPerson}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Phone</p>
          <p className="text-lg font-semibold">{group.phone}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Email</p>
          <p className="text-lg font-semibold">{group.email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Check-in Date</p>
          <p className="text-lg font-semibold">{group.checkIn}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Check-out Date</p>
          <p className="text-lg font-semibold">{group.checkOut}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Rooms Booked</p>
          <p className="text-lg font-semibold">{group.rooms}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Total Guests</p>
          <p className="text-lg font-semibold">{group.guests}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-text-secondary text-sm font-medium mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-purple-500">${group.amount.toLocaleString()}</p>
        </div>
        {group.notes && (
          <div className="md:col-span-2">
            <p className="text-text-secondary text-sm font-medium mb-1">Notes</p>
            <p className="text-base bg-bg-primary p-4 rounded-xl border border-border-color">{group.notes}</p>
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-border-color text-text-secondary hover:bg-bg-primary transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default function GroupBookingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [formData, setFormData] = useState({
    groupName: '',
    contactPerson: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    rooms: '',
    guests: '',
    notes: ''
  });

  const filterRef = useRef(null);

  // Mock Group Data
  const [groupBookings, setGroupBookings] = useState([
    {
      id: "GRP001",
      groupName: "Tech Conference 2026",
      contactPerson: "Sarah Johnson",
      phone: "+1-555-0201",
      email: "sarah@tech.com",
      checkIn: "2026-02-15",
      checkOut: "2026-02-18",
      rooms: 25,
      guests: 50,
      status: "Confirmed",
      amount: 11250,
      notes: "Vip guest list included. Requires conference room A setup."
    },
    {
      id: "GRP002",
      groupName: "Smith Family Reunion",
      contactPerson: "John Smith",
      phone: "+1-555-0202",
      email: "john@smith.com",
      checkIn: "2026-01-20",
      checkOut: "2026-01-23",
      rooms: 12,
      guests: 30,
      status: "Checked-in",
      amount: 5400,
      notes: "Extra beds required in room 101-112. Late checkout requested."
    }
  ]);

  // Dynamic Stats
  const stats = useMemo(() => {
    const totalRooms = groupBookings.reduce((sum, g) => sum + Number(g.rooms || 0), 0);
    const totalGuests = groupBookings.reduce((sum, g) => sum + Number(g.guests || 0), 0);
    const totalRevenue = groupBookings.reduce((sum, g) => sum + (g.amount || 0), 0);

    return [
      { title: "Total Groups", value: groupBookings.length.toString(), icon: Users },
      { title: "Total Rooms Booked", value: totalRooms.toString(), icon: BedDouble },
      { title: "Total Guests", value: totalGuests.toString(), icon: Building2 },
      { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: CreditCard }
    ];
  }, [groupBookings]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Checked-in': return 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // CRUD Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setEditingGroup(null);
    setFormData({
      groupName: '',
      contactPerson: '',
      phone: '',
      email: '',
      checkIn: '',
      checkOut: '',
      rooms: '',
      guests: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      contactPerson: group.contactPerson,
      phone: group.phone,
      email: group.email || '',
      checkIn: group.checkIn,
      checkOut: group.checkOut,
      rooms: group.rooms.toString(),
      guests: group.guests.toString(),
      notes: group.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleViewClick = (group) => {
    setViewingGroup(group);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this group booking?')) {
      setGroupBookings(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock calculation for amount (e.g. $150 per room per night)
    const date1 = new Date(formData.checkIn);
    const date2 = new Date(formData.checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const calculatedAmount = Number(formData.rooms) * diffDays * 150;

    if (editingGroup) {
      setGroupBookings(prev => prev.map(g =>
        g.id === editingGroup.id
          ? {
            ...g,
            ...formData,
            rooms: Number(formData.rooms),
            guests: Number(formData.guests),
            amount: calculatedAmount
          }
          : g
      ));
    } else {
      const newGroup = {
        id: `GRP${String(groupBookings.length + 1).padStart(3, '0')}`,
        ...formData,
        rooms: Number(formData.rooms),
        guests: Number(formData.guests),
        status: 'Pending',
        amount: calculatedAmount
      };
      setGroupBookings(prev => [...prev, newGroup]);
    }
    setIsModalOpen(false);
  };

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  const filteredGroups = groupBookings.filter(group => {
    const matchesSearch =
      group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariant}
      className="flex flex-col gap-8 animate-fadeIn"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
            Group Booking Management
          </h1>
          <p className="text-text-secondary text-sm font-medium">Manage group reservations and corporate bookings</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
        >
          <Plus size={18} />
          New Group Booking
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <div className="card p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 bg-bg-primary px-4 py-2.5 rounded-xl border border-border-color focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all flex-1 max-w-lg">
              <Search size={18} className="text-text-secondary flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by ID, name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent outline-none w-full text-text-primary text-sm"
              />
            </div>
            <div className="relative" ref={filterRef}>
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-secondary text-sm font-medium cursor-pointer hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all relative"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <span>Filter</span>
                {filterStatus !== 'all' && (
                  <span className="bg-purple-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-lg min-w-[18px] text-center">
                    1
                  </span>
                )}
                <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-bg-secondary border border-border-color rounded-2xl p-6 min-w-[250px] shadow-2xl z-50 animate-slideDown">
                  <div className="mb-2">
                    <label className="block text-xs font-bold text-text-primary mb-2.5 uppercase tracking-wider">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setShowFilterDropdown(false);
                      }}
                      className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm font-medium cursor-pointer transition-all outline-none hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="all">All Status</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-in">Checked-in</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto lg:overflow-x-visible rounded-xl border border-border-color">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bg-primary border-b border-border-color">
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Group ID</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Group Details</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Schedule</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Capacity</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <tr key={group.id} className="border-b border-border-color hover:bg-purple-500/5 transition-colors">
                    <td className="px-5 py-5 text-text-primary font-semibold whitespace-nowrap">{group.id}</td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-text-primary font-semibold">{group.groupName}</span>
                        <span className="text-text-secondary text-xs">Corporate Booking</span>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-text-primary font-medium">{group.contactPerson}</span>
                        <span className="text-text-secondary text-xs">{group.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-text-primary font-medium">{group.checkIn}</span>
                        <div className="flex items-center gap-1 text-text-secondary text-xs">
                          <span>to</span>
                          <span>{group.checkOut}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-text-primary font-medium">{group.rooms} Rooms</span>
                        <span className="text-text-secondary text-xs">{group.guests} Guests</span>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-semibold text-xs min-w-[90px] ${getStatusClass(group.status)}`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-text-primary font-semibold whitespace-nowrap text-base">${group.amount.toLocaleString()}</td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="w-8 h-8 rounded-lg border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center cursor-pointer hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 hover:-translate-y-0.5 transition-all"
                          title="View"
                          onClick={() => handleViewClick(group)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center cursor-pointer hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 hover:-translate-y-0.5 transition-all"
                          title="Edit"
                          onClick={() => handleEditClick(group)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg border border-red-500/30 bg-bg-primary text-red-500 flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-500/10 hover:-translate-y-0.5 transition-all"
                          title="Delete"
                          onClick={() => handleDelete(group.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center text-text-secondary font-medium">
                    No group bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-bg-secondary rounded-2xl w-full max-w-2xl border border-border-color shadow-2xl">
            {/* Modal Header */}
            <div className="bg-bg-secondary border-b border-border-color px-6 py-5 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-text-primary">{editingGroup ? 'Edit Group Booking' : 'New Group Booking'}</h2>
                <p className="text-[10px] text-text-secondary mt-0.5">Please fill in the group reservation details</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Group Name *</label>
                  <input
                    type="text"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                    placeholder="e.g. Tech Conference 2026"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                    placeholder="Full name"
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                    placeholder="+1-555-..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Contact Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Check-in Date *</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Check-out Date *</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                  />
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Number of Rooms *</label>
                  <input
                    type="number"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Total Guests *</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="mt-4">
                <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Special Requests / Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm resize-none"
                  placeholder="Enter any additional requirements..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-bg-primary border border-border-color rounded-lg text-text-secondary font-semibold hover:bg-bg-secondary transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-500/20 active:translate-y-0 text-xs"
                >
                  {editingGroup ? 'Update Group Booking' : 'Create Group Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-bg-secondary rounded-2xl w-full max-w-2xl border border-border-color shadow-2xl">
            {/* Modal Header */}
            <div className="bg-bg-secondary border-b border-border-color px-6 py-5 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Booking Details</h2>
                <p className="text-[10px] text-text-secondary mt-0.5">Reference ID: <span className="text-purple-600 font-bold">{viewingGroup.id}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-semibold text-[10px] min-w-[90px] ${getStatusClass(viewingGroup.status)}`}>
                  {viewingGroup.status}
                </span>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-9 h-9 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Group Info */}
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Group Information</label>
                  <div className="bg-bg-primary rounded-xl p-4 border border-border-color">
                    <h3 className="text-text-primary font-bold text-sm mb-1">{viewingGroup.groupName}</h3>
                    <p className="text-text-secondary text-xs">Corporate Event Booking</p>
                  </div>
                </div>

                {/* Financials */}
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Estimated Revenue</label>
                  <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-500/20">
                    <h3 className="text-purple-600 dark:text-purple-400 font-bold text-lg leading-none">${viewingGroup.amount.toLocaleString()}</h3>
                    <p className="text-text-secondary text-[10px] mt-1.5 font-medium">calculated based on stay duration</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Contact Person */}
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Contact Person</label>
                  <p className="text-text-primary text-sm font-semibold">{viewingGroup.contactPerson}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{viewingGroup.email || 'N/A'}</p>
                  <p className="text-text-secondary text-xs">{viewingGroup.phone}</p>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Schedule</label>
                  <p className="text-text-primary text-sm font-semibold">{viewingGroup.checkIn}</p>
                  <p className="text-text-secondary text-[10px] font-bold uppercase mx-1">to</p>
                  <p className="text-text-primary text-sm font-semibold">{viewingGroup.checkOut}</p>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Capacity</label>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-text-primary text-sm font-bold">{viewingGroup.rooms}</span>
                      <span className="text-text-secondary text-[10px] font-medium uppercase">Rooms</span>
                    </div>
                    <div className="w-px h-8 bg-border-color mx-2 opacity-50"></div>
                    <div className="flex flex-col">
                      <span className="text-text-primary text-sm font-bold">{viewingGroup.guests}</span>
                      <span className="text-text-secondary text-[10px] font-medium uppercase">Guests</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              {viewingGroup.notes && (
                <div className="mt-4">
                  <label className="block text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Special Requests / Notes</label>
                  <div className="bg-yellow-50/30 dark:bg-yellow-900/5 border border-yellow-200/50 dark:border-yellow-800/20 rounded-xl p-4 italic text-sm text-text-primary leading-relaxed">
                    "{viewingGroup.notes}"
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-lg text-text-secondary font-semibold hover:bg-bg-secondary transition-all text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
