"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Filter,
  CreditCard,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  Landmark,
  Smartphone,
  X,
  ChevronDown
} from 'lucide-react';

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: "TXN001", date: "12/01/2026", time: "10:30 AM", guest: "John Doe", room: "205", amount: 450, mode: "Card", status: "Success", receipt: "RCP001", remarks: "Room advance payment" },
    { id: "TXN002", date: "12/01/2026", time: "11:15 AM", guest: "Jane Smith", room: "103", amount: 250, mode: "UPI", status: "Success", receipt: "RCP002", remarks: "Restaurant bill" },
    { id: "TXN003", date: "12/01/2026", time: "12:00 PM", guest: "Bob Wilson", room: "301", amount: 850, mode: "Cash", status: "Success", receipt: "RCP003", remarks: "Final settlement" },
    { id: "TXN004", date: "12/01/2026", time: "01:30 PM", guest: "Alice Brown", room: "210", amount: 320, mode: "Card", status: "Pending", receipt: "-", remarks: "Payment verification pending" },
    { id: "TXN005", date: "12/01/2026", time: "02:45 PM", guest: "Charlie Davis", room: "405", amount: 120, mode: "Wallet", status: "Failed", receipt: "-", remarks: "Insufficient funds" },
  ]);

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.room.toString().includes(searchQuery) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === 'All' || txn.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const handleAddPayment = (newPayment) => {
    const newTxn = {
      id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      guest: newPayment.guestName,
      room: newPayment.roomNumber,
      amount: parseFloat(newPayment.amount),
      mode: newPayment.mode,
      status: "Success", // Auto-success for demo
      receipt: `RCP${String(transactions.length + 1).padStart(3, '0')}`,
      remarks: newPayment.remarks
    };
    setTransactions([newTxn, ...transactions]);
    setIsModalOpen(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Card': return <CreditCard size={14} />;
      case 'UPI': return <Smartphone size={14} />;
      case 'Cash': return <IndianRupee size={14} />;
      case 'Bank Transfer': return <Landmark size={14} />;
      case 'Wallet': return <Wallet size={14} />;
      default: return <CreditCard size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 max-w-[1600px] mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">Payment Processing</h1>
          <p className="text-gray-500 dark:text-gray-400">Process and track all payments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:-translate-y-0.5"
        >
          <IndianRupee size={18} />
          Process Payment
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Collection"
          value={`₹${transactions.reduce((acc, curr) => acc + (curr.status === 'Success' ? curr.amount : 0), 0).toLocaleString()}`}
          icon={<IndianRupee size={20} className="text-green-600 dark:text-green-400" />}
          bg="bg-green-50 dark:bg-green-900/20"
          border="border-green-100 dark:border-green-800"
        />
        <StatsCard
          title="Successful Payments"
          value={transactions.filter(t => t.status === 'Success').length}
          icon={<CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />}
          bg="bg-blue-50 dark:bg-blue-900/20"
          border="border-blue-100 dark:border-blue-800"
        />
        <StatsCard
          title="Pending Payments"
          value={transactions.filter(t => t.status === 'Pending').length}
          icon={<Clock size={20} className="text-amber-600 dark:text-amber-400" />}
          bg="bg-amber-50 dark:bg-amber-900/20"
          border="border-amber-100 dark:border-amber-800"
        />
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{transactions.length}</p>
        </div>
      </div>

      {/* Method Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MiniStatsCard title="Cash" value={`₹${transactions.filter(t => t.mode === 'Cash' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0)}`} count={transactions.filter(t => t.mode === 'Cash').length} icon={<IndianRupee size={16} />} />
        <MiniStatsCard title="Card" value={`₹${transactions.filter(t => t.mode === 'Card' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0)}`} count={transactions.filter(t => t.mode === 'Card').length} icon={<CreditCard size={16} />} />
        <MiniStatsCard title="UPI" value={`₹${transactions.filter(t => t.mode === 'UPI' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0)}`} count={transactions.filter(t => t.mode === 'UPI').length} icon={<Smartphone size={16} />} />
        <MiniStatsCard title="Bank Transfer" value={`₹${transactions.filter(t => t.mode === 'Bank Transfer' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0)}`} count={transactions.filter(t => t.mode === 'Bank Transfer').length} icon={<Landmark size={16} />} />
        <MiniStatsCard title="Wallet" value={`₹${transactions.filter(t => t.mode === 'Wallet' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0)}`} count={transactions.filter(t => t.mode === 'Wallet').length} icon={<Wallet size={16} />} />
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2">
        <div className="p-2 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search by guest name, room number, or transaction ID..."
          className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-2">
          <Search size={16} />
          Search
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Guest Name</th>
                <th className="px-6 py-4 font-semibold">Room</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${filterMode !== 'All' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      <span>Payment Mode</span>
                      <Filter size={14} className={`transition-colors ${filterMode !== 'All' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    </div>
                  </div>

                  {/* Backdrop */}
                  {isFilterOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden"
                      >
                        <div className="p-1">
                          {['All', 'Cash', 'Card', 'UPI', 'Bank Transfer', 'Wallet'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => {
                                setFilterMode(mode);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${filterMode === mode
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                              <span>{mode === 'All' ? 'All Modes' : mode}</span>
                              {filterMode === mode && <CheckCircle size={12} />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Receipt No.</th>
                <th className="px-6 py-4 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{txn.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 dark:text-white font-medium">{txn.date}</p>
                      <p className="text-xs text-gray-500">{txn.time}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{txn.guest}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                        {txn.room}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{txn.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        {getModeIcon(txn.mode)}
                        <span>{txn.mode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(txn.status)}`}>
                        {txn.status === 'Success' && <CheckCircle size={12} />}
                        {txn.status === 'Pending' && <Clock size={12} />}
                        {txn.status === 'Failed' && <AlertCircle size={12} />}
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{txn.receipt}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={txn.remarks}>{txn.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No transactions found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProcessPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProcess={handleAddPayment}
      />
    </motion.div>
  );
}

function StatsCard({ title, value, icon, bg, border }) {
  return (
    <div className={`p-5 rounded-2xl border ${border} ${bg} flex items-start justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
    </div>
  );
}

function MiniStatsCard({ title, value, count, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-xs text-gray-400">{count} transactions</p>
    </div>
  );
}

function ProcessPaymentModal({ isOpen, onClose, onProcess }) {
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    amount: '',
    mode: '',
    remarks: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.amount || !formData.mode) return;
    onProcess(formData);
    setFormData({ guestName: '', roomNumber: '', amount: '', mode: '', remarks: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-white dark:bg-gray-800">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Process New Payment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter payment details to process transaction.</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Guest Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400"
                      value={formData.guestName}
                      onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Room Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400"
                      value={formData.roomNumber}
                      onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Mode <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer"
                        value={formData.mode}
                        onChange={e => setFormData({ ...formData, mode: e.target.value })}
                      >
                        <option value="" disabled>Select mode</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit/Debit Card">Credit/Debit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Digital Wallet">Digital Wallet</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Remarks</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400 resize-none"
                    placeholder="Payment purpose or additional notes..."
                    value={formData.remarks}
                    onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all shadow-lg shadow-purple-500/30"
                  >
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
