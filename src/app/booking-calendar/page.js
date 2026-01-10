'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, User, Phone, Mail, Calendar, DollarSign, Bed, Users, Edit, Trash2, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomType: '',
    roomNumber: '',
    guests: '',
    checkIn: '',
    checkOut: '',
    amount: '',
    notes: ''
  });

  // Mock bookings data with multi-day support
  const [bookings, setBookings] = useState([
    {
      id: 1,
      guestName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      roomType: 'Deluxe Suite',
      roomNumber: '201',
      guests: 2,
      checkIn: '2026-01-15',
      checkOut: '2026-01-18',
      amount: 750,
      status: 'confirmed',
      notes: 'Early check-in requested'
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      roomType: 'Standard Room',
      roomNumber: '105',
      guests: 1,
      checkIn: '2026-01-20',
      checkOut: '2026-01-22',
      amount: 300,
      status: 'pending',
      notes: ''
    },
    {
      id: 3,
      guestName: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+1 234 567 8902',
      roomType: 'Suite',
      roomNumber: '301',
      guests: 3,
      checkIn: '2026-01-22',
      checkOut: '2026-01-25',
      amount: 900,
      status: 'confirmed',
      notes: 'Anniversary celebration'
    }
  ]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const currentDate = new Date(dateStr);
      return currentDate >= checkIn && currentDate < checkOut;
    });
  };

  const isCheckInDate = (date, booking) => {
    if (!date) return false;
    return date.toISOString().split('T')[0] === booking.checkIn;
  };

  const isCheckOutDate = (date, booking) => {
    if (!date) return false;
    const checkOut = new Date(booking.checkOut);
    checkOut.setDate(checkOut.getDate() - 1);
    return date.toISOString().split('T')[0] === checkOut.toISOString().split('T')[0];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    const dateBookings = getBookingsForDate(date);
    if (dateBookings.length === 0) {
      setShowAddModal(true);
      setFormData({
        ...formData,
        checkIn: date.toISOString().split('T')[0],
        checkOut: new Date(date.getTime() + 86400000).toISOString().split('T')[0]
      });
    }
  };

  const handleBookingClick = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.checkIn >= formData.checkOut) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const newBooking = {
      id: bookings.length + 1,
      ...formData,
      amount: parseFloat(formData.amount),
      guests: parseInt(formData.guests),
      status: 'pending'
    };
    setBookings([...bookings, newBooking]);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(b => b.id !== id));
      setSelectedBooking(null);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    setSelectedBooking({ ...selectedBooking, status: newStatus });
  };

  const resetForm = () => {
    setFormData({
      guestName: '',
      email: '',
      phone: '',
      roomType: '',
      roomNumber: '',
      guests: '',
      checkIn: '',
      checkOut: '',
      amount: '',
      notes: ''
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const revenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    return { total, confirmed, pending, revenue };
  };

  const stats = getBookingStats();
  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
              Booking Calendar
            </h1>
            <p className="text-text-secondary text-sm font-medium">Manage your hotel bookings and reservations</p>
          </div>

          <button
            onClick={() => {
              setShowAddModal(true);
              setSelectedDate(new Date());
              setFormData({
                ...formData,
                checkIn: new Date().toISOString().split('T')[0],
                checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
          >
            <Calendar size={18} />
            New Booking
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <p className="text-xs text-text-secondary font-medium mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <p className="text-xs text-text-secondary font-medium mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <p className="text-xs text-text-secondary font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <p className="text-xs text-text-secondary font-medium mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-xl border border-border-color bg-bg-secondary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-xl font-bold text-text-primary min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-xl border border-border-color bg-bg-secondary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button
          onClick={handleToday}
          className="px-4 py-2 rounded-xl border border-border-color bg-bg-secondary text-text-primary text-sm font-medium hover:border-purple-500 hover:bg-purple-500/5 transition-all"
        >
          Today
        </button>
      </div>

      {/* Calendar */}
      <div className="card p-6">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-bold text-text-secondary uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const dateBookings = getBookingsForDate(date);
            const hasBookings = dateBookings.length > 0;

            return (
              <motion.div
                key={index}
                whileHover={date ? { scale: 1.02 } : {}}
                onClick={() => handleDateClick(date)}
                className={`
                  min-h-[120px] p-3 rounded-xl border transition-all cursor-pointer relative
                  ${!date ? 'bg-transparent border-transparent cursor-default' : ''}
                  ${date && !hasBookings ? 'bg-bg-secondary border-border-color hover:border-purple-500/50 hover:shadow-md' : ''}
                  ${date && hasBookings ? 'bg-purple-50/50 dark:bg-purple-900/5 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-500' : ''}
                  ${isToday(date) ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-bg-primary' : ''}
                `}
              >
                {date && (
                  <>
                    <div className={`text-sm font-bold mb-2 ${isToday(date) ? 'text-purple-600 dark:text-purple-400' : 'text-text-primary'}`}>
                      {date.getDate()}
                    </div>

                    <div className="space-y-1">
                      {dateBookings.map(booking => {
                        const isStart = isCheckInDate(date, booking);
                        const isEnd = isCheckOutDate(date, booking);

                        return (
                          <motion.div
                            key={booking.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={(e) => handleBookingClick(booking, e)}
                            className={`
                              text-xs px-2 py-1.5 cursor-pointer transition-all
                              ${isStart ? 'rounded-l-lg' : ''}
                              ${isEnd ? 'rounded-r-lg' : ''}
                              ${!isStart && !isEnd ? '' : ''}
                              ${booking.status === 'confirmed'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                              }
                            `}
                          >
                            {isStart && (
                              <div className="font-semibold truncate flex items-center gap-1">
                                <Clock size={10} />
                                {booking.guestName}
                              </div>
                            )}
                            {!isStart && (
                              <div className="h-4" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-text-secondary">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span className="text-text-secondary">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-purple-500" />
          <span className="text-text-secondary">Today</span>
        </div>
      </div>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary rounded-2xl w-full max-w-3xl border border-border-color shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Booking</h2>
                  <p className="text-purple-100 text-sm mt-1">
                    {selectedDate && selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Guest Name *</label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Room Type *</label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                    >
                      <option value="">Select Room Type</option>
                      <option value="Standard Room">Standard Room</option>
                      <option value="Deluxe Room">Deluxe Room</option>
                      <option value="Suite">Suite</option>
                      <option value="Deluxe Suite">Deluxe Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Room Number *</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Number of Guests *</label>
                    <input
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Check-in Date *</label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Check-out Date *</label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Total Amount ($) *</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="250.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-2">Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-border-color">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-bg-primary border border-border-color rounded-xl text-text-secondary font-medium hover:bg-bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    Add Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary rounded-2xl w-full max-w-2xl border border-border-color shadow-2xl"
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                    <p className="text-purple-100 text-sm mt-1">ID: #{selectedBooking.id.toString().padStart(4, '0')}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Guest Info */}
                <div className="flex items-center gap-4 p-4 bg-bg-primary rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary">Guest Name</p>
                    <p className="text-lg font-bold text-text-primary">{selectedBooking.guestName}</p>
                  </div>
                </div>

                {/* Contact & Room Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-text-secondary" />
                      <p className="text-xs text-text-secondary">Email</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary break-all">{selectedBooking.email}</p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={16} className="text-text-secondary" />
                      <p className="text-xs text-text-secondary">Phone</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">{selectedBooking.phone}</p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Bed size={16} className="text-text-secondary" />
                      <p className="text-xs text-text-secondary">Room</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">{selectedBooking.roomType}</p>
                    <p className="text-xs text-text-secondary mt-1">Room {selectedBooking.roomNumber}</p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-text-secondary" />
                      <p className="text-xs text-text-secondary">Guests</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">{selectedBooking.guests} {selectedBooking.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-text-secondary" />
                      <p className="text-xs text-text-secondary">Check-in</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-text-secondary" />
                      <p className="text-xs text-text-secondary">Check-out</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="p-4 bg-bg-primary rounded-xl">
                    <p className="text-xs text-text-secondary mb-2">Notes</p>
                    <p className="text-sm text-text-primary">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Amount */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-purple-600 dark:text-purple-400" />
                      <p className="text-sm font-medium text-text-secondary">Total Amount</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${selectedBooking.amount}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, selectedBooking.status === 'confirmed' ? 'pending' : 'confirmed')}
                    className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${selectedBooking.status === 'confirmed'
                        ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 hover:bg-green-100'
                        : 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 hover:bg-yellow-100'
                      }`}
                  >
                    <Check size={16} />
                    {selectedBooking.status === 'confirmed' ? 'Confirmed' : 'Mark as Confirmed'}
                  </button>

                  <button
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 font-semibold text-sm hover:bg-red-100 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
