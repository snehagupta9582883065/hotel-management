'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  Eye,
  CheckCircle,
  X,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // State for bookings data
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      guestName: 'John Doe',
      room: '101',
      roomType: 'Standard',
      checkIn: '12/01/2026',
      checkOut: '12/03/2026',
      guests: 2,
      status: 'Checked-in',
      total: '$316',
      paid: '$316',
      balance: '$0'
    },
    {
      id: 'BK002',
      guestName: 'Jane Smith',
      room: '202',
      roomType: 'Deluxe',
      checkIn: '09/01/2026',
      checkOut: '14/01/2026',
      guests: 3,
      status: 'Checked-in',
      total: '$2120',
      paid: '$2120',
      balance: '$0'
    },
    {
      id: 'BK003',
      guestName: 'Bob Wilson',
      room: '101',
      roomType: 'Standard',
      checkIn: '09/01/2026',
      checkOut: '11/01/2026',
      guests: 2,
      status: 'Checked-in',
      total: '$640',
      paid: '$640',
      balance: '$0'
    },
    {
      id: 'BK004',
      guestName: 'Alice Brown',
      room: '303',
      roomType: 'Suite',
      checkIn: '05/01/2026',
      checkOut: '08/01/2026',
      guests: 4,
      status: 'Checked-out',
      total: '$1512',
      paid: '$1512',
      balance: '$0'
    },
    {
      id: 'BK005',
      guestName: 'Charlie Davis',
      room: '201',
      roomType: 'Deluxe',
      checkIn: '13/01/2026',
      checkOut: '18/01/2026',
      guests: 2,
      status: 'Confirmed',
      total: '$800',
      paid: '$320',
      balance: '$480'
    },
    {
      id: 'BK006',
      guestName: 'Diana Prince',
      room: '104',
      roomType: 'Standard',
      checkIn: '13/01/2026',
      checkOut: '15/01/2026',
      guests: 1,
      status: 'Confirmed',
      total: '$168',
      paid: '$168',
      balance: '$0'
    },
    {
      id: 'BK007',
      guestName: 'Ethan Hunt',
      room: '401',
      roomType: 'Deluxe',
      checkIn: '17/01/2026',
      checkOut: '19/01/2026',
      guests: 3,
      status: 'Canceled',
      total: '$640',
      paid: '$0',
      balance: '$640'
    }
  ]);

  const statusOptions = ['Confirmed', 'Checked-in', 'Checked-out', 'Canceled'];

  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const checkedInBookings = bookings.filter(b => b.status === 'Checked-in').length;
  const totalRevenue = bookings.reduce((sum, b) => {
    const amount = parseInt(b.total.replace('$', '').replace(',', ''));
    return sum + amount;
  }, 0);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setFilterStatus('all');
  };

  const activeFiltersCount = filterStatus !== 'all' ? 1 : 0;

  // Click outside to close filter dropdown
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Checked-in': return 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'Checked-out': return 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
      case 'Canceled': return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return '';
    }
  };

  const handleView = (bookingId) => {
    alert(`Viewing booking: ${bookingId}`);
  };

  const handleCheckIn = (bookingId) => {
    if (window.confirm(`Check in booking ${bookingId}?`)) {
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'Checked-in' } : b
      ));
    }
  };

  const handleCancel = (bookingId) => {
    if (window.confirm(`Cancel booking ${bookingId}?`)) {
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'Canceled' } : b
      ));
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
            Booking List
          </h1>
          <p className="text-text-secondary text-sm font-medium">View and manage all bookings</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Total Bookings</div>
            <div className="text-3xl font-bold text-text-primary">{totalBookings}</div>
          </div>
        </div>

        <div className="card flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white flex-shrink-0">
            <CheckCircle size={24} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Confirmed</div>
            <div className="text-3xl font-bold text-text-primary">{confirmedBookings}</div>
          </div>
        </div>

        <div className="card flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white flex-shrink-0">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Checked-in</div>
            <div className="text-3xl font-bold text-text-primary">{checkedInBookings}</div>
          </div>
        </div>

        <div className="card flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Total Revenue</div>
            <div className="text-3xl font-bold text-text-primary">${totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Booking List Section */}
      <div className="card p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 bg-bg-primary px-4 py-2.5 rounded-xl border border-border-color focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all flex-1 max-w-lg">
              <Search size={18} className="text-text-secondary flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by booking ID, guest name, or room..."
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
                <span>All Status</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-lg min-w-[18px] text-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-bg-secondary border border-border-color rounded-2xl p-6 min-w-[300px] shadow-2xl z-50 animate-slideDown">
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-text-primary mb-2.5 uppercase tracking-wider">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm font-medium cursor-pointer transition-all outline-none hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="all">All Status</option>
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  {activeFiltersCount > 0 && (
                    <div className="mt-5 pt-5 border-t border-border-color">
                      <button
                        onClick={clearFilters}
                        className="w-full px-3 py-3 bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl text-red-500 text-sm font-semibold cursor-pointer hover:from-red-500/15 hover:to-red-500/10 hover:border-red-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20 active:translate-y-0 transition-all"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border-color">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bg-primary border-b border-border-color">
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Booking ID</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Guest Name</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Room</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Check In</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Check Out</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Guests</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Total</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Paid</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Balance</th>
                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border-color hover:bg-purple-500/5 transition-colors">
                  <td className="px-5 py-5 text-text-primary font-semibold whitespace-nowrap">{booking.id}</td>
                  <td className="px-5 py-5 text-text-primary font-medium whitespace-nowrap">{booking.guestName}</td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-text-primary">{booking.room}</div>
                      <div className="text-xs text-text-secondary">{booking.roomType}</div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-text-primary font-medium whitespace-nowrap">{booking.checkIn}</td>
                  <td className="px-5 py-5 text-text-primary font-medium whitespace-nowrap">{booking.checkOut}</td>
                  <td className="px-5 py-5 text-text-primary font-medium whitespace-nowrap">{booking.guests}</td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-semibold text-xs min-w-[90px] ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-text-primary font-semibold whitespace-nowrap">{booking.total}</td>
                  <td className="px-5 py-5 text-green-500 font-semibold whitespace-nowrap">{booking.paid}</td>
                  <td className={`px-5 py-5 font-semibold whitespace-nowrap ${booking.balance === '$0' ? 'text-text-secondary' : 'text-red-500'}`}>
                    {booking.balance}
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="w-8 h-8 rounded-lg border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center cursor-pointer hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 hover:-translate-y-0.5 transition-all"
                        title="View"
                        onClick={() => handleView(booking.id)}
                      >
                        <Eye size={16} />
                      </button>
                      {booking.status === 'Confirmed' && (
                        <button
                          className="w-8 h-8 rounded-lg border border-green-500/30 bg-bg-primary text-green-500 flex items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-500/10 hover:-translate-y-0.5 transition-all"
                          title="Check In"
                          onClick={() => handleCheckIn(booking.id)}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {(booking.status === 'Confirmed' || booking.status === 'Checked-in') && (
                        <button
                          className="w-8 h-8 rounded-lg border border-red-500/30 bg-bg-primary text-red-500 flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-500/10 hover:-translate-y-0.5 transition-all"
                          title="Cancel"
                          onClick={() => handleCancel(booking.id)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
