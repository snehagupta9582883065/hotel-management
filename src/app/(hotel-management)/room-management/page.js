'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ChevronDown,
    X,
    LayoutGrid,
    LogIn,
    LogOut,
    CheckCircle,
    User,
    Clock,
    Printer,
    MapPin,
    Phone,
    Filter,
    CreditCard,
    DollarSign
} from 'lucide-react';

export default function RoomManagement() {
    const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'checkin'

    // ==========================================
    // CENTRALIZED STATE MANAGEMENT
    // ==========================================

    // 1. Rooms State
    const [rooms, setRooms] = useState([
        { id: 1, roomNumber: '101', type: 'Standard', floor: 1, maxOccupancy: 2, basePrice: 150, status: 'Available', amenities: ['AC', 'WiFi', 'TV'] },
        { id: 2, roomNumber: '102', type: 'Standard', floor: 1, maxOccupancy: 2, basePrice: 150, status: 'Occupied', amenities: ['AC', 'WiFi', 'TV'] }, // Occupied by initial mock guest
        { id: 3, roomNumber: '103', type: 'Deluxe', floor: 1, maxOccupancy: 3, basePrice: 250, status: 'Available', amenities: ['AC', 'WiFi', 'Mini Bar'] },
        { id: 4, roomNumber: '201', type: 'Suite', floor: 2, maxOccupancy: 4, basePrice: 450, status: 'Available', amenities: ['AC', 'WiFi', 'Jacuzzi', 'Kitchen'] },
        { id: 5, roomNumber: '202', type: 'Deluxe', floor: 2, maxOccupancy: 3, basePrice: 250, status: 'Cleaning', amenities: ['AC', 'WiFi', 'Balcony'] }
    ]);

    // 2. Bookings/Guests State
    const [bookings, setBookings] = useState([
        // Pending Arrivals
        { id: 'BK-7829', guest: 'John Doe', type: 'VIP', roomType: 'Suite', status: 'Pending', time: '14:00', phone: '+1 234 567 8900', assignedRoom: null, balance: 450 },
        { id: 'BK-7830', guest: 'Sarah Smith', type: 'Corporate', roomType: 'Deluxe', status: 'Pending', time: '14:30', phone: '+1 987 654 3210', assignedRoom: null, balance: 250 },
        // Checked In
        { id: 'BK-7831', guest: 'Mike Johnson', type: 'Regular', roomType: 'Standard', status: 'Checked In', time: '12:15', phone: '+1 555 123 4567', assignedRoom: '102', balance: 0 },
        // Pending Departures (Mock data: Guests currently in rooms who need to leave)
        { id: 'BK-7801', guest: 'David Wilson', type: 'Regular', roomType: 'Standard', status: 'Checked In', time: '10:00', phone: '+1 555 987 6543', assignedRoom: '304', balance: 0 }, // Ready to checkout
        { id: 'BK-7805', guest: 'Emma Watson', type: 'Regular', roomType: 'Standard', status: 'Checked In', time: '11:00', phone: '+1 555 456 7890', assignedRoom: '201', balance: 124.50 }, // Pending payment
    ]);

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleCheckInGuest = (bookingId, roomId) => {
        // 1. Update Booking Status
        setBookings(prev => prev.map(b =>
            b.id === bookingId
                ? { ...b, status: 'Checked In', assignedRoom: roomId, checkInTime: new Date().toLocaleTimeString() }
                : b
        ));

        // 2. Update Room Status to Occupied
        setRooms(prev => prev.map(r =>
            r.roomNumber === roomId
                ? { ...r, status: 'Occupied' }
                : r
        ));

        alert(`Check-In Successful! Room ${roomId} assigned.`);
    };

    const handleCheckOutGuest = (bookingId, roomId) => {
        // 1. Update Booking Status
        setBookings(prev => prev.map(b =>
            b.id === bookingId
                ? { ...b, status: 'Checked Out', checkOutTime: new Date().toLocaleTimeString(), balance: 0 }
                : b
        ));

        // 2. Update Room Status to Cleaning
        if (roomId) {
            setRooms(prev => prev.map(r =>
                r.roomNumber === roomId
                    ? { ...r, status: 'Cleaning' }
                    : r
            ));
        }

        alert(`Check-Out Successful! Room ${roomId} marked for cleaning.`);
    };

    // Calculate Stats for KPI Cards
    const stats = {
        expectedArrivals: bookings.filter(b => b.status === 'Pending').length,
        checkedIn: bookings.filter(b => b.status === 'Checked In').length,
        expectedDepartures: bookings.filter(b => b.status === 'Checked In').length, // Technically anyone checked in is a potential departure, but in a real app this would filter by date
        checkedOut: bookings.filter(b => b.status === 'Checked Out').length
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn pb-10">
            {/* Page Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                        Room Management
                    </h1>
                    <p className="text-text-secondary text-sm font-medium">Manage rooms, assignments, and guest flow</p>
                </div>

                <div className="bg-bg-secondary p-1.5 rounded-xl border border-border-color flex gap-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'rooms'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                            }`}
                    >
                        <LayoutGrid size={18} />
                        <span>All Rooms</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('checkin')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'checkin'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            <LogIn size={18} />
                            <span className="opacity-50">/</span>
                            <LogOut size={18} />
                        </div>
                        <span>Check-In & Out</span>
                    </button>
                </div>
            </div>

            {/* Content Display */}
            <div className="min-h-[600px]">
                {activeTab === 'rooms'
                    ? <RoomListContent rooms={rooms} setRooms={setRooms} />
                    : <CheckInOutContent
                        stats={stats}
                        bookings={bookings}
                        rooms={rooms}
                        onCheckIn={handleCheckInGuest}
                        onCheckOut={handleCheckOutGuest}
                    />
                }
            </div>
        </div>
    );
}

