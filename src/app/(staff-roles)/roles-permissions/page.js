"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Plus,
  Trash2,
  ChevronRight,
  Save,
  AlertCircle,
  Users,
  LayoutDashboard,
  ShoppingBag,
  FileText,
  CreditCard,
  Settings,
  UserCog
} from 'lucide-react';

// Mock Roles Data
const INITIAL_ROLES = [
  { id: 'role-1', name: 'Administrator', description: 'Full access to all system features', users: 3, isSystem: true },
  { id: 'role-2', name: 'General Manager', description: 'Manage hotel operations and staff', users: 1, isSystem: false },
  { id: 'role-3', name: 'Front Desk', description: 'Check-in/out and guest management', users: 4, isSystem: false },
  { id: 'role-4', name: 'Kitchen Staff', description: 'Order viewing and status updates', users: 8, isSystem: false },
  { id: 'role-5', name: 'Housekeeping', description: 'Room status and cleaning tasks', users: 6, isSystem: false },
  { id: 'role-6', name: 'Accountant', description: 'Financial records and reports', users: 2, isSystem: false },
];

// Modules and Permissions Structure
const MODULES = [
  { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'orders', name: 'Order Management', icon: <ShoppingBag size={18} /> },
  { id: 'guests', name: 'Guest Management', icon: <Users size={18} /> },
  { id: 'invoices', name: 'Invoices & Receipts', icon: <FileText size={18} /> },
  { id: 'payments', name: 'Payment Processing', icon: <CreditCard size={18} /> },
  { id: 'staff', name: 'Staff Management', icon: <UserCog size={18} /> },
  { id: 'settings', name: 'System Settings', icon: <Settings size={18} /> },
];

const PERMISSIONS = ['read', 'write', 'create', 'delete'];

