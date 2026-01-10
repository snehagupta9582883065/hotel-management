'use client';

import { useState } from 'react';
import {
    Building2,
    Bed,
    Users,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Plus,
    Edit,
    Trash2,
    X
} from 'lucide-react';

export default function FloorManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFloor, setEditingFloor] = useState(null);
    const [formData, setFormData] = useState({
        floorNumber: '',
        floorName: '',
        description: '',
        totalRooms: ''
    });

    // State for floors data
    const [floors, setFloors] = useState([
        {
            id: 1,
            floorNumber: 'G',
            number: 'Ground Floor',
            totalRooms: 10,
            description: 'Main lobby and reception area',
            occupied: 8,
            vacant: 2,
            underMaintenance: 0,
            occupancy: 80
        },
        {
            id: 2,
            floorNumber: '1',
            number: 'First Floor',
            totalRooms: 12,
            description: 'Standard rooms',
            occupied: 9,
            vacant: 3,
            underMaintenance: 0,
            occupancy: 75
        },
        {
            id: 3,
            floorNumber: '2',
            number: 'Second Floor',
            totalRooms: 12,
            description: 'Deluxe rooms',
            occupied: 10,
            vacant: 2,
            underMaintenance: 0,
            occupancy: 83
        },
        {
            id: 4,
            floorNumber: '3',
            number: 'Third Floor',
            totalRooms: 8,
            description: 'Suite rooms',
            occupied: 6,
            vacant: 1,
            underMaintenance: 1,
            occupancy: 75
        }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFloor) {
            setFloors(floors.map(floor =>
                floor.id === editingFloor.id
                    ? {
                        ...floor,
                        floorNumber: formData.floorNumber,
                        number: formData.floorName,
                        description: formData.description,
                        totalRooms: parseInt(formData.totalRooms)
                    }
                    : floor
            ));
        } else {
            const newFloor = {
                id: floors.length + 1,
                floorNumber: formData.floorNumber,
                number: formData.floorName,
                description: formData.description,
                totalRooms: parseInt(formData.totalRooms),
                occupied: 0,
                vacant: parseInt(formData.totalRooms),
                underMaintenance: 0,
                occupancy: 0
            };
            setFloors([...floors, newFloor]);
        }
        handleCancel();
    };

    const handleEdit = (floor) => {
        setEditingFloor(floor);
        setFormData({
            floorNumber: floor.floorNumber,
            floorName: floor.number,
            description: floor.description,
            totalRooms: floor.totalRooms.toString()
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this floor?')) {
            setFloors(floors.filter(floor => floor.id !== id));
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingFloor(null);
        setFormData({
            floorNumber: '',
            floorName: '',
            description: '',
            totalRooms: ''
        });
    };

    // Calculate stats
    const stats = [
        {
            label: 'Total Floors',
            value: floors.length,
            icon: Building2,
            trend: null,
            color: 'from-blue-500 to-blue-700'
        },
        {
            label: 'Total Rooms',
            value: floors.reduce((sum, floor) => sum + floor.totalRooms, 0),
            icon: Bed,
            trend: null,
            color: 'from-purple-500 to-purple-700'
        },
        {
            label: 'Occupied Rooms',
            value: floors.reduce((sum, floor) => sum + floor.occupied, 0),
            icon: Users,
            trend: 12,
            color: 'from-green-500 to-green-700'
        },
        {
            label: 'Average Occupancy',
            value: `${Math.round(floors.reduce((sum, floor) => sum + floor.occupancy, 0) / floors.length)}%`,
            icon: TrendingUp,
            trend: 8.5,
            color: 'from-amber-500 to-amber-700'
        }
    ];

    // Filter floors
    const filteredFloors = floors.filter(floor => {
        const matchesSearch = floor.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            floor.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                        Floor Management
                    </h1>
                    <p className="text-text-secondary text-sm font-medium">Manage all floors and their details</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
                >
                    <Plus size={18} />
                    Add Floor
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white flex-shrink-0`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">{stat.label}</div>
                            <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                            {stat.trend && (
                                <div className="flex items-center gap-1 text-xs font-medium mt-1">
                                    {stat.trend > 0 ? (
                                        <>
                                            <TrendingUp size={12} className="text-green-500" />
                                            <span className="text-green-500">+{stat.trend}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown size={12} className="text-red-500" />
                                            <span className="text-red-500">{stat.trend}%</span>
                                        </>
                                    )}
                                    <span className="text-text-secondary">vs last month</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floor Overview */}
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">Floor Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {floors.map((floor) => (
                        <div key={floor.id} className="card p-6 hover:transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-text-primary">{floor.floorNumber}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{floor.number}</p>
                                </div>
                                <button
                                    onClick={() => handleEdit(floor)}
                                    className="w-8 h-8 rounded-lg border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 transition-all"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-text-secondary mb-4">{floor.description}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Total Rooms</span>
                                    <span className="font-semibold text-text-primary">{floor.totalRooms}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Occupied</span>
                                    <span className="font-semibold text-blue-500">{floor.occupied}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Vacant</span>
                                    <span className="font-semibold text-green-500">{floor.vacant}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Maintenance</span>
                                    <span className="font-semibold text-red-500">{floor.underMaintenance}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border-color">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-text-secondary uppercase">Occupancy</span>
                                    <span className="text-sm font-bold text-text-primary">{floor.occupancy}%</span>
                                </div>
                                <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
                                        style={{ width: `${floor.occupancy}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floor List Table */}
            <div className="card p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-primary">All Floors</h2>
                    <div className="flex items-center gap-3 bg-bg-primary px-4 py-2.5 rounded-xl border border-border-color focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all max-w-md">
                        <input
                            type="text"
                            placeholder="Search floors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-none bg-transparent outline-none w-full text-text-primary text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border-color">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-bg-primary border-b border-border-color">
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Floor</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Name</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Description</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Total Rooms</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Occupied</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Vacant</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Occupancy</th>
                                <th className="px-5 py-4 text-left font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFloors.map((floor) => (
                                <tr key={floor.id} className="border-b border-border-color hover:bg-purple-500/5 transition-colors">
                                    <td className="px-5 py-5 text-text-primary font-bold text-lg">{floor.floorNumber}</td>
                                    <td className="px-5 py-5 text-text-primary font-semibold">{floor.number}</td>
                                    <td className="px-5 py-5 text-text-secondary">{floor.description}</td>
                                    <td className="px-5 py-5 text-text-primary font-semibold">{floor.totalRooms}</td>
                                    <td className="px-5 py-5 text-blue-500 font-semibold">{floor.occupied}</td>
                                    <td className="px-5 py-5 text-green-500 font-semibold">{floor.vacant}</td>
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden max-w-[100px]">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                                    style={{ width: `${floor.occupancy}%` }}
                                                />
                                            </div>
                                            <span className="text-text-primary font-semibold text-sm min-w-[40px]">{floor.occupancy}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="flex gap-2">
                                            <button
                                                className="w-8 h-8 rounded-lg border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-purple-500 hover:text-purple-500 hover:bg-purple-500/5 hover:-translate-y-0.5 transition-all"
                                                title="Edit"
                                                onClick={() => handleEdit(floor)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="w-8 h-8 rounded-lg border border-red-500/30 bg-bg-primary text-red-500 flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 hover:-translate-y-0.5 transition-all"
                                                title="Delete"
                                                onClick={() => handleDelete(floor.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Floor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-bg-secondary rounded-2xl w-full max-w-2xl border border-border-color shadow-2xl">
                        <div className="bg-bg-secondary border-b border-border-color px-8 py-6 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary">{editingFloor ? 'Edit Floor' : 'Add New Floor'}</h2>
                                <p className="text-sm text-text-secondary mt-1">{editingFloor ? 'Update floor details' : 'Fill in the floor information'}</p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="w-10 h-10 rounded-xl border border-border-color bg-bg-primary text-text-secondary flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Floor Number</label>
                                    <input
                                        type="text"
                                        name="floorNumber"
                                        value={formData.floorNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="e.g., G, 1, 2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Floor Name</label>
                                    <input
                                        type="text"
                                        name="floorName"
                                        value={formData.floorName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="e.g., Ground Floor"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                                        placeholder="Brief description of the floor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Total Rooms</label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="e.g., 10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8 pt-6 border-t border-border-color">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-bg-primary border border-border-color rounded-xl text-text-secondary font-medium hover:bg-bg-secondary transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
                                >
                                    {editingFloor ? 'Update Floor' : 'Add Floor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
