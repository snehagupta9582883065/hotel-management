"use client";
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header({ onMenuClick }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="header glass">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search for rooms, bookings..." />
        </div>
        <div className="actions">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <button className="icon-btn relative">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
        </div>
      </header>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="header glass">
      {/* Mobile Menu Button */}
      <button
        className="icon-btn lg:hidden mr-2"
        onClick={onMenuClick}
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search for rooms, bookings..." />
      </div>

      <div className="actions">
        <button
          className="icon-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={20} className="text-warning" />
          ) : (
            <Moon size={20} className="text-accent-primary" />
          )}
        </button>
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}
