"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BedDouble,
  Utensils,
  Car,
  Wifi,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export default function AddOnServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Mock Data
  const [services, setServices] = useState([
    { id: 1, name: 'Extra Bed', category: 'Room Amenities', description: 'Additional bed for extra guest', price: '30.00', unit: 'per night', taxable: true, status: true },
    { id: 2, name: 'Breakfast Buffet', category: 'Food & Beverage', description: 'Continental breakfast buffet', price: '25.00', unit: 'per person', taxable: true, status: true },
    { id: 3, name: 'Airport Pickup', category: 'Transportation', description: 'Private airport transfer service', price: '50.00', unit: 'one-way', taxable: true, status: true },
    { id: 4, name: 'Premium WiFi', category: 'Technology', description: 'High-speed internet access', price: '10.00', unit: 'per day', taxable: false, status: true },
    { id: 5, name: 'Room Service', category: 'Food & Beverage', description: 'In-room dining service fee', price: '5.00', unit: 'per order', taxable: true, status: true },
  ]);

  const initialFormState = {
    name: '',
    category: 'Room Amenities',
    description: '',
    price: '',
    unit: 'per night',
    taxable: true,
    status: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // Stats
  const stats = [
    { title: 'Room Amenities', value: services.filter(s => s.category === 'Room Amenities').length, icon: BedDouble, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Food & Beverage', value: services.filter(s => s.category === 'Food & Beverage').length, icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Transportation', value: services.filter(s => s.category === 'Transportation').length, icon: Car, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Technology', value: services.filter(s => s.category === 'Technology').length, icon: Wifi, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service.id);
    setFormData({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in required fields');
      return;
    }

    if (editingService) {
      setServices(prev => prev.map(service => {
        if (service.id === editingService) {
          return { ...service, ...formData };
        }
        return service;
      }));
    } else {
      const newService = {
        id: Date.now(),
        ...formData
      };
      setServices(prev => [...prev, newService]);
    }
    setIsModalOpen(false);
  };

  const toggleServiceStatus = (id, field) => {
    setServices(prev => prev.map(service => {
      if (service.id === id) {
        return { ...service, [field]: !service[field] };
      }
      return service;
    }));
  };

  return (
    <div className="py-6 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-gradient">Add-on Services</h1>
          <p className="text-secondary mt-1">Manage extra bed and additional services</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <p className="text-secondary text-sm font-medium">{stat.title}</p>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Services Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">All Services</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-secondary uppercase tracking-wider">Taxable</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`}>
                        {service.category === 'Room Amenities' && <BedDouble size={18} />}
                        {service.category === 'Food & Beverage' && <Utensils size={18} />}
                        {service.category === 'Transportation' && <Car size={18} />}
                        {service.category === 'Technology' && <Wifi size={18} />}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{service.name}</p>
                        <p className="text-xs text-secondary">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{service.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">${service.price}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{service.unit}</td>

                  {/* Taxable Toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleServiceStatus(service.id, 'taxable')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${service.taxable
                        ? 'bg-accent-primary text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      {service.taxable ? 'Yes' : 'No'}
                    </button>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleServiceStatus(service.id, 'status')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${service.status ? 'bg-accent-primary' : 'bg-gray-200 dark:bg-slate-700'
                        }`}
                    >
                      <span
                        className={`${service.status ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform`}
                      />
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-2 text-secondary hover:text-accent-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-secondary bg-white dark:bg-slate-900">
                    No services found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
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
                <h3 className="text-lg font-bold text-primary">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Service Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Extra Bed"
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary focus:border-accent-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary focus:border-accent-primary outline-none transition-all text-sm cursor-pointer"
                    >
                      <option>Room Amenities</option>
                      <option>Food & Beverage</option>
                      <option>Transportation</option>
                      <option>Technology</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-secondary">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Service description"
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary focus:border-accent-primary outline-none transition-all text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary focus:border-accent-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-secondary">Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary focus:border-accent-primary outline-none transition-all text-sm cursor-pointer"
                    >
                      <option>per night</option>
                      <option>per person</option>
                      <option>per order</option>
                      <option>per day</option>
                      <option>one-way</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="taxable"
                        checked={formData.taxable}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent-primary"></div>
                    </label>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-primary">Taxable Service</span>
                      <span className="text-xs text-secondary">Tax will be applied</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent-primary"></div>
                    </label>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-primary">Available</span>
                      <span className="text-xs text-secondary">Service is active</span>
                    </div>
                  </div>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                >
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
