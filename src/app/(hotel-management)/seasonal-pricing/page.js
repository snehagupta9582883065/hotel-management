"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Percent,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export default function SeasonalPricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Mock Data
  const stats = [
    { title: 'Active Rules', value: '2', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Scheduled Rules', value: '1', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Average Increase', value: '27%', icon: Percent, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const [rules, setRules] = useState([
    { id: 1, name: 'Summer Peak Season', start: '2026-06-01', end: '2026-08-31', roomType: 'All Rooms', adjustmentType: 'Percentage (%)', adjustmentValue: '30', priority: 1, status: 'scheduled' },
    { id: 2, name: 'Holiday Season', start: '2025-12-20', end: '2026-01-05', roomType: 'All Rooms', adjustmentType: 'Percentage (%)', adjustmentValue: '50', priority: 2, status: 'active' },
    { id: 3, name: 'Weekend Premium', start: '2026-01-01', end: '2026-12-31', roomType: 'Deluxe Suite', adjustmentType: 'Fixed Amount ($)', adjustmentValue: '50', priority: 3, status: 'active' },
  ]);

  const initialFormState = {
    name: '',
    start: '',
    end: '',
    roomType: 'All Rooms',
    adjustmentType: 'Percentage (%)',
    adjustmentValue: '',
    priority: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingRule(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule.id);
    setFormData({
      name: rule.name,
      start: rule.start,
      end: rule.end,
      roomType: rule.roomType,
      adjustmentType: rule.adjustmentType,
      adjustmentValue: rule.adjustmentValue,
      priority: rule.priority
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.start || !formData.end) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingRule) {
      // Update existing rule
      setRules(prev => prev.map(rule => {
        if (rule.id === editingRule) {
          return {
            ...rule,
            ...formData,
            status: 'active' // Simplified status logic for now
          };
        }
        return rule;
      }));
    } else {
      // Add new rule
      const newRule = {
        id: Date.now(), // Simple ID generation
        ...formData,
        status: 'active'
      };
      setRules(prev => [...prev, newRule]);
    }
    setIsModalOpen(false);
  };

  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
  };

  return (
    <div className="py-6 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-gradient">Seasonal Pricing</h1>
          <p className="text-secondary mt-1">Manage seasonal and special pricing rules</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
        >
          <Plus size={20} />
          <span>Add Pricing Rule</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
          >
            <div>
              <p className="text-secondary text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rules Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">Pricing Rules</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Rule Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Room Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Adjustment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {rules.map((rule) => {
                const isPercentage = rule.adjustmentType === 'Percentage (%)';
                const displayAdjustment = isPercentage ? `+${rule.adjustmentValue}%` : `+$${rule.adjustmentValue}`;

                return (
                  <tr key={rule.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{rule.name}</td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      <div className="flex flex-col">
                        <span>{formatDate(rule.start)}</span>
                        <span className="text-xs text-gray-400">to {formatDate(rule.end)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">{rule.roomType}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{displayAdjustment}</td>
                    <td className="px-6 py-4 text-sm text-secondary">{rule.priority}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${rule.status === 'active'
                        ? 'bg-accent-primary text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                        }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="p-2 text-secondary hover:text-accent-primary transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-2 text-secondary hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rules.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-secondary">
                    No pricing rules found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Rule Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-gray-100 dark:border-slate-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">{editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-secondary">Rule Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Summer Peak Season"
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Start Date</label>
                    <input
                      type="date"
                      name="start"
                      value={formData.start}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">End Date</label>
                    <input
                      type="date"
                      name="end"
                      value={formData.end}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-secondary">Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary"
                  >
                    <option>All Rooms</option>
                    <option>Deluxe Suite</option>
                    <option>Standard Room</option>
                    <option>Family Suite</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Adjustment Type</label>
                    <select
                      name="adjustmentType"
                      value={formData.adjustmentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary"
                    >
                      <option>Percentage (%)</option>
                      <option>Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Adjustment Value</label>
                    <input
                      type="number"
                      name="adjustmentValue"
                      value={formData.adjustmentValue}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-secondary">Priority (1 = highest)</label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary outline-none transition-all text-sm text-primary placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                  {editingRule ? 'Update Rule' : 'Add Rule'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
