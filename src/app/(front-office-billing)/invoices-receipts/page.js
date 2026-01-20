"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Eye,
  Printer,
  Download,
  Mail,
  Mail,
  X,
  CheckCircle,
  AlertCircle,
  IndianRupee as DollarSign
} from 'lucide-react';

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null); // For View Modal
  const [printInvoiceData, setPrintInvoiceData] = useState(null); // For Silent Print

  // Mock Data
  const invoices = [
    {
      id: "INV-2026-001",
      date: "12/01/2026",
      guest: "John Doe",
      room: "205",
      checkIn: "10/01/2026",
      checkOut: "12/01/2026",
      totalAmount: 1181.60,
      paid: 1181.60,
      balance: 0.00,
      status: "Paid",
      email: "john.doe@example.com",
      items: [
        { desc: "Room Charges (2 nights)", qty: 2, rate: 450.00, amount: 900.00 },
        { desc: "Restaurant Bill", qty: 1, rate: 125.00, amount: 125.00 },
        { desc: "Laundry Service", qty: 1, rate: 30.00, amount: 30.00 }
      ],
      subtotal: 1055.00,
      tax: 126.60
    },
    {
      id: "INV-2026-002",
      date: "12/01/2026",
      guest: "Jane Smith",
      room: "103",
      checkIn: "09/01/2026",
      checkOut: "12/01/2026",
      totalAmount: 946.40,
      paid: 500.00,
      balance: 446.40,
      status: "Partial",
      email: "jane.smith@example.com",
      items: [
        { desc: "Room Charges (3 nights)", qty: 3, rate: 250.00, amount: 750.00 },
        { desc: "Spa Services", qty: 1, rate: 95.00, amount: 95.00 }
      ],
      subtotal: 845.00,
      tax: 101.40
    },
    {
      id: "INV-2026-003",
      date: "12/01/2026",
      guest: "Bob Wilson",
      room: "301",
      checkIn: "11/01/2026",
      checkOut: "15/01/2026",
      totalAmount: 1008.00,
      paid: 0.00,
      balance: 1008.00,
      status: "Unpaid",
      email: "bob.wilson@example.com",
      items: [
        { desc: "Conference Hall Booking", qty: 1, rate: 900.00, amount: 900.00 }
      ],
      subtotal: 900.00,
      tax: 108.00
    }
  ];

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.room.toString().includes(searchQuery)
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Partial': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Unpaid': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  const handleSilentPrint = (invoice) => {
    setPrintInvoiceData(invoice);
    // Wait for state update and re-render
    setTimeout(() => {
      window.print();
      // Clear print data after printing to cleanup (optional, but good practice)
      // setTimeout(() => setPrintInvoiceData(null), 1000); 
    }, 100);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 max-w-[1600px] mx-auto space-y-8 print:hidden"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">Invoices & Receipts</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate and manage invoices and receipts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Invoices"
            value="3"
            icon={<FileText size={20} className="text-blue-600 dark:text-blue-400" />}
            bg="bg-blue-50 dark:bg-blue-900/20"
            border="border-blue-100 dark:border-blue-800"
          />
          <StatsCard
            title="Total Revenue"
            value="₹3,136"
            icon={<DollarSign size={20} className="text-purple-600 dark:text-purple-400" />}
            bg="bg-purple-50 dark:bg-purple-900/20"
            border="border-purple-100 dark:border-purple-800"
          />
          <StatsCard
            title="Amount Collected"
            value="₹1,681.6"
            icon={<CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
            bg="bg-green-50 dark:bg-green-900/20"
            border="border-green-100 dark:border-green-800"
          />
          <StatsCard
            title="Outstanding"
            value="₹1,454.4"
            icon={<AlertCircle size={20} className="text-red-600 dark:text-red-400" />}
            bg="bg-red-50 dark:bg-red-900/20"
            border="border-red-100 dark:border-red-800"
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2">
          <div className="p-2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by invoice number, guest name, or room number..."
            className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-2">
            <Search size={16} />
            Search
          </button>
        </div>

        {/* Invoice List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invoice List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice No.</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Guest Name</th>
                  <th className="px-6 py-4 font-semibold">Room</th>
                  <th className="px-6 py-4 font-semibold">Check-in/out</th>
                  <th className="px-6 py-4 font-semibold">Total Amount</th>
                  <th className="px-6 py-4 font-semibold">Paid</th>
                  <th className="px-6 py-4 font-semibold">Balance</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{invoice.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{invoice.date}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{invoice.guest}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                        {invoice.room}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      <p>{invoice.checkIn}</p>
                      <p>{invoice.checkOut}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{invoice.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-600 dark:text-green-400 font-medium">₹{invoice.paid.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-medium ${invoice.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                      ₹{invoice.balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSilentPrint(invoice);
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg transition-colors"
                          title="Print"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Please select 'Save as PDF' in the print options.");
                            handleSilentPrint(invoice);
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <a
                          href={`mailto:${invoice.email}?subject=${encodeURIComponent(`Invoice ${invoice.id}`)}&body=${encodeURIComponent(`Dear ${invoice.guest},\n\nPlease find attached your invoice ${invoice.id}.\n\nThank you,\nGrand Plaza Hotel`)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg transition-colors inline-block"
                          title="Email"
                        >
                          <Mail size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal */}
        <InvoicePreviewModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />

      </motion.div>

      {/* Hidden Print Container */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8">
        {printInvoiceData && (
          <InvoiceTemplate invoice={printInvoiceData} />
        )}
      </div>
    </>
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

// Extracted Template for reuse in Modal and Print
function InvoiceTemplate({ invoice }) {
  if (!invoice) return null;
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">INVOICE</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
            <p className="font-medium text-gray-900 dark:text-white">Grand Plaza Hotel</p>
            <p>123 Main Street, City, State 12345</p>
            <p>Phone: +1-555-0100 | Email: info@grandplaza.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">{invoice.id}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Date: {invoice.date}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Receipt: RCP-{invoice.id.split('-')[2]}</p>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-700 my-4" />

      {/* Details Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Bill To:</p>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{invoice.guest}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Room: {invoice.room}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Stay Details:</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Check-in: {invoice.checkIn}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Check-out: {invoice.checkOut}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-xs mb-4">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700">
            <th className="py-2 text-left font-semibold text-gray-900 dark:text-white">Description</th>
            <th className="py-2 text-center font-semibold text-gray-900 dark:text-white">Quantity</th>
            <th className="py-2 text-right font-semibold text-gray-900 dark:text-white">Rate</th>
            <th className="py-2 text-right font-semibold text-gray-900 dark:text-white">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="py-2 text-gray-700 dark:text-gray-300">{item.desc}</td>
              <td className="py-2 text-center text-gray-700 dark:text-gray-300">{item.qty}</td>
              <td className="py-2 text-right text-gray-700 dark:text-gray-300">₹{item.rate.toFixed(2)}</td>
              <td className="py-2 text-right font-medium text-gray-900 dark:text-white">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex flex-col items-end space-y-1.5">
        <div className="w-40 flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{invoice.subtotal.toFixed(2)}</span>
        </div>
        <div className="w-40 flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Tax (12%):</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{invoice.tax.toFixed(2)}</span>
        </div>
        <div className="w-40 flex justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-1.5 mt-0.5">
          <span className="font-bold text-gray-900 dark:text-white">Total:</span>
          <span className="font-bold text-gray-900 dark:text-white">₹{invoice.totalAmount.toFixed(2)}</span>
        </div>
        <div className="w-40 flex justify-between text-xs text-green-600 dark:text-green-400 pt-0.5">
          <span className="font-medium">Amount Paid:</span>
          <span className="font-bold">₹{invoice.paid.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400">
        <p className="mb-0.5">Thank you for staying with us!</p>
        <p>For any queries, please contact our front desk.</p>
      </div>
    </div>
  );
}

function InvoicePreviewModal({ isOpen, onClose, invoice }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Please select 'Save as PDF' in the print options.");
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm print:hidden"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:max-h-none print:shadow-none print:rounded-none"
          >
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30 shrink-0 print:hidden">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Invoice Preview</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Preview and print invoice</p>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto print:p-0 print:overflow-visible">
              <div className="border border-gray-100 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm print:shadow-none print:border-none print:p-0">
                <InvoiceTemplate invoice={invoice} />
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2.5 bg-gray-50/50 dark:bg-gray-700/30 shrink-0 print:hidden">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Printer size={14} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Download size={14} />
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
