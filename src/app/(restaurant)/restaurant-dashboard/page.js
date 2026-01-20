"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Users, Clock, IndianRupee,
    ShoppingBag, Activity, Utensils, MapPin
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const revenueData = [
    { name: 'Jan 6', revenue: 1200 },
    { name: 'Jan 7', revenue: 1500 },
    { name: 'Jan 8', revenue: 1800 },
    { name: 'Jan 9', revenue: 1600 },
    { name: 'Jan 10', revenue: 2500 },
    { name: 'Jan 11', revenue: 3200 },
    { name: 'Jan 12', revenue: 2800 },
];

const orders = [
    { id: 'R001', location: 'Table 5', items: 'Pasta, Wine', time: '12:30 PM', amount: '₹45', status: 'Completed' },
    { id: 'R002', location: 'Room 205', items: 'Breakfast Set', time: '1:15 PM', amount: '₹28', status: 'Preparing' },
    { id: 'R003', location: 'Table 8', items: 'Steak, Salad', time: '1:45 PM', amount: '₹68', status: 'Served' },
    { id: 'R004', location: 'Room 103', items: 'Club Sandwich', time: '2:00 PM', amount: '₹18', status: 'Delivered' },
    { id: 'R005', location: 'Table 3', items: 'Pizza, Drinks', time: '2:20 PM', amount: '₹35', status: 'Preparing' },
];

const topItems = [
    { name: 'Steak', count: '8 orders' },
    { name: 'Pasta', count: '6 orders' },
    { name: 'Pizza', count: '5 orders' },
    { name: 'Wine', count: '4 orders' },
];

const distribution = [
    { type: 'Dine-In', percentage: '60%' },
    { type: 'Room Service', percentage: '30%' },
    { type: 'Takeaway', percentage: '10%' },
];

const peakHours = [
    { time: 'Lunch (12-2 PM)', percentage: '45%' },
    { time: 'Dinner (7-9 PM)', percentage: '40%' },
    { time: 'Others', percentage: '15%' },
];

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
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <motion.div
        variants={itemVariant}
        whileHover={{ y: -2 }}
        className="bg-bg-secondary rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
    >
        <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} bg-opacity-10`}>
                <Icon size={26} className={colorClass.replace('bg-', 'text-').replace('bg-opacity-10', '')} />
            </div>
            <div>
                <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-text-primary tracking-tight">{value}</h3>
            </div>
        </div>
    </motion.div>
);

const SectionTitle = ({ title }) => (
    <h3 className="text-lg font-bold text-text-primary mb-4">{title}</h3>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-bg-secondary/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-xl">
                <p className="text-text-secondary text-xs mb-1 font-medium">{label}</p>
                <p className="text-lg font-bold text-purple-600">
                    ₹{payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function RestaurantDashboard() {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariant}
            className="flex flex-col gap-6 md:gap-8 pb-10"
        >
            {/* Top Stats Row */}
            <motion.div variants={containerVariant} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Today's Revenue" value="₹2,100" icon={IndianRupee} colorClass="bg-green-500 text-green-500" />
                <StatCard title="Total Orders" value="5" icon={ShoppingBag} colorClass="bg-blue-500 text-blue-500" />
                <StatCard title="Active Orders" value="3" icon={Clock} colorClass="bg-orange-500 text-orange-500" />
                <StatCard title="Avg Order Value" value="₹420" icon={Activity} colorClass="bg-purple-500 text-purple-500" />
            </motion.div>

            {/* 7-Day Revenue Trend */}
            <motion.div
                variants={itemVariant}
                className="bg-bg-secondary rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden"
            >
                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <SectionTitle title="7-Day Revenue Trend" />
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenuePremium" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} horizontal={true} strokeOpacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="var(--text-secondary)"
                                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--purple-500)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8b5cf6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorRevenuePremium)"
                                activeDot={{ r: 8, strokeWidth: 4, stroke: 'var(--bg-secondary)', fill: '#8b5cf6' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Today's Orders Table */}
            <motion.div
                variants={itemVariant}
                className="bg-bg-secondary rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <SectionTitle title="Today's Orders" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wider text-text-secondary border-b border-gray-100 dark:border-white/5">
                                <th className="pb-4 pl-4 font-semibold text-xs">Order No.</th>
                                <th className="pb-4 font-semibold text-xs">Table/Room</th>
                                <th className="pb-4 font-semibold text-xs">Items</th>
                                <th className="pb-4 font-semibold text-xs">Time</th>
                                <th className="pb-4 font-semibold text-xs">Amount</th>
                                <th className="pb-4 font-semibold text-xs pr-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {orders.map((order) => (
                                <motion.tr
                                    key={order.id}
                                    whileHover={{ backgroundColor: 'rgba(var(--text-primary-rgb), 0.02)' }}
                                    className="group transition-colors border-b border-gray-50 dark:border-white/5 last:border-none"
                                >
                                    <td className="py-5 pl-4 font-semibold text-text-primary tabular-nums">{order.id}</td>
                                    <td className="py-5 text-text-secondary">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-bg-primary dark:bg-slate-800 flex items-center justify-center text-text-secondary/70">
                                                <MapPin size={12} />
                                            </div>
                                            {order.location}
                                        </div>
                                    </td>
                                    <td className="py-5 text-text-secondary font-medium">{order.items}</td>
                                    <td className="py-5 text-text-secondary tabular-nums">{order.time}</td>
                                    <td className="py-5 font-bold text-text-primary tabular-nums">{order.amount}</td>
                                    <td className="py-5 pr-4 text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ring-1 ring-inset
                      ${order.status === 'Completed' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/20' :
                                                order.status === 'preparing' || order.status === 'Preparing' ? 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-500/20' :
                                                    order.status === 'Served' ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-500/20' :
                                                        'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-500/20'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Bottom Insights Row */}
            <motion.div variants={containerVariant} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Top Menu Items */}
                <motion.div variants={itemVariant} className="bg-bg-secondary rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
                    <SectionTitle title="Top Menu Items Today" />
                    <div className="flex flex-col gap-3">
                        {topItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-xl bg-bg-primary/30 dark:bg-slate-800/30 hover:bg-bg-primary/60 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/5">
                                <span className="text-text-primary font-semibold">{item.name}</span>
                                <span className="text-text-secondary bg-bg-secondary dark:bg-slate-900/50 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-100 dark:border-white/5 shadow-sm">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Order Distribution */}
                <motion.div variants={itemVariant} className="bg-bg-secondary rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                    <SectionTitle title="Order Distribution" />
                    <div className="flex flex-col gap-3">
                        {distribution.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-xl bg-bg-primary/30 dark:bg-slate-800/30 hover:bg-bg-primary/60 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/5">
                                <span className="text-text-primary font-semibold">{item.type}</span>
                                <span className="text-text-secondary bg-bg-secondary px-2.5 py-1 rounded-lg text-xs font-medium border border-border-color/50 shadow-sm">{item.percentage}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Peak Hours */}
                <motion.div variants={itemVariant} className="bg-bg-secondary rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                    <SectionTitle title="Peak Hours" />
                    <div className="flex flex-col gap-3">
                        {peakHours.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-xl bg-bg-primary/30 dark:bg-slate-800/30 hover:bg-bg-primary/60 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/5">
                                <span className="text-text-primary font-semibold">{item.time}</span>
                                <span className="text-text-secondary bg-bg-secondary px-2.5 py-1 rounded-lg text-xs font-medium border border-border-color/50 shadow-sm">{item.percentage}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </motion.div>
        </motion.div>
    );
}
