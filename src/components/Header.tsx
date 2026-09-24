import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Settings,
  Network,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Bell,
  Cpu,
} from 'lucide-react';
import { DeviceState } from '../types/energy';
import { ActivePage } from './Navigation';
import { PowerPulseLogo } from './PowerPulseLogo';

interface HeaderProps {
  deviceState: DeviceState;
  isSimulating: boolean;
  isDarkMode: boolean;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  alertCount: number;
  onToggleDarkMode: () => void;
  onToggleSimulation: () => void;
  onOpenArchitecture: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  deviceState,
  isSimulating,
  isDarkMode,
  activePage,
  onPageChange,
  alertCount,
  onToggleDarkMode,
  onToggleSimulation,
  onOpenArchitecture,
  onOpenSettings,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pages: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Cost', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trends', label: 'Trend Graphs', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'device', label: 'Device & AWS', icon: <Cpu className="w-4 h-4" /> },
  ];

  const handlePageSelect = (pageId: ActivePage) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="neu-card sticky top-0 z-50 px-3 sm:px-6 py-3 mx-2 sm:mx-4 my-2 sm:my-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Full PowerPulse Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer flex-shrink-0"
          title="PowerPulse — Smart Energy Monitor"
        >
          <PowerPulseLogo size={40} showText={true} />
        </motion.div>

        {/* Center/Desktop Status Pill (Visible on xl screens) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-sub font-mono font-bold neu-inset px-3 py-1.5 rounded-xl">
          <span className="text-[10px] font-black text-lime-600 dark:text-lime-400">
            {deviceState.deviceId}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${deviceState.isOnline ? 'bg-lime-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className={deviceState.isOnline ? 'text-lime-600 dark:text-lime-400 font-black' : 'text-rose-600 dark:text-rose-400 font-black'}>
              {deviceState.isOnline ? 'Online' : 'Offline'}
            </span>
          </span>
          <span>•</span>
          <span className="text-main font-black">{deviceState.lastUpdated}</span>
        </div>

        {/* Right Desktop Actions (Visible on lg+ screens) */}
        <div className="hidden lg:flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleDarkMode}
            className="neu-btn px-3.5 py-2 flex items-center justify-center font-mono font-bold text-xs gap-1.5"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span className="text-main font-black">{isDarkMode ? 'Light' : 'Dark'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSimulation}
            className={`neu-btn px-3.5 py-2 text-xs font-bold font-mono flex items-center gap-1.5 ${
              isSimulating ? 'text-lime-600 dark:text-lime-400 font-black' : 'text-amber-600 dark:text-amber-400 font-black'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Live Data' : 'Paused'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenArchitecture}
            className="neu-btn px-3.5 py-2 text-xs font-black font-mono text-main flex items-center gap-1.5"
          >
            <Network className="w-3.5 h-3.5 text-lime-500" />
            <span>AWS Pipeline</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="neu-btn px-3.5 py-2 text-xs font-black font-mono text-main flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-sub" />
            <span>Config</span>
          </motion.button>
        </div>

        {/* Mobile Hamburger Toggle Button (Visible on screens < lg) */}
        <div className="flex lg:hidden items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="neu-btn p-2.5 rounded-xl text-main flex items-center justify-center border border-lime-500/40"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-lime-500" />
            ) : (
              <Menu className="w-6 h-6 text-lime-500" />
            )}
          </motion.button>
        </div>

      </div>

      {/* 📱 Mobile Animated Hamburger Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden lg:hidden border-t border-slate-300/40 dark:border-slate-800 pt-3 space-y-4"
          >
            {/* 1. Mobile Page Switcher Links */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-sub tracking-wider px-2 font-mono">
                Navigation Pages
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {pages.map((page) => {
                  const isActive = activePage === page.id;
                  return (
                    <button
                      key={page.id}
                      onClick={() => handlePageSelect(page.id)}
                      className={`w-full px-4 py-3 text-xs font-mono font-black flex items-center justify-between rounded-xl transition ${
                        isActive
                          ? 'neu-btn-primary text-slate-950 shadow-md'
                          : 'neu-btn text-main'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {page.icon}
                        <span>{page.label}</span>
                      </div>
                      {page.id === 'alerts' && alertCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white animate-pulse">
                          {alertCount} New
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Mobile Quick System Actions */}
            <div className="space-y-1.5 pt-2 border-t border-slate-300/40 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase text-sub tracking-wider px-2 font-mono">
                System Quick Actions
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  onClick={() => {
                    onToggleDarkMode();
                  }}
                  className="neu-btn p-3 text-xs font-black text-main flex items-center justify-center gap-2 rounded-xl"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>

                <button
                  onClick={() => {
                    onToggleSimulation();
                  }}
                  className={`neu-btn p-3 text-xs font-black flex items-center justify-center gap-2 rounded-xl ${
                    isSimulating ? 'text-lime-600 dark:text-lime-400' : 'text-amber-500'
                  }`}
                >
                  <Activity className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Live' : 'Paused'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenArchitecture();
                    setIsMobileMenuOpen(false);
                  }}
                  className="neu-btn p-3 text-xs font-black text-main flex items-center justify-center gap-2 rounded-xl col-span-1"
                >
                  <Network className="w-4 h-4 text-lime-500" />
                  <span>AWS Pipeline</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsMobileMenuOpen(false);
                  }}
                  className="neu-btn p-3 text-xs font-black text-main flex items-center justify-center gap-2 rounded-xl col-span-1"
                >
                  <Settings className="w-4 h-4 text-sub" />
                  <span>Config</span>
                </button>
              </div>
            </div>

            {/* 3. Mobile Device Status Pill */}
            <div className="neu-inset p-3 rounded-xl flex items-center justify-between text-xs font-mono font-bold">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${deviceState.isOnline ? 'bg-lime-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <span className="text-main">{deviceState.deviceId}</span>
              </div>
              <span className="text-lime-600 dark:text-lime-400 text-[11px] font-black">
                {deviceState.isOnline ? `Online (${deviceState.secondsAgo}s ago)` : 'Offline'}
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;
