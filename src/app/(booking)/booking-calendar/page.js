'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, User, Phone, Mail, Calendar, IndianRupee as DollarSign, Bed, Users, Edit, Trash2, Check, Clock, CheckCircle, Plus, ChevronDown, CreditCard, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('guest');
  const [idFile, setIdFile] = useState(null);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [isIdTypeDropdownOpen, setIsIdTypeDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    mobileNumber: '',
    roomType: '',
    roomNumber: '',
    numRooms: '',
    guests: '',
    checkIn: '',
    checkOut: '',
    bookingSource: '',
    amount: '',
    advanceAmount: '',
    notes: '',
    // C-Form fields
    passportNumber: '',
    visaNumber: '',
    nationality: '',
    arrivalFrom: '',
    proceedingTo: '',
    purposeOfVisit: '',
    idType: 'Aadhar Card',
    idNumber: ''
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
      setActiveTab('guest');
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
      amount: parseFloat(formData.amount || 0),
      advanceAmount: parseFloat(formData.advanceAmount || 0),
      guests: parseInt(formData.guests || 1),
      numRooms: parseInt(formData.numRooms || 1),
      status: 'pending'
    };
    setBookings([...bookings, newBooking]);
    setShowAddModal(false);
    resetForm();
  };

  const handleVerifyId = () => {
    if (!formData.idNumber || !idFile) {
      alert('Please enter ID number and upload ID proof first.');
      return;
    }
    // Simulate verification
    setIsIdVerified(true);
    alert('ID Verified Successfully!');
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
    setActiveTab('guest');
    setFormData({
      guestName: '',
      email: '',
      phone: '',
      mobileNumber: '',
      roomType: '',
      roomNumber: '',
      numRooms: '',
      guests: '',
      checkIn: '',
      checkOut: '',
      bookingSource: '',
      amount: '',
      advanceAmount: '',
      notes: '',
      passportNumber: '',
      visaNumber: '',
      nationality: '',
      arrivalFrom: '',
      proceedingTo: '',
      purposeOfVisit: '',
      idType: 'Aadhar Card',
      idNumber: ''
    });
    setIdFile(null);
    setIsIdVerified(false);
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
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-1 md:mb-2">
              Booking Calendar
            </h1>
            <p className="text-text-secondary text-xs md:text-sm font-medium">Manage your hotel bookings and reservations</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowGroupModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-secondary border border-border-color text-text-primary rounded-xl font-medium hover:border-purple-500 hover:text-purple-500 hover:bg-purple-50 transition-all hover:-translate-y-0.5"
            >
              <Users size={18} />
              <span className="whitespace-nowrap">Group Booking</span>
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
                setActiveTab('guest');
                setSelectedDate(new Date());
                setFormData({
                  ...formData,
                  checkIn: new Date().toISOString().split('T')[0],
                  checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                });
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5"
            >
              <Calendar size={18} />
              <span className="whitespace-nowrap">New Booking</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-bg-secondary rounded-xl p-3 md:p-4 border border-border-color">
            <p className="text-[10px] md:text-xs text-text-secondary font-medium mb-0.5 md:mb-1 uppercase tracking-wider">Total Bookings</p>
            <p className="text-xl md:text-2xl font-bold text-text-primary">{stats.total}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 md:p-4 border border-border-color">
            <p className="text-[10px] md:text-xs text-text-secondary font-medium mb-0.5 md:mb-1 uppercase tracking-wider">Confirmed</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 md:p-4 border border-border-color">
            <p className="text-[10px] md:text-xs text-text-secondary font-medium mb-0.5 md:mb-1 uppercase tracking-wider">Pending</p>
            <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 md:p-4 border border-border-color">
            <p className="text-[10px] md:text-xs text-text-secondary font-medium mb-0.5 md:mb-1 uppercase tracking-wider">Revenue</p>
            <p className="text-xl md:text-2xl font-bold text-purple-600">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handlePrevMonth}
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-border-color bg-bg-secondary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <h2 className="text-base md:text-xl font-bold text-text-primary min-w-[140px] md:min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={handleNextMonth}
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-border-color bg-bg-secondary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button
          onClick={handleToday}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-border-color bg-bg-secondary text-text-primary text-sm font-medium hover:border-purple-500 hover:bg-purple-500/5 transition-all"
        >
          Today
        </button>
      </div>

      {/* Calendar */}
      <div className="card p-3 md:p-6 overflow-hidden">
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[800px]">
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {days.map((date, index) => {
                const dateBookings = getBookingsForDate(date);
                const hasBookings = dateBookings.length > 0;

                return (
                  <motion.div
                    key={index}
                    whileHover={date ? { scale: 1.02 } : {}}
                    onClick={() => handleDateClick(date)}
                    className={`
                  min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer relative
                  ${!date ? 'bg-transparent border-transparent cursor-default' : ''}
                  ${date && !hasBookings ? 'bg-bg-secondary border-border-color hover:border-purple-500/50 hover:shadow-md' : ''}
                  ${date && hasBookings ? 'bg-purple-50/50 dark:bg-purple-900/5 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-500' : ''}
                  ${isToday(date) ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-bg-primary' : ''}
                `}
                  >
                    {date && (
                      <>
                        <div className={`text-xs font-bold mb-1 ${isToday(date) ? 'text-purple-600 dark:text-purple-400' : 'text-text-primary'}`}>
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
                              text-[10px] px-1.5 py-0.5 cursor-pointer transition-all
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
                                  <div className="h-3" />
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
              className="bg-bg-secondary rounded-2xl w-full max-w-3xl border border-border-color shadow-2xl"
            >
              <div className="sticky top-0 bg-bg-secondary border-b border-border-color px-8 py-6 flex justify-between items-center rounded-t-2xl z-20">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Add New Booking</h2>
                  <p className="text-text-secondary text-xs mt-0.5">
                    {selectedDate && selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-bg-secondary p-3 flex gap-4 border-b border-border-color sticky top-[88px] z-10 overflow-x-auto no-scrollbar">
                {[
                  { id: 'guest', label: 'Guest Details' },
                  { id: 'room', label: 'Room Selection' },
                  { id: 'payment', label: 'Payment Details' },
                  { id: 'idVerification', label: 'ID Verification' },
                  { id: 'cform', label: 'C-Form' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-text-secondary hover:bg-bg-primary'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="min-h-[250px]">
                  {activeTab === 'guest' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                          <User size={18} className="text-purple-600" />
                          Guest Details
                        </h3>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Guest Name *</label>
                        <input
                          type="text"
                          value={formData.guestName}
                          onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Mobile Number *</label>
                        <input
                          type="tel"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                          placeholder="Phone Number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                          placeholder="Email (Optional)"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'room' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                          <Bed size={18} className="text-purple-600" />
                          Room Selection
                        </h3>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Check-in Date *</label>
                        <input
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Check-out Date *</label>
                        <input
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Room Type *</label>
                        <select
                          value={formData.roomType}
                          onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Select room type</option>
                          <option value="Standard Room">Standard Room</option>
                          <option value="Deluxe Room">Deluxe Room</option>
                          <option value="Suite">Suite</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Number of Rooms *</label>
                        <input
                          type="number"
                          value={formData.numRooms}
                          onChange={(e) => setFormData({ ...formData, numRooms: e.target.value })}
                          required
                          min="1"
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Number of Guests *</label>
                        <input
                          type="number"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          required
                          min="1"
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Booking Source *</label>
                        <select
                          value={formData.bookingSource}
                          onChange={(e) => setFormData({ ...formData, bookingSource: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Select source</option>
                          <option value="Direct">Direct</option>
                          <option value="OTA">OTA</option>
                          <option value="Agent">Agent</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'payment' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                          <DollarSign size={18} className="text-purple-600" />
                          Payment Details
                        </h3>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1.5">Total Amount (₹) *</label>
                          <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1.5">Advance Amount (₹)</label>
                          <input
                            type="number"
                            value={formData.advanceAmount}
                            onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
                            className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Special Requests / Notes</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows="4"
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm resize-none"
                          placeholder="Any special requests or notes..."
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'idVerification' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                          <CheckCircle size={18} className="text-purple-600" />
                          ID Verification
                        </h3>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">ID Proof Type *</label>
                        <button
                          type="button"
                          onClick={() => setIsIdTypeDropdownOpen(!isIdTypeDropdownOpen)}
                          className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary flex items-center justify-between hover:border-purple-500 transition-all text-sm group"
                        >
                          <div className="flex items-center gap-2">
                            {formData.idType === 'Passport' ? <Globe size={16} className="text-purple-600" /> : <CreditCard size={16} className="text-purple-600" />}
                            <span className="font-medium">{formData.idType}</span>
                          </div>
                          <ChevronDown size={16} className={`text-text-secondary transition-transform duration-300 ${isIdTypeDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isIdTypeDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-xl shadow-xl z-[60] py-2 overflow-hidden"
                            >
                              {[
                                { name: 'Aadhar Card', icon: <CreditCard size={14} /> },
                                { name: 'PAN Card', icon: <CreditCard size={14} /> },
                                { name: 'Driving Licence', icon: <CreditCard size={14} /> },
                                { name: 'Passport', icon: <Globe size={14} /> },
                                { name: 'Voter ID', icon: <User size={14} /> }
                              ].map((option) => (
                                <button
                                  key={option.name}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, idType: option.name });
                                    setIsIdTypeDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-all hover:bg-purple-500/5 text-left ${formData.idType === option.name ? 'text-purple-600 bg-purple-500/5 font-bold' : 'text-text-secondary hover:text-purple-600'}`}
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${formData.idType === option.name ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-bg-primary text-text-secondary'}`}>
                                    {option.icon}
                                  </div>
                                  {option.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">ID Number *</label>
                        <input
                          type="text"
                          value={formData.idNumber}
                          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                          placeholder="Enter ID number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-text-primary mb-1.5 flex justify-between">
                          Upload ID Proof *
                          {idFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setIdFile(null);
                                setIsIdVerified(false);
                              }}
                              className="text-[10px] text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </label>
                        <div className="relative h-32 group cursor-pointer">
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                            onChange={(e) => {
                              setIdFile(e.target.files[0]);
                              setIsIdVerified(false);
                            }}
                          />
                          <div className={`absolute inset-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${isIdVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-border-color group-hover:border-purple-500 group-hover:bg-purple-500/5'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isIdVerified ? 'bg-green-500 text-white' : 'bg-bg-primary text-text-secondary group-hover:text-purple-500'}`}>
                              {isIdVerified ? <Check size={20} /> : <Plus size={20} />}
                            </div>
                            <div className="text-center">
                              <span className={`text-xs font-bold block ${isIdVerified ? 'text-green-600' : 'text-text-primary'}`}>{idFile ? idFile.name : 'Click or Drag to Upload'}</span>
                              <span className="text-[10px] text-text-secondary mt-1">{isIdVerified ? 'Successfully Verified' : 'PDF, JPG, PNG (Max 5MB)'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2 pt-2">
                        {!isIdVerified ? (
                          <button
                            type="button"
                            onClick={handleVerifyId}
                            className="w-full py-2.5 rounded-xl bg-purple-100 text-purple-600 font-bold text-xs uppercase hover:bg-purple-200 transition-all border border-purple-200"
                          >
                            Verify ID Document
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800/30">
                            <Check size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">ID Document Verified</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'cform' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                          <Edit size={18} className="text-purple-600" />
                          C-Form Details
                        </h3>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Passport Number</label>
                        <input
                          type="text"
                          value={formData.passportNumber}
                          onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Nationality</label>
                        <input
                          type="text"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Visa Number</label>
                        <input
                          type="text"
                          value={formData.visaNumber}
                          onChange={(e) => setFormData({ ...formData, visaNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Purpose of Visit</label>
                        <input
                          type="text"
                          value={formData.purposeOfVisit}
                          onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value })}
                          className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-border-color">
                  {activeTab !== 'guest' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['guest', 'room', 'payment', 'idVerification', 'cform'];
                        const currentIndex = tabs.indexOf(activeTab);
                        setActiveTab(tabs[currentIndex - 1]);
                      }}
                      className="flex-1 px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-secondary font-bold hover:bg-bg-secondary transition-all"
                    >
                      Back
                    </button>
                  )}
                  {activeTab !== 'cform' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['guest', 'room', 'payment', 'idVerification', 'cform'];
                        const currentIndex = tabs.indexOf(activeTab);
                        setActiveTab(tabs[currentIndex + 1]);
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-600 transition-all"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isIdVerified}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${isIdVerified ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-purple-500/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'}`}
                    >
                      {isIdVerified ? 'Confirm Booking' : 'Verify ID to Confirm'}
                    </button>
                  )}
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
              <div className="bg-bg-secondary border-b border-border-color px-8 py-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Booking Details</h2>
                  <p className="text-text-secondary text-xs mt-0.5">ID: #{selectedBooking.id.toString().padStart(4, '0')}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Guest Info */}
                <div className="flex items-center gap-3 p-3 bg-bg-primary rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Guest Name</p>
                    <p className="text-base font-bold text-text-primary">{selectedBooking.guestName}</p>
                  </div>
                </div>

                {/* Contact & Room Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mail size={14} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Email</p>
                    </div>
                    <p className="text-xs font-medium text-text-primary break-all">{selectedBooking.email}</p>
                  </div>

                  <div className="p-3 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Phone size={14} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Phone</p>
                    </div>
                    <p className="text-xs font-medium text-text-primary">{selectedBooking.phone}</p>
                  </div>

                  <div className="p-3 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bed size={14} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Room</p>
                    </div>
                    <p className="text-xs font-medium text-text-primary">{selectedBooking.roomType}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Room {selectedBooking.roomNumber}</p>
                  </div>

                  <div className="p-3 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={14} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Guests</p>
                    </div>
                    <p className="text-xs font-medium text-text-primary">{selectedBooking.guests} {selectedBooking.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>

                  <div className="p-3 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar size={14} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Check-in</p>
                    </div>
                    <p className="text-xs font-medium text-text-primary">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                  </div>

                  <div className="p-3 bg-bg-primary rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar size={14} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Check-out</p>
                    </div>
                    <p className="text-xs font-medium text-text-primary">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 bg-bg-primary rounded-xl">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Notes</p>
                    <p className="text-xs text-text-primary">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-purple-600 dark:text-purple-400" />
                      <p className="text-xs font-medium text-text-secondary uppercase font-bold tracking-wider">Total Amount</p>
                    </div>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">₹{selectedBooking.amount}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, selectedBooking.status === 'confirmed' ? 'pending' : 'confirmed')}
                    className={`flex-1 px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${selectedBooking.status === 'confirmed'
                      ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 hover:bg-green-100'
                      : 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 hover:bg-yellow-100'
                      }`}
                  >
                    <Check size={14} />
                    {selectedBooking.status === 'confirmed' ? 'Confirmed' : 'Mark as Confirmed'}
                  </button>

                  <button
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 font-bold text-xs hover:bg-red-100 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Booking Modal */}
      <AnimatePresence>
        {showGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-secondary rounded-2xl w-full max-w-2xl border border-border-color shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-bg-secondary border-b border-border-color px-6 py-5 flex justify-between items-center rounded-t-2xl sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">New Group Booking</h2>
                  <p className="text-xs text-text-secondary mt-0.5">Please fill in the group reservation details</p>
                </div>
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="w-9 h-9 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Group Name *</label>
                    <input type="text" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" placeholder="e.g. Wedding Party" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Contact Person *</label>
                    <input type="text" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Contact Phone *</label>
                    <input type="text" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" placeholder="+91..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Contact Email *</label>
                    <input type="email" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Check-in Date *</label>
                    <input type="date" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Check-out Date *</label>
                    <input type="date" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Number of Rooms *</label>
                    <input type="number" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Total Guests *</label>
                    <input type="number" className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm h-10" placeholder="e.g. 10" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] font-bold text-text-primary mb-1.5 uppercase tracking-wider">Special Requests / Notes</label>
                  <textarea rows="3" className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm resize-none" placeholder="Enter any additional requirements..."></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-2 px-6 pb-6 pt-4 border-t border-border-color">
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="flex-1 px-4 py-2.5 bg-bg-primary border border-border-color rounded-lg text-text-secondary font-semibold hover:bg-bg-secondary transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Group Booking Request Created!');
                    setShowGroupModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-500/20 active:translate-y-0 text-xs"
                >
                  Create Group Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
