'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ChevronDown,
    X
} from 'lucide-react';

export default function RoomManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: '',
        floor: '',
        maxOccupancy: '',
        basePrice: '',
        status: 'Available',
        amenities: []
    });

    // State for rooms data
    const [rooms, setRooms] = useState([
        {
            id: 1,
            roomNumber: '101',
            type: 'Standard',
            floor: 1,
            maxOccupancy: 2,
            basePrice: 150,
            status: 'Available',
            amenities: ['AC', 'WiFi', '+1']
        },
        {
            id: 2,
            roomNumber: '102',
            type: 'Standard',
            floor: 1,
            maxOccupancy: 2,
            basePrice: 150,
            status: 'Occupied',
            amenities: ['AC', 'WiFi', '+1']
        },
        {
            id: 3,
            roomNumber: '103',
            type: 'Deluxe',
            floor: 1,
            maxOccupancy: 3,
            basePrice: 250,
            status: 'Available',
            amenities: ['AC', 'WiFi', '+2']
        },
        {
            id: 4,
            roomNumber: '201',
            type: 'Suite',
            floor: 2,
            maxOccupancy: 4,
            basePrice: 450,
            status: 'Occupied',
            amenities: ['AC', 'WiFi', '+3']
        },
        {
            id: 5,
            roomNumber: '202',
            type: 'Deluxe',
            floor: 2,
            maxOccupancy: 3,
            basePrice: 250,
            status: 'Cleaning',
            amenities: ['AC', 'WiFi', '+2']
        }
    ]);

    const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Penthouse'];
    const statusOptions = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    const amenitiesList = ['AC', 'WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchen', 'Safe'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRoom) {
            setRooms(rooms.map(room =>
                room.id === editingRoom.id
                    ? { ...room, ...formData, roomNumber: formData.roomNumber, type: formData.roomType }
                    : room
            ));
        } else {
            const newRoom = {
                id: rooms.length + 1,
                roomNumber: formData.roomNumber,
                type: formData.roomType,
                floor: parseInt(formData.floor),
                maxOccupancy: parseInt(formData.maxOccupancy),
                basePrice: parseInt(formData.basePrice),
                status: formData.status,
                amenities: formData.amenities
            };
            setRooms([...rooms, newRoom]);
        }
        handleCancel();
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            roomNumber: room.roomNumber,
            roomType: room.type,
            floor: room.floor.toString(),
            maxOccupancy: room.maxOccupancy.toString(),
            basePrice: room.basePrice.toString(),
            status: room.status,
            amenities: room.amenities
        });
        setIsModalOpen(true);
    };

    const handleViewDetails = (room) => {
        setSelectedRoom(room);
        setIsDetailsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(room => room.id !== id));
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
        setFormData({
            roomNumber: '',
            roomType: '',
            floor: '',
            maxOccupancy: '',
            basePrice: '',
            status: 'Available',
            amenities: []
        });
    };

    const clearFilters = () => {
        setFilterType('all');
        setFilterStatus('all');
    };

    const activeFiltersCount = (filterType !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

    // Filter rooms
    const filteredRooms = rooms.filter(room => {
        const matchesSearch =
            room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || room.type === filterType;
        const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

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
            case 'Available': return 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'Occupied': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'Cleaning': return 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
            case 'Maintenance': return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            default: return '';
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                        Room Management
                    </h1>
                    <p className="text-text-secondary text-sm font-medium">Manage all rooms and their details</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
                >
                    <Plus size={18} />
                    Add Room
                </button>
            </div>

            {/* Room List Section */}
            <div className="card p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between gap-3 w-full">
                        <div className="flex items-center gap-3 bg-bg-primary px-4 py-2.5 rounded-xl border border-border-color focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all flex-1 max-w-lg">
                            <Search size={18} className="text-text-secondary flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by room number or type..."
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
                                <span>Filter</span>
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
                                        <label className="block text-xs font-bold text-text-primary mb-2.5 uppercase tracking-wider">Room Type</label>
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="w-full px-3.5 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm font-medium cursor-pointer transition-all outline-none hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                        >
                                            <option value="all">All Types</option>
                                            {roomTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => handleViewDetails(room)}
                            className="group flex flex-col bg-bg-primary border border-border-color rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
                        >
                            {/* Card Header */}
                            <div className="p-5 border-b border-border-color bg-gradient-to-br from-bg-primary to-bg-secondary group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1 block">
                                            {room.type}
                                        </span>
                                        <h3 className="text-xl font-bold text-text-primary">
                                            Room {room.roomNumber}
                                        </h3>
                                    </div>
                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-tighter ${getStatusClass(room.status)}`}>
                                        {room.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        Floor {room.floor}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Up to {room.maxOccupancy} Guests
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col gap-5">
                                <div>
                                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 block">Available Amenities</label>
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map((amenity, idx) => (
                                            <span key={idx} className="px-2.5 py-1 bg-bg-secondary text-text-primary border border-border-color text-[10px] rounded-lg font-bold group-hover:border-purple-500/30 transition-colors">
                                                {amenity}
                                            </span>
                                        ))}
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
                                        <button
                                            className="w-9 h-9 rounded-xl border border-border-color bg-bg-secondary text-text-secondary flex items-center justify-center cursor-pointer hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 hover:-translate-y-1 transition-all duration-300"
                                            title="Edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(room);
                                            }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="w-9 h-9 rounded-xl border border-red-500/20 bg-bg-secondary text-red-500 flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-500/10 hover:-translate-y-1 transition-all duration-300"
                                            title="Delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(room.id);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Room Modal */}
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
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                                        placeholder="e.g., 101"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Room Type</label>
                                    <select
                                        name="roomType"
                                        value={formData.roomType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm cursor-pointer"
                                    >
                                        <option value="">Select Type</option>
                                        {roomTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Floor</label>
                                    <input
                                        type="number"
                                        name="floor"
                                        value={formData.floor}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                                        placeholder="e.g., 1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Max Occupancy</label>
                                    <input
                                        type="number"
                                        name="maxOccupancy"
                                        value={formData.maxOccupancy}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                                        placeholder="e.g., 2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Base Price ($)</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm"
                                        placeholder="e.g., 150"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary outline-none focus:border-purple-500 transition-all text-sm cursor-pointer"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-xs font-semibold text-text-primary mb-2">Amenities</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {amenitiesList.map(amenity => (
                                        <label
                                            key={amenity}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${formData.amenities.includes(amenity)
                                                ? 'bg-purple-50 border-purple-500 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                                : 'bg-bg-primary border-border-color text-text-secondary hover:border-purple-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={() => handleAmenityToggle(amenity)}
                                                className="w-3.5 h-3.5 accent-purple-600"
                                            />
                                            <span className="text-xs font-medium">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-border-color">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-text-secondary font-medium hover:bg-bg-secondary transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5"
                                >
                                    {editingRoom ? 'Update Room' : 'Add Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Room Details Popup */}
            {isDetailsModalOpen && selectedRoom && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-bg-secondary rounded-2xl w-full max-w-lg border border-border-color shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="sticky top-0 bg-bg-secondary border-b border-border-color px-8 py-5 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Room Details</h2>
                                <p className="text-xs text-text-secondary mt-0.5">Viewing {selectedRoom.type} #{selectedRoom.roomNumber}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="w-10 h-10 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Status</label>
                                    <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-tight ${getStatusClass(selectedRoom.status)}`}>
                                        {selectedRoom.status}
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Price per Night</label>
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400">${selectedRoom.basePrice}</span>
                                        <span className="text-xs font-medium text-text-secondary">USD</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-bg-primary p-4 rounded-xl border border-border-color flex flex-col items-center">
                                    <span className="text-text-secondary text-[10px] font-bold uppercase mb-1">Floor</span>
                                    <span className="text-lg font-bold text-text-primary">{selectedRoom.floor}</span>
                                </div>
                                <div className="bg-bg-primary p-4 rounded-xl border border-border-color flex flex-col items-center">
                                    <span className="text-text-secondary text-[10px] font-bold uppercase mb-1">Occupancy</span>
                                    <span className="text-lg font-bold text-text-primary">{selectedRoom.maxOccupancy} Persons</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 block">Amenities</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRoom.amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-border-color">
                                <button
                                    onClick={() => {
                                        setIsDetailsModalOpen(false);
                                        handleEdit(selectedRoom);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5"
                                >
                                    <Edit size={18} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-bg-primary border border-border-color text-text-secondary rounded-xl font-bold hover:bg-bg-secondary transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