// =========================================================================================
// 1. ORIGINAL ROOM MANAGEMENT CONTENT (Restored & Prop-driven)
// =========================================================================================

function RoomListContent({ rooms, setRooms }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [formData, setFormData] = useState({
        roomNumber: '', roomType: '', floor: '', maxOccupancy: '', basePrice: '', status: 'Available', amenities: []
    });

    const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Penthouse'];
    const statusOptions = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    const amenitiesList = ['AC', 'WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchen', 'Safe'];

    // ... Handlers (Restored)
    const handleInputChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleAmenityToggle = (amenity) => setFormData(p => ({ ...p, amenities: p.amenities.includes(amenity) ? p.amenities.filter(a => a !== amenity) : [...p.amenities, amenity] }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRoom) {
            setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...formData, floor: parseInt(formData.floor), maxOccupancy: parseInt(formData.maxOccupancy), basePrice: parseInt(formData.basePrice) } : r));
        } else {
            setRooms(prev => [...prev, { id: Date.now(), ...formData, floor: parseInt(formData.floor), maxOccupancy: parseInt(formData.maxOccupancy), basePrice: parseInt(formData.basePrice) }]);
        }
        handleCancel();
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({ ...room, floor: room.floor.toString(), maxOccupancy: room.maxOccupancy.toString(), basePrice: room.basePrice.toString() });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false); setEditingRoom(null);
        setFormData({ roomNumber: '', roomType: '', floor: '', maxOccupancy: '', basePrice: '', status: 'Available', amenities: [] });
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || room.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || room.type === filterType;
        const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const activeFiltersCount = (filterType !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);
    const filterRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => { if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false); };
        if (showFilterDropdown) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilterDropdown]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'Occupied': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'Cleaning': return 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
            case 'Maintenance': return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            default: return '';
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Action Bar */}
            <div className="mb-6 relative z-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full md:max-w-md bg-bg-primary px-4 py-3 rounded-xl border border-border-color focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                        <Search size={18} className="text-text-secondary flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search by room number or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-none bg-transparent outline-none w-full text-text-primary text-sm font-medium"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative" ref={filterRef}>
                            <button
                                className="flex items-center gap-2 px-5 py-3 bg-bg-primary border border-border-color rounded-xl text-text-secondary text-sm font-bold cursor-pointer hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all w-full md:w-auto justify-center"
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            >
                                <Filter size={18} />
                                <span>Filter</span>
                                {activeFiltersCount > 0 && <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">{activeFiltersCount}</span>}
                                <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Filter Dropdown (Restored) */}
                            {showFilterDropdown && (
                                <div className="absolute top-full right-0 mt-3 bg-bg-secondary border border-border-color rounded-2xl p-6 min-w-[300px] shadow-2xl z-50">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-text-primary mb-2.5 uppercase tracking-wider">Room Type</label>
                                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm font-medium outline-none focus:border-purple-500">
                                                <option value="all">All Types</option>
                                                {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-primary mb-2.5 uppercase tracking-wider">Status</label>
                                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm font-medium outline-none focus:border-purple-500">
                                                <option value="all">All Status</option>
                                                {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20 hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            Add Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Room Grid (Restored) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.map((room) => (
                    <div
                        key={room.id}
                        onClick={() => { setSelectedRoom(room); setIsDetailsModalOpen(true); }}
                        className="group flex flex-col bg-bg-primary border border-border-color rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
                    >
                        <div className="p-5 border-b border-border-color bg-gradient-to-br from-bg-primary to-bg-secondary group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1 block">{room.type}</span>
                                    <h3 className="text-xl font-bold text-text-primary">Room {room.roomNumber}</h3>
                                </div>
                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-tighter ${getStatusClass(room.status)}`}>
                                    {room.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" />Floor {room.floor}</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" />Max {room.maxOccupancy} Guests</span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col gap-5">
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 block">Amenities</label>
                                <div className="flex flex-wrap gap-2">
                                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-bg-secondary text-text-primary border border-border-color text-[10px] rounded-lg font-bold group-hover:border-purple-500/30 transition-colors">{amenity}</span>
                                    ))}
                                    {room.amenities.length > 3 && <span className="px-2 py-1 bg-bg-secondary text-text-secondary text-[10px] rounded-lg font-bold">+{room.amenities.length - 3}</span>}
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-color/50 flex items-end justify-between">
                                <div>
                                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Base Price</label>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400">${room.basePrice}</span>
                                        <span className="text-xs font-medium text-text-secondary">/night</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(room); }} className="w-9 h-9 rounded-xl border border-border-color bg-bg-secondary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all"><Edit size={16} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) setRooms(prev => prev.filter(r => r.id !== room.id)); }} className="w-9 h-9 rounded-xl border border-red-500/20 bg-bg-secondary text-red-500 flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Room Modal (Restored Full Version) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-bg-secondary rounded-2xl w-full max-w-3xl border border-border-color shadow-2xl">
                        <div className="sticky top-0 bg-bg-secondary border-b border-border-color px-8 py-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                                <p className="text-xs text-text-secondary mt-0.5">{editingRoom ? 'Update room details' : 'Fill in the room information'}</p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="w-10 h-10 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Room Number</label>
                                    <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} required className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm" placeholder="e.g., 101" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Room Type</label>
                                    <select name="roomType" value={formData.roomType} onChange={handleInputChange} required className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm cursor-pointer">
                                        <option value="">Select Type</option>
                                        {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Floor</label>
                                    <input type="number" name="floor" value={formData.floor} onChange={handleInputChange} required className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm" placeholder="e.g., 1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Max Occupancy</label>
                                    <input type="number" name="maxOccupancy" value={formData.maxOccupancy} onChange={handleInputChange} required className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm" placeholder="e.g., 2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Base Price ($)</label>
                                    <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} required className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm" placeholder="e.g., 150" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm cursor-pointer">
                                        {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-semibold text-text-primary mb-2">Amenities</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {amenitiesList.map(amenity => (
                                        <label key={amenity} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${formData.amenities.includes(amenity) ? 'bg-purple-50 border-purple-500 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-bg-primary border-border-color text-text-secondary hover:border-purple-300'}`}>
                                            <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="w-3.5 h-3.5 accent-purple-600" />
                                            <span className="text-xs font-medium">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6 pt-4 border-t border-border-color">
                                <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-text-secondary font-medium hover:bg-bg-secondary transition-all text-sm">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5">{editingRoom ? 'Update Room' : 'Add Room'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Room Details Popup (Restored Full Version) */}
            {isDetailsModalOpen && selectedRoom && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-bg-secondary rounded-2xl w-full max-w-lg border border-border-color shadow-2xl overflow-hidden">
                        <div className="sticky top-0 bg-bg-secondary border-b border-border-color px-8 py-5 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Room Details</h2>
                                <p className="text-xs text-text-secondary mt-0.5">Viewing {selectedRoom.type} #{selectedRoom.roomNumber}</p>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="w-10 h-10 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><X size={20} /></button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1.5"><label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Status</label><span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-tight ${getStatusClass(selectedRoom.status)}`}>{selectedRoom.status}</span></div>
                                <div className="space-y-1.5 text-right"><label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Price per Night</label><div className="flex items-baseline justify-end gap-1"><span className="text-2xl font-black text-purple-600 dark:text-purple-400">${selectedRoom.basePrice}</span><span className="text-xs font-medium text-text-secondary">USD</span></div></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-bg-primary p-4 rounded-xl border border-border-color flex flex-col items-center"><span className="text-text-secondary text-[10px] font-bold uppercase mb-1">Floor</span><span className="text-lg font-bold text-text-primary">{selectedRoom.floor}</span></div>
                                <div className="bg-bg-primary p-4 rounded-xl border border-border-color flex flex-col items-center"><span className="text-text-secondary text-[10px] font-bold uppercase mb-1">Occupancy</span><span className="text-lg font-bold text-text-primary">{selectedRoom.maxOccupancy} Persons</span></div>
                            </div>
                            <div className="mb-8"><label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 block">Amenities</label><div className="flex flex-wrap gap-2">{selectedRoom.amenities.map((amenity, idx) => (<div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span className="text-xs font-semibold text-purple-700 dark:text-purple-300">{amenity}</span></div>))}</div></div>
                            <div className="flex gap-4 pt-4 border-t border-border-color">
                                <button onClick={() => { setIsDetailsModalOpen(false); handleEdit(selectedRoom); }} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5"><Edit size={18} /> Edit</button>
                                <button onClick={() => setIsDetailsModalOpen(false)} className="flex-1 px-6 py-3 bg-bg-primary border border-border-color text-text-secondary rounded-xl font-bold hover:bg-bg-secondary transition-all">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// =========================================================================================
// 2. CHECK-IN & CHECK-OUT CONTENT (Functional & Prop Interaction)
// =========================================================================================

function CheckInOutContent({ stats, bookings, rooms, onCheckIn, onCheckOut }) {
    const [subTab, setSubTab] = useState('arrivals');
    const [searchQuery, setSearchQuery] = useState('');

    const visibleBookings = bookings.filter(b => {
        const matchesSearch = b.guest.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
        if (subTab === 'arrivals') {
            return matchesSearch && b.status === 'Pending';
        } else {
            // Departures: Show Checked In guests
            return matchesSearch && b.status === 'Checked In';
        }
    });

    return (
        <div className="animate-fadeIn space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <PremiumStatCard title="Expected Arrivals" value={stats.expectedArrivals} icon={<LogIn size={20} />} color="blue" />
                <PremiumStatCard title="Checked In" value={stats.checkedIn} icon={<CheckCircle size={20} />} color="green" />
                <PremiumStatCard title="Expected Departures" value={stats.expectedDepartures} icon={<LogOut size={20} />} color="orange" />
                <PremiumStatCard title="Checked Out" value={stats.checkedOut} icon={<User size={20} />} color="purple" />
            </div>

            <div className="bg-bg-secondary rounded-2xl border border-border-color shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Sub Tabs */}
                <div className="p-6 border-b border-border-color flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-primary/30">
                    <div className="flex bg-bg-primary p-1.5 rounded-xl border border-border-color">
                        <button onClick={() => setSubTab('arrivals')} className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'arrivals' ? 'bg-purple-600 text-white shadow-md' : 'text-text-secondary hover:text-text-primary'}`}><LogIn size={18} /> Arrivals</button>
                        <button onClick={() => setSubTab('departures')} className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'departures' ? 'bg-purple-600 text-white shadow-md' : 'text-text-secondary hover:text-text-primary'}`}><LogOut size={18} /> Departures</button>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input type="text" placeholder="Search guest name or booking ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-bg-primary border border-border-color rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 p-6">
                    {subTab === 'arrivals'
                        ? <ArrivalsListPremium data={visibleBookings} rooms={rooms} onCheckIn={onCheckIn} />
                        : <DeparturesListPremium data={visibleBookings} onCheckOut={onCheckOut} />
                    }
                </div>
            </div>
        </div>
    );
}

function PremiumStatCard({ title, value, icon, color }) {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800',
        green: 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800',
        orange: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800',
        purple: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800',
    };
    return (
        <div className={`p-6 rounded-2xl border ${colors[color].split(' ')[2]} bg-bg-secondary shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow`}>
            {/* Split logic is hacky here because I passed composed strings. Just minimal implementation to match style. */}
            <div className={`p-4 rounded-xl ${colors[color].split(' ').slice(0, 2).join(' ')}`}>{icon}</div>
            <div><p className="text-sm text-text-secondary font-bold uppercase tracking-wide">{title}</p><h4 className="text-3xl font-black text-text-primary mt-1">{value}</h4></div>
        </div>
    );
}

function ArrivalsListPremium({ data, rooms, onCheckIn }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

    if (data.length === 0) return <div className="text-center p-10 text-text-secondary font-medium">No pending arrivals found.</div>;

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-color text-xs font-bold text-text-secondary uppercase tracking-wider">
                            <th className="py-4 px-4">Guest Info</th>
                            <th className="py-4 px-4">Booking Details</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {data.map(b => (
                            <tr key={b.id} className="group hover:bg-bg-primary/50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">{b.guest.charAt(0)}</div>
                                        <div><p className="font-bold text-text-primary">{b.guest}</p><p className="text-xs text-text-secondary font-medium">{b.phone}</p></div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-text-primary">{b.roomType}</span>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <span className="bg-bg-primary border border-border-color px-1.5 py-0.5 rounded font-mono">{b.id}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {b.time}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-100 text-amber-700 border-amber-200">{b.status}</span></td>
                                <td className="py-4 px-4 text-right">
                                    <button onClick={() => { setSelectedBooking(b); setIsCheckInModalOpen(true); }} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-bold rounded-xl hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all">Check In</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CheckInModal
                isOpen={isCheckInModalOpen}
                onClose={() => setIsCheckInModalOpen(false)}
                booking={selectedBooking}
                rooms={rooms} // Pass Available Rooms
                onConfirm={onCheckIn}
            />
        </>
    );
}

function DeparturesListPremium({ data, onCheckOut }) {
    if (data.length === 0) return <div className="text-center p-10 text-text-secondary font-medium">No active guests found.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border-color text-xs font-bold text-text-secondary uppercase tracking-wider">
                        <th className="py-4 px-4">Guest Info</th>
                        <th className="py-4 px-4">Room Assignment</th>
                        <th className="py-4 px-4">Balance</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                    {data.map(d => (
                        <tr key={d.id} className="group hover:bg-bg-primary/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-text-primary">{d.guest}<div className="text-xs font-normal text-text-secondary font-mono mt-0.5">{d.id}</div></td>
                            <td className="py-4 px-4"><span className="px-3 py-1 rounded-lg bg-bg-primary border border-border-color text-sm font-bold text-purple-600">Room {d.assignedRoom}</span></td>
                            <td className="py-4 px-4"><span className={`font-bold ${d.balance === 0 ? 'text-green-600' : 'text-red-500'}`}>${d.balance}</span></td>
                            <td className="py-4 px-4 text-right flex justify-end gap-3">
                                <button className="p-2 text-text-secondary hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"><Printer size={18} /></button>
                                <button onClick={() => onCheckOut(d.id, d.assignedRoom)} className="px-5 py-2 bg-red-50 text-red-600 border border-red-100 text-sm font-bold rounded-xl hover:bg-red-100 transition-all">Check Out</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CheckInModal({ isOpen, onClose, booking, rooms, onConfirm }) {
    const [selectedRoomId, setSelectedRoomId] = useState('');

    // Filter rooms that match type (optional) and are Available
    const availableRooms = rooms.filter(r => r.status === 'Available');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedRoomId) {
            alert('Please select a room completely.');
            return;
        }
        onConfirm(booking.id, selectedRoomId);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full max-w-lg bg-bg-secondary rounded-2xl shadow-2xl border border-border-color overflow-hidden z-10"
                >
                    <div className="p-6 border-b border-border-color flex justify-between items-center bg-bg-primary/30">
                        <h3 className="text-xl font-bold text-text-primary">Check In Guest</h3>
                        <button onClick={onClose}><X size={20} className="text-text-secondary hover:text-text-primary" /></button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-200"><User size={24} /></div>
                            <div><h4 className="font-bold text-lg text-text-primary">{booking?.guest}</h4><p className="text-sm text-text-secondary">Booking: <span className="font-mono">{booking?.id}</span></p></div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Assign Room</label>
                            <select
                                value={selectedRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                className="w-full p-3 bg-bg-primary border border-border-color rounded-xl outline-none focus:border-purple-500 cursor-pointer text-sm font-medium"
                            >
                                <option value="">Select a clean room...</option>
                                {availableRooms.map(r => (
                                    <option key={r.id} value={r.roomNumber}>{r.roomNumber} - {r.type} (${r.basePrice})</option>
                                ))}
                            </select>
                            {availableRooms.length === 0 && <p className="text-xs text-red-500 mt-2 font-medium">No rooms available!</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Identification</label>
                            <div className="border-2 border-dashed border-border-color rounded-xl p-8 flex flex-col items-center justify-center text-text-secondary hover:bg-bg-primary hover:border-purple-500/50 cursor-pointer transition-all">
                                <div className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center mb-2"><User size={20} /></div>
                                <span className="text-sm font-medium">Upload Passport or ID</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-4 border-t border-border-color bg-bg-primary/30 flex justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-text-secondary border border-border-color hover:bg-bg-primary transition-colors">Cancel</button>
                        <button onClick={handleConfirm} className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/20 transition-all">Confirm Check-In</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
