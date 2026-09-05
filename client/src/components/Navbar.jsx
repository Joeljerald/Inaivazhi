import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Sparkles, Sun, Moon, Laptop, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-sb-default bg-surface sticky top-0 z-20 px-8 flex items-center justify-between shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-sb-main tracking-tight">
          Welcome back, <span className="text-sb-primary font-extrabold">{user?.name || 'User'}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Skill Gap Engine Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-sb-success-soft border border-sb-default text-xs font-semibold text-sb-success">
          <Sparkles className="w-3.5 h-3.5 text-sb-ai" />
          <span>Skill Gap Engine: <span className="font-extrabold">Active</span></span>
        </div>

        {/* Theme Toggle Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-sec border border-sb-default text-xs font-semibold text-sb-sec hover:text-sb-main transition-colors"
            title="Switch theme"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-sb-sec" />}
            <span className="capitalize hidden md:inline">{theme}</span>
            <ChevronDown className="w-3 h-3 text-sb-muted" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl bg-surface border border-sb-default shadow-lg py-1.5 z-50">
              <button
                onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold ${
                  theme === 'light' ? 'bg-sb-primary-soft text-sb-primary font-bold' : 'text-sb-sec hover:bg-surface-sec'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                Light
              </button>
              <button
                onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold ${
                  theme === 'dark' ? 'bg-sb-primary-soft text-sb-primary font-bold' : 'text-sb-sec hover:bg-surface-sec'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                Dark
              </button>
              <button
                onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold ${
                  theme === 'system' ? 'bg-sb-primary-soft text-sb-primary font-bold' : 'text-sb-sec hover:bg-surface-sec'
                }`}
              >
                <Laptop className="w-4 h-4 text-sb-sec" />
                System
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-sb-muted hover:text-sb-main hover:bg-surface-sec transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sb-primary"></span>
        </button>

        {/* User Profile Tag */}
        <div className="flex items-center gap-3 pl-3 border-l border-sb-default">
          <div className="w-9 h-9 rounded-xl bg-sb-primary flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-sb-main block">{user?.name}</span>
            <span className="text-[10px] text-sb-muted block uppercase font-bold tracking-wider">{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
