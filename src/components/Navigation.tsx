import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart3, TrendingUp, Bell, Cpu } from 'lucide-react';

export type ActivePage = 'dashboard' | 'analytics' | 'trends' | 'alerts' | 'device';

interface NavigationProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  alertCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onPageChange,
  alertCount,
}) => {
  const pages: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Cost', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trends', label: 'Trend Graphs', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'device', label: 'Device & AWS', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <nav className="max-w-7xl mx-auto px-2 sm:px-6 my-4">
      <div className="neu-card p-2 flex items-center justify-start sm:justify-between gap-2 overflow-x-auto scrollbar-none shadow-xl">
        {pages.map((page) => {
          const isActive = activePage === page.id;
          return (
            <motion.button
              key={page.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onPageChange(page.id)}
              className={`flex-1 min-w-[125px] sm:min-w-0 px-3.5 py-2.5 text-xs font-mono font-black flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'neu-btn-primary text-slate-950 shadow-md'
                  : 'neu-btn text-main'
              }`}
            >
              {page.icon}
              <span>{page.label}</span>
              {page.id === 'alerts' && alertCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-rose-500 text-white animate-pulse">
                  {alertCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
