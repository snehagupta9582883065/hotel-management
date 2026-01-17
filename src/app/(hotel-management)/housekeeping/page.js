"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Clipboard,
  AlertTriangle,
  ChevronDown,
  X
} from 'lucide-react';

export default function HousekeepingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Mock Data for Staff
  const staffMembers = [
    "Maria Garcia",
    "John Smith",
    "Sarah Johnson",
    "Maintenance Team"
  ];

  // Mock Data for Rooms
  const [rooms, setRooms] = useState([
    { id: 1, roomNumber: '101', floor: 'Floor 1', status: 'Dirty', priority: 'High', taskType: 'Check-out Cleaning', assignedTo: 'Maria Garcia', estTime: '45 min', lastCleaned: '16/01/2026, 10:30:00' },
    { id: 2, roomNumber: '205', floor: 'Floor 2', status: 'In Progress', priority: 'Medium', taskType: 'Daily Cleaning', assignedTo: 'John Smith', estTime: '30 min', lastCleaned: '16/01/2026, 09:15:00' },
    { id: 3, roomNumber: '310', floor: 'Floor 3', status: 'Inspection', priority: 'Medium', taskType: 'Deep Cleaning', assignedTo: 'Sarah Johnson', estTime: '60 min', lastCleaned: '17/01/2026, 11:20:00' },
    { id: 4, roomNumber: '412', floor: 'Floor 4', status: 'Maintenance', priority: 'Urgent', taskType: 'Repair Required', assignedTo: 'Maintenance Team', estTime: '120 min', lastCleaned: '15/01/2026, 14:00:00' },
    { id: 5, roomNumber: '208', floor: 'Floor 2', status: 'Clean', priority: 'Low', taskType: 'Completed', assignedTo: 'Maria Garcia', estTime: '0 min', lastCleaned: '17/01/2026, 13:45:00' },
  ]);

  const stats = [
    { title: 'Clean', value: rooms.filter(r => r.status === 'Clean').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Dirty', value: rooms.filter(r => r.status === 'Dirty').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'In Progress', value: rooms.filter(r => r.status === 'In Progress').length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Inspection', value: rooms.filter(r => r.status === 'Inspection').length, icon: Clipboard, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const handleAssignStaff = (roomId, staff) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, assignedTo: staff };
      }
      return room;
    }));
    setOpenDropdownId(null);
  };

  const openUpdateModal = (room) => {
    setSelectedRoom({ ...room, notes: '' });
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (status) => {
    setSelectedRoom(prev => ({ ...prev, status }));
  };

  const handleSaveUpdate = () => {
    if (!selectedRoom) return;
    setRooms(prev => prev.map(room => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          status: selectedRoom.status,
          // Update last cleaned if status becomes Clean
          lastCleaned: selectedRoom.status === 'Clean' ? new Date().toLocaleString('en-GB') : room.lastCleaned
        };
      }
      return room;
    }));
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Clean': return 'bg-gray-900 text-white dark:bg-white dark:text-gray-900';
      case 'Dirty': return 'bg-red-500 text-white';
      case 'In Progress': return 'bg-gray-200 text-gray-700';
      case 'Inspection': return 'bg-white border border-gray-200 text-gray-700';
      case 'Maintenance': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Custom Badge logic for table displays specifically matching screenshot
  const getTableStatusBadge = (status) => {
    switch (status) {
      case 'Clean': return 'bg-black text-white dark:bg-white dark:text-black';
      case 'Dirty': return 'bg-red-600 text-white';
      case 'In Progress': return 'bg-gray-100 text-gray-600';
      case 'Inspection': return 'bg-white border border-gray-200 text-gray-600';
      case 'Maintenance': return 'bg-red-600 text-white'; // Darker red for maintenance usually
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="py-6 space-y-8 pb-24" onClick={() => setOpenDropdownId(null)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-gradient">Housekeeping Management</h1>
          <p className="text-secondary mt-1">Track room cleaning and maintenance status</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors text-primary border border-gray-200 dark:border-slate-700">
            All Floors <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors text-primary border border-gray-200 dark:border-slate-700">
            All Status <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 flex flex-col justify-between h-32 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-secondary text-sm font-medium">{stat.title}</span>
              <div className={`${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Tasks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-primary">Room Tasks</h2>
        </div>

        <div className="overflow-visible min-h-[400px]">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Task Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Est. Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Last Cleaned</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {rooms.map((room) => (
                <tr key={room.id} className="transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{room.roomNumber}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{room.floor}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${getTableStatusBadge(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadge(room.priority)}`}>
                      {room.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{room.taskType}</td>

                  {/* Assigned To Dropdown */}
                  <td className="px-6 py-4 relative">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === room.id ? null : room.id)}
                        className="flex items-center justify-between w-40 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-primary hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 shadow-sm"
                      >
                        <span className="truncate">{room.assignedTo}</span>
                        <ChevronDown size={14} className="text-secondary ml-2" />
                      </button>

                      <AnimatePresence>
                        {openDropdownId === room.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1 z-50"
                          >
                            {staffMembers.map((staff, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAssignStaff(room.id, staff)}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between group"
                              >
                                <span className={staff === room.assignedTo ? 'font-medium text-accent-primary' : 'text-secondary group-hover:text-primary'}>
                                  {staff}
                                </span>
                                {staff === room.assignedTo && <CheckCircle size={14} className="text-accent-primary" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-secondary">{room.estTime}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{room.lastCleaned}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); openUpdateModal(room); }}
                      className="px-3 py-1 text-sm font-medium border border-gray-200 dark:border-slate-700 text-secondary bg-white dark:bg-slate-900 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Update Room Modal */}
      <AnimatePresence>
        {isModalOpen && selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative border border-gray-100 dark:border-slate-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Update Room {selectedRoom.roomNumber}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-secondary mb-3 block">Current Status</label>
                  <div className="flex flex-wrap gap-3">
                    {['Dirty', 'In Progress', 'Inspection', 'Clean'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRoom.status === status
                          ? 'bg-accent-primary text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary mb-2 block">Notes</label>
                  <textarea
                    value={selectedRoom.notes}
                    onChange={(e) => setSelectedRoom(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about the room status..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary focus:border-accent-primary outline-none transition-all text-sm resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  className="px-6 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
