"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, CalendarCheck,
  ArrowUpRight, LogIn, LogOut,
  Bed, FileText, Plus, TrendingDown,
  IndianRupee,
  Users2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// API CONSTANTS
const API_URL = "http://localhost:3000/api/dashboard"; // Replace with your actual API URL

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Components
const StatCard = ({ title, value, icon: Icon, trend, subtext, className = "" }) => (
  <motion.div
    variants={itemVariant}
    whileHover={{ y: -4 }}
    className={`bg-bg-secondary rounded-2xl p-4 md:p-6 border border-border-color hover:border-purple-500/30 hover:shadow-lg transition-all duration-300 ${className}`}
  >
    <div className="flex items-start justify-between gap-2 mb-4 md:mb-6">
      <div className="flex-1 min-w-0">
        <p className="text-text-secondary text-[11px] md:text-sm font-medium mb-1 md:mb-2 line-clamp-1">{title}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary truncate">{value}</h3>
      </div>

      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>

    <div className="min-h-[20px]">
      {trend ? (
        <div className="flex items-center gap-1.5 text-[11px] md:text-sm">
          <div className={`flex items-center gap-1 font-semibold ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
            {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
          <span className="text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">from last month</span>
        </div>
      ) : (
        <p className="text-[11px] md:text-sm text-text-secondary truncate">
          {subtext || 'Current total'}
        </p>
      )}
    </div>
  </motion.div>
);

const QuickLink = ({ icon: Icon, label, href }) => (
  <Link href={href} className="block w-full h-full">
    <motion.div
      variants={itemVariant}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-bg-secondary rounded-2xl p-6 border border-border-color hover:border-purple-500 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group h-full"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 flex items-center justify-center text-purple-600 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all">
        <Icon size={24} />
      </div>
      <span className="text-sm font-semibold text-text-primary text-center">{label}</span>
    </motion.div>
  </Link>
);

const RoomStatusCard = ({ room }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
          dot: 'bg-green-500'
        };
      case 'occupied':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
          dot: 'bg-purple-500'
        };
      case 'cleaning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
          dot: 'bg-yellow-500'
        };
      case 'maintenance':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800',
          dot: 'bg-gray-500'
        };
    }
  };

  const statusConfig = getStatusConfig(room.status);

  return (
    <motion.div
      variants={itemVariant}
      whileHover={{ y: -2 }}
      className="bg-bg-secondary rounded-xl border border-border-color p-5 hover:border-purple-500/30 hover:shadow-md transition-all duration-300"
    >
      {/* Room Number */}
      <div className="text-center mb-4">
        <h4 className="text-2xl font-bold text-text-primary">{room.room_number || room.id}</h4>
        <p className="text-xs text-text-secondary mt-1">{room.room_type || room.type}</p>
      </div>

      {/* Guest Info */}
      <div className="mb-4 min-h-[20px] text-center">
        {room.current_guest ? (
          <div className="flex items-center justify-center gap-1.5">
            <Users size={14} className="text-text-secondary" />
            <span className="text-sm text-text-primary truncate max-w-[120px]">{room.current_guest.name}</span>
          </div>
        ) : (
          <span className="text-xs text-text-secondary/50">—</span>
        )}
      </div>

      {/* Status Badge */}
      <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
        <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
        <span className={`text-xs font-semibold uppercase ${statusConfig.text}`}>
          {room.status}
        </span>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize data - simulates fetching from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real scenario, uncomment the line below:
        // const response = await fetch(API_URL);
        // const result = await response.json();

        // Simulating API response with the mock structure we defined
        const mockResponse = {
          "status": "success",
          "data": {
            "kpi_stats": {
              "today_revenue": {
                "value": 6800,
                "currency": "USD",
                "trend_percentage": 8.5,
                "trend_direction": "up"
              },
              "occupied_rooms": {
                "value": 32,
                "total": 50,
                "percentage": 64,
                "trend_percentage": 12.0,
                "trend_direction": "up"
              },
              "total_rooms": {
                "value": 50
              },
              "available_rooms": {
                "value": 15
              },
              "check_ins": {
                "today_total": 5,
                "pending": 2,
                "completed": 3
              },
              "check_outs": {
                "today_total": 3,
                "pending": 1,
                "completed": 2
              }
            },
            "revenue_chart_data": [
              { "date": "Jan 3", "revenue": 4000, "bookings_count": 24 },
              { "date": "Jan 4", "revenue": 5000, "bookings_count": 28 },
              { "date": "Jan 5", "revenue": 4500, "bookings_count": 25 },
              { "date": "Jan 6", "revenue": 6000, "bookings_count": 35 },
              { "date": "Jan 7", "revenue": 5500, "bookings_count": 30 },
              { "date": "Jan 8", "revenue": 7000, "bookings_count": 42 },
              { "date": "Jan 9", "revenue": 6500, "bookings_count": 38 }
            ],
            "room_status_overview": [
              { "room_id": 101, "room_number": "101", "room_type": "Standard", "status": "occupied", "current_guest": { "guest_id": "G001", "name": "John Doe" } },
              { "room_id": 102, "room_number": "102", "room_type": "Standard", "status": "available", "current_guest": null },
              { "room_id": 103, "room_number": "103", "room_type": "Deluxe", "status": "occupied", "current_guest": { "guest_id": "G002", "name": "Jane Smith" } },
              { "room_id": 104, "room_number": "104", "room_type": "Standard", "status": "cleaning", "current_guest": null },
              { "room_id": 201, "room_number": "201", "room_type": "Suite", "status": "occupied", "current_guest": { "guest_id": "G003", "name": "Bob Wilson" } },
              { "room_id": 202, "room_number": "202", "room_type": "Suite", "status": "available", "current_guest": null },
              { "room_id": 203, "room_number": "203", "room_type": "Deluxe", "status": "maintenance", "current_guest": null },
              { "room_id": 204, "room_number": "204", "room_type": "Standard", "status": "available", "current_guest": null }
            ],
            "occupancy_breakdown": {
              "available": 15,
              "occupied": 32,
              "cleaning": 2,
              "maintenance": 1
            }
          }
        };

        // Simulate network delay
        setTimeout(() => {
          setData(mockResponse.data);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!data) return null;

  const { kpi_stats, revenue_chart_data, room_status_overview, occupancy_breakdown } = data;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariant}
      className="flex flex-col gap-6 md:gap-8 pb-10"
    >
      {/* Top Stats Row - Bento Grid Layout */}
      <motion.div variants={containerVariant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1: Key Metrics (Tall/Wide) */}
        <StatCard
          title="Today's Revenue"
          value={`₹${kpi_stats.today_revenue.value.toLocaleString()}`}
          icon={IndianRupee}
          trend={kpi_stats.today_revenue.trend_percentage}
          className="md:col-span-2"
        />
        <StatCard
          title="Occupied Rooms"
          value={kpi_stats.occupied_rooms.value}
          icon={Users}
          trend={kpi_stats.occupied_rooms.trend_percentage}
          subtext={`${kpi_stats.occupied_rooms.value}/${kpi_stats.occupied_rooms.total}`}
          className="md:col-span-2"
        />

        {/* Row 2: Secondary Metrics (Square) */}
        <StatCard title="Total Rooms" value={kpi_stats.total_rooms.value} icon={Bed} subtext="Across all floors" />
        <StatCard title="Available Rooms" value={kpi_stats.available_rooms.value} icon={Bed} subtext="Ready for booking" />
        <StatCard title="Today's Check-ins" value={kpi_stats.check_ins.today_total} icon={LogIn} subtext={`${kpi_stats.check_ins.pending} pending`} />
        <StatCard title="Today's Check-outs" value={kpi_stats.check_outs.today_total} icon={LogOut} subtext={`${kpi_stats.check_outs.pending} pending`} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariant}
          className="lg:col-span-2 bg-bg-secondary rounded-2xl p-6 border border-border-color"
        >
          <div className="mb-4 md:mb-6">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-text-primary">
              <TrendingUp size={18} className="text-purple-600" />
              Revenue Overview
            </h3>
          </div>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue_chart_data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="bookings_count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Occupancy Overview */}
        <motion.div
          variants={itemVariant}
          className="bg-bg-secondary rounded-2xl p-6 border border-border-color"
        >
          <div className="mb-4 md:mb-6">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-text-primary">
              <CalendarCheck size={18} className="text-purple-600" />
              Occupancy Overview
            </h3>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-text-secondary">Occupancy Rate</span>
              <span className="text-text-primary font-bold">{kpi_stats.occupied_rooms.percentage}%</span>
            </div>
            <div className="w-full h-3 bg-bg-primary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${kpi_stats.occupied_rooms.percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-lg shadow-purple-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <span className="text-xs font-medium text-text-secondary block mb-1">Available</span>
              <span className="text-2xl font-bold text-green-600">{occupancy_breakdown.available}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-medium text-text-secondary block mb-1">Occupied</span>
              <span className="text-2xl font-bold text-blue-500">{occupancy_breakdown.occupied}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <span className="text-xs font-medium text-text-secondary block mb-1">Cleaning</span>
              <span className="text-2xl font-bold text-yellow-600">{occupancy_breakdown.cleaning}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <span className="text-xs font-medium text-text-secondary block mb-1">Maintenance</span>
              <span className="text-2xl font-bold text-red-500">{occupancy_breakdown.maintenance}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div variants={containerVariant}>
        <h3 className="text-lg md:text-xl font-bold text-text-primary mb-3 md:mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
          <QuickLink icon={Plus} label="Booking List" href="/booking-list" />
          <QuickLink icon={LogIn} label="Check In" href="/room-management" />
          <QuickLink icon={LogOut} label="Check Out" href="/room-management" />
          <QuickLink icon={Bed} label="Rooms" href="/room-management" />
          <QuickLink icon={Users} label="Guests" href="/guest-list" />
          <QuickLink icon={FileText} label="Reports" href="/reports" />
          <QuickLink icon={Users2} label="Staff" href="/staff-list" />
        </div>
      </motion.div>

      {/* Room Status Overview */}
      <motion.div variants={containerVariant} className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 className="text-lg md:text-xl font-bold text-text-primary">Room Status Overview</h3>
          <Link href="/room-management" className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
            View All Rooms <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {room_status_overview.map((room) => (
            <RoomStatusCard key={room.room_id} room={room} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
