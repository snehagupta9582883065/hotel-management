"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function SubscriptionPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="card max-w-4xl mx-auto min-h-[400px] flex flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Subscription
        </h1>
        <p className="text-secondary text-lg">
          This module is currently under development.
        </p>
      </div>
    </motion.div>
  );
}
