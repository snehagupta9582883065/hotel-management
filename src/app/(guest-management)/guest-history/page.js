"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function GuestHistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="card max-w-4xl mx-auto min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-3xl">
        <h1 className="text-3xl font-black mb-4 title-gradient">
          Guest History
        </h1>
        <p className="text-secondary text-lg font-bold">
          This module is currently under development.
        </p>
      </div>
    </motion.div>
  );
}
