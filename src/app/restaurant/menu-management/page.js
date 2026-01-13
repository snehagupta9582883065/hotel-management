"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, Edit3, Trash2, CheckCircle2, XCircle,
    ChevronDown, X, MoreVertical, LayoutGrid, Tag, DollarSign, Percent,
    UtensilsCrossed, ChefHat
} from 'lucide-react';

// Initial Mock Data
const initialCategories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage'];
const initialMenuItems = [
    { id: 1, name: 'Grilled Steak', description: 'Premium beef steak with garlic butter', price: 28, taxRate: 5, category: 'Main Course', available: true },
    { id: 2, name: 'Margherita Pizza', description: 'Classic Italian pizza with fresh basil', price: 18, taxRate: 5, category: 'Main Course', available: true },
    { id: 3, name: 'Caesar Salad', description: 'Crisp romaine with parmesan & croutons', price: 12, taxRate: 5, category: 'Appetizer', available: true },
    { id: 4, name: 'Chocolate Lava Cake', description: 'Warm molten center with vanilla bean ice cream', price: 8, taxRate: 5, category: 'Dessert', available: false },
    { id: 5, name: 'Fresh Orange Juice', description: 'Cold pressed organic oranges', price: 5, taxRate: 12, category: 'Beverage', available: true },
];

export default function MenuManagement() {
    const [menuItems, setMenuItems] = useState(initialMenuItems);
    const [categories, setCategories] = useState(initialCategories);

    // Modal States
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Form States
    const [newItem, setNewItem] = useState({
        name: '', category: '', price: '', taxRate: '', description: '', available: true
    });
    const [newCategory, setNewCategory] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // Handlers
    const handleAddItem = (e) => {
        e.preventDefault();
        const itemData = {
            ...newItem,
            price: Number(newItem.price),
            taxRate: Number(newItem.taxRate)
        };

        if (editingItem) {
            setMenuItems(menuItems.map(item =>
                item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
            ));
        } else {
            setMenuItems([...menuItems, { id: Date.now(), ...itemData }]);
        }
        closeItemModal();
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setNewItem({
            name: item.name,
            category: item.category,
            price: item.price,
            taxRate: item.taxRate,
            description: item.description,
            available: item.available
        });
        setIsItemModalOpen(true);
    };

    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setEditingItem(null);
        setNewItem({ name: '', category: '', price: '', taxRate: '', description: '', available: true });
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setIsCategoryModalOpen(false);
            setNewCategory('');
        }
    };


    const handleDeleteItem = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setMenuItems(menuItems.filter(item => item.id !== id));
        }
    };

    const toggleAvailability = (id) => {
        setMenuItems(menuItems.map(item =>
            item.id === id ? { ...item, available: !item.available } : item
        ));
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Menu Management
                    </h1>
                    <p className="text-text-secondary mt-2 text-sm font-medium">
                        Curate your culinary offerings with precision
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <Tag size={18} className="text-violet-500" />
                        <span>Add Category</span>
                    </button>

                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setNewItem({ name: '', category: '', price: '', taxRate: '', description: '', available: true });
                            setIsItemModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Add Item</span>
                    </button>
                </div>
            </div>

            {/* Menu Content */}
            <div className="space-y-8">
                {categories.map(category => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden"
                    >
                        {/* Category Header */}
                        <div className="px-8 py-5 border-b border-gray-100/50 dark:border-white/5 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-violet-100/50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                                    <UtensilsCrossed size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary tracking-tight">{category}</h3>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/5 text-text-secondary">
                                {menuItems.filter(i => i.category === category).length} items
                            </span>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100/50 dark:border-white/5 text-xs font-semibold uppercase tracking-wider text-text-secondary/70">
                                        <th className="px-8 py-5">Item Details</th>
                                        <th className="px-8 py-5">Price</th>
                                        <th className="px-8 py-5">Tax</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {menuItems.filter(item => item.category === category).map(item => (
                                        <tr
                                            key={item.id}
                                            className="group border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors duration-200"
                                        >
                                            <td className="px-8 py-5">
                                                <div>
                                                    <p className="font-bold text-text-primary text-base mb-1 group-hover:text-violet-600 transition-colors">{item.name}</p>
                                                    <p className="text-text-secondary text-xs max-w-md line-clamp-1">{item.description}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-bold text-text-primary bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                                                    ${item.price}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-text-secondary font-medium">{item.taxRate}%</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => toggleAvailability(item.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all duration-300 flex items-center gap-1.5 w-fit
                                                        ${item.available
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-900/20 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                                            : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }
                                                    `}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                    {item.available ? 'Active' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditItem(item)}
                                                        className="p-2 text-text-secondary hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {menuItems.filter(item => item.category === category).length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-10 text-center">
                                                <div className="flex flex-col items-center gap-3 text-text-secondary/50">
                                                    <ChefHat size={32} />
                                                    <p className="text-sm font-medium">No items yet. Add something delicious!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div >
                ))
                }
            </div >

            {/* Add Item Modal */}
            < AnimatePresence >
                {isItemModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsItemModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
                                <div>
                                    <h3 className="text-base font-bold text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">New Menu Item</h3>
                                    <p className="text-[10px] text-text-secondary mt-0.5 font-medium">Add a new dish to your menu</p>
                                </div>
                                <button onClick={() => setIsItemModalOpen(false)} className="text-text-secondary hover:text-text-primary p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleAddItem} className="p-4 space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Item Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-text-secondary/30"
                                        placeholder="E.g., Truffle Pasta"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Category</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                            className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs appearance-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Price ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                required
                                                value={newItem.price}
                                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                                className="w-full pl-6 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Tax Rate (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                required
                                                value={newItem.taxRate}
                                                onChange={(e) => setNewItem({ ...newItem, taxRate: e.target.value })}
                                                className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all"
                                                placeholder="5"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea
                                        rows="2"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all resize-none placeholder:text-text-secondary/30"
                                        placeholder="Describe the dish..."
                                    />
                                </div>

                                <div
                                    className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer ${newItem.available ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' : 'bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10'}`}
                                    onClick={() => setNewItem({ ...newItem, available: !newItem.available })}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${newItem.available ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'}`}>
                                        {newItem.available && <CheckCircle2 size={10} className="text-white" />}
                                    </div>
                                    <span className={`text-xs font-medium ${newItem.available ? 'text-emerald-700 dark:text-emerald-400' : 'text-text-secondary'}`}>
                                        Available for ordering
                                    </span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeItemModal}
                                        className="flex-1 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold text-text-secondary hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {editingItem ? 'Update Item' : 'Add to Menu'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Add Category Modal */}
            < AnimatePresence >
                {isCategoryModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsCategoryModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
                                <h3 className="text-lg font-bold text-text-primary">Add Category</h3>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleAddCategory} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all"
                                        placeholder="e.g., Seafood"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Create Category
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
}
