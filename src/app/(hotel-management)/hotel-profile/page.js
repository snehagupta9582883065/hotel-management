"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Share2,
  Save,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function HotelProfilePage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Static Initial Data
  const [formData, setFormData] = useState({
    hotel_name: 'Grand Plaza Hotel',
    hotel_category: '5 Star',
    description: 'Luxury hotel in the heart of the city offering world-class amenities and services.',
    facilities: 'WiFi, Spa, Gym, Pool, Restaurant, Bar, Conference Rooms',
    check_in_time: '14:00',
    check_out_time: '11:00',
    currency: 'USD',
    tax_id: 'TAX123456789',
    gst_number: 'GST987654321',
    email: 'info@grandplaza.com',
    phone: '+1 234 567 8900',
    website: 'https://www.grandplaza.com',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    zip_code: '10001',
    cancellation_policy: 'Free cancellation up to 24 hours before check-in',
    child_policy: 'Children under 12 stay free with parents',
    pet_policy: 'Pets allowed with additional charge',
    smoking_policy: 'Non-smoking property',
    facebook_link: 'grandplazahotel',
    instagram_link: 'grandplazahotel',
    twitter_link: 'grandplaza',
    linkedin_link: 'grand-plaza-hotel'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const executeSave = async () => {
    setSaving(true);
    setMessage(null);
    setShowConfirmModal(false);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setMessage({ type: 'success', text: 'Changes saved successfully! (Mock)' });
      setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Building2 },
    { id: 'contact', label: 'Contact Details', icon: MapPin },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'social', label: 'Social Media', icon: Share2 },
  ];

  // Shared Styles
  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-sm";
  const labelClass = "text-sm font-medium text-secondary mb-1 block";

  return (
    <div className="py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold title-gradient mb-2">Hotel Profile</h1>
          <p className="text-secondary">Manage your hotel information and settings</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Save size={20} />
            </motion.div>
          ) : (
            <Save size={20} />
          )}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 glass border ${message.type === 'success' ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'
              }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-white dark:bg-slate-800 text-accent-primary shadow-md font-semibold'
              : 'bg-white/50 dark:bg-slate-800/50 text-secondary hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="card h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
        >
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                <Building2 className="text-accent-primary" size={24} />
                <h2 className="text-xl font-bold">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Hotel Name</label>
                  <input
                    type="text"
                    name="hotel_name"
                    value={formData.hotel_name || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter hotel name"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Hotel Category</label>
                  <select
                    name="hotel_category"
                    value={formData.hotel_category || '5 Star'}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option>5 Star</option>
                    <option>4 Star</option>
                    <option>3 Star</option>
                    <option>Resort</option>
                    <option>Boutique</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                    placeholder="Brief description of the hotel..."
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>Facilities (comma-separated)</label>
                  <textarea
                    name="facilities"
                    value={formData.facilities || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className={`${inputClass} resize-none`}
                    placeholder="WiFi, Pool, Gym, Spa..."
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Check-in Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="time"
                      name="check_in_time"
                      value={formData.check_in_time || '14:00'}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Check-out Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="time"
                      name="check_out_time"
                      value={formData.check_out_time || '11:00'}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Currency</label>
                  <select
                    name="currency"
                    value={formData.currency || 'USD'}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  {/* Empty spacer for alignment */}
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Tax ID</label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter Tax ID"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>GST Number</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter GST Number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Details Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                <MapPin className="text-accent-primary" size={24} />
                <h2 className="text-xl font-bold">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-12`}
                      placeholder="info@hotel.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-12`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-12`}
                      placeholder="https://www.hotel.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-12`}
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter City"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter State"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter Country"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Cover Code"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                <FileText className="text-accent-primary" size={24} />
                <h2 className="text-xl font-bold">Hotel Policies</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={labelClass}>Cancellation Policy</label>
                  <textarea
                    name="cancellation_policy"
                    value={formData.cancellation_policy || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                    placeholder="e.g. Free cancellation up to 24 hours before check-in"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Child Policy</label>
                  <textarea
                    name="child_policy"
                    value={formData.child_policy || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className={`${inputClass} resize-none`}
                    placeholder="e.g. Children under 12 stay free"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Pet Policy</label>
                  <textarea
                    name="pet_policy"
                    value={formData.pet_policy || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className={`${inputClass} resize-none`}
                    placeholder="e.g. Pets allowed with additional charge"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Smoking Policy</label>
                  <textarea
                    name="smoking_policy"
                    value={formData.smoking_policy || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className={`${inputClass} resize-none`}
                    placeholder="e.g. Non-smoking property"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                <Share2 className="text-accent-primary" size={24} />
                <h2 className="text-xl font-bold">Social Media Links</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={labelClass}>Facebook</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-r-0 border-gray-200 dark:border-slate-600 rounded-l-xl text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">facebook.com/</span>
                    <input
                      type="text"
                      name="facebook_link"
                      value={formData.facebook_link || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-r-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-sm"
                      placeholder="page-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Instagram</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-r-0 border-gray-200 dark:border-slate-600 rounded-l-xl text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">instagram.com/</span>
                    <input
                      type="text"
                      name="instagram_link"
                      value={formData.instagram_link || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-r-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-sm"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Twitter</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-r-0 border-gray-200 dark:border-slate-600 rounded-l-xl text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">twitter.com/</span>
                    <input
                      type="text"
                      name="twitter_link"
                      value={formData.twitter_link || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-r-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-sm"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>LinkedIn</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-r-0 border-gray-200 dark:border-slate-600 rounded-l-xl text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">linkedin.com/company/</span>
                    <input
                      type="text"
                      name="linkedin_link"
                      value={formData.linkedin_link || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-r-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-sm"
                      placeholder="company-name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Save Changes?</h3>
                <p className="text-secondary text-sm mb-6">Are you sure you want to save the changes to the hotel profile?</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={executeSave}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-accent-primary text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Yes, Save
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