// Generate Initial Permissions (Mock)
const generateMockPermissions = () => {
  const permissions = {};
  INITIAL_ROLES.forEach(role => {
    permissions[role.id] = {};
    MODULES.forEach(module => {
      permissions[role.id][module.id] = {
        read: role.name === 'Administrator' || role.name === 'General Manager',
        write: role.name === 'Administrator',
        create: role.name === 'Administrator',
        delete: role.name === 'Administrator'
      };
      // Custom tweaks for demo
      if (role.name === 'Front Desk' && (module.id === 'guests' || module.id === 'invoices')) {
        permissions[role.id][module.id] = { read: true, write: true, create: true, delete: false };
      }
      if (role.name === 'Kitchen Staff' && module.id === 'orders') {
        permissions[role.id][module.id] = { read: true, write: true, create: false, delete: false };
      }
    });
  });
  return permissions;
};

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState(INITIAL_ROLES[0].id);
  const [permissions, setPermissions] = useState(generateMockPermissions());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  // Handlers
  const handlePermissionToggle = (moduleId, type) => {
    if (selectedRole.isSystem && selectedRole.name === 'Administrator') return; // Admin is immutable

    setPermissions(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        [moduleId]: {
          ...prev[selectedRoleId][moduleId],
          [type]: !prev[selectedRoleId][moduleId][type]
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleModuleToggleAll = (moduleId) => {
    if (selectedRole.isSystem && selectedRole.name === 'Administrator') return;

    const currentModulePerms = permissions[selectedRoleId][moduleId];
    const allTrue = Object.values(currentModulePerms).every(v => v);

    setPermissions(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        [moduleId]: {
          read: !allTrue, write: !allTrue, create: !allTrue, delete: !allTrue
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newId = `role-${Date.now()}`;
    const newRole = {
      id: newId,
      name: newRoleName,
      description: 'Custom User Role',
      users: 0,
      isSystem: false
    };

    setRoles([...roles, newRole]);
    // Init permissions for new role (default none)
    setPermissions(prev => ({
      ...prev,
      [newId]: MODULES.reduce((acc, mod) => ({
        ...acc,
        [mod.id]: { read: false, write: false, create: false, delete: false }
      }), {})
    }));

    setSelectedRoleId(newId);
    setIsAddModalOpen(false);
    setNewRoleName('');
  };

  const handleDeleteRole = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(prev => prev.filter(r => r.id !== id));
      if (selectedRoleId === id) setSelectedRoleId(roles[0].id);
    }
  };

  const handleSave = () => {
    // Mock API call
    setTimeout(() => {
      setHasUnsavedChanges(false);
      alert('Permissions saved successfully!');
    }, 500);
  };

  // Standard Utility Classes
  const inputStyle = "w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-[var(--text-primary)] transition-all";
  const btnPrimary = "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all";
  const btnDisabled = "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-not-allowed shadow-none border border-[var(--border-color)]";
  const btnSecondary = "px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--border-color)] transition-colors";

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)] pb-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-purple-600">Roles & Permissions</h1>
          <p className="text-sm text-[var(--text-secondary)]">Define access levels and security policies</p>
        </div>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-warning bg-warning/10 px-4 py-2 rounded-xl text-sm font-medium border border-warning/20"
            >
              <AlertCircle size={16} />
              <span>Unsaved Changes</span>
            </motion.div>
          )}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={hasUnsavedChanges ? btnPrimary : btnDisabled}
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">

        {/* Sidebar: Roles List */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 h-full">
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]/50">
              <h2 className="font-bold text-[var(--text-primary)]">System Roles</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg border border-[var(--border-color)] transition-colors shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-3 space-y-2 flex-1 custom-scrollbar">
              {roles.map(role => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`group relative p-3 rounded-xl border cursor-pointer transition-all ${selectedRoleId === role.id
                    ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 shadow-sm'
                    : 'bg-[var(--bg-secondary)] border-transparent hover:bg-[var(--bg-primary)]'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-bold text-sm ${selectedRoleId === role.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                        {role.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">{role.description}</p>
                    </div>
                    {selectedRoleId === role.id && (
                      <ChevronRight size={16} className="text-[var(--accent-primary)]" />
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-primary)] px-2 py-0.5 rounded-md">
                      <Users size={10} />
                      {role.users} Users
                    </div>
                    {!role.isSystem && (
                      <button
                        onClick={(e) => handleDeleteRole(role.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col overflow-hidden h-full">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/30 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{selectedRole?.name} Permissions</h2>
                {selectedRole?.isSystem && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2 py-0.5 rounded-full border border-[var(--accent-primary)]/20">
                    <Shield size={10} /> System Managed
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Manage what this role can access and modify</p>
            </div>
          </div>

          {/* Matrix Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] sticky top-0 z-10">
            <div className="col-span-4">Module</div>
            <div className="col-span-2 text-center">Read</div>
            <div className="col-span-2 text-center">Write</div>
            <div className="col-span-2 text-center">Create</div>
            <div className="col-span-2 text-center">Delete</div>
          </div>

          {/* Matrix Body */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {MODULES.map(module => {
              const perms = permissions[selectedRoleId]?.[module.id] || { read: false, write: false, create: false, delete: false };
              return (
                <div key={module.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)]/50 transition-colors items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)]">
                      {module.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--text-primary)] cursor-pointer hover:text-[var(--accent-primary)] transition-colors" onClick={() => handleModuleToggleAll(module.id)}>{module.name}</h4>
                    </div>
                  </div>

                  {PERMISSIONS.map(type => (
                    <div key={type} className="col-span-2 flex justify-center">
                      <PermissionToggle
                        checked={perms[type]}
                        onChange={() => handlePermissionToggle(module.id, type)}
                        disabled={selectedRole?.isSystem && selectedRole?.name === 'Administrator'}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Add Role Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Create New Role</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Enter a name for the new role</p>

                <form onSubmit={handleAddRole}>
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Role Name</label>
                    <input
                      autoFocus
                      type="text"
                      className={inputStyle}
                      placeholder="e.g. Shift Manager"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className={btnSecondary}>
                      Cancel
                    </button>
                    <button type="submit" className={btnPrimary.replace('px-6', 'flex-1')}>
                      Create Role
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PermissionToggle = ({ checked, onChange, disabled }) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} disabled={disabled} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-600/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
    </label>
  );
};
