import React, { useState } from 'react';
import { Bell, Send, Trash2 } from 'lucide-react';
import { AlertEvent } from '../types/energy';

interface AlertsSectionProps {
  alerts: AlertEvent[];
  onTriggerTestAlert: () => void;
  onClearAlerts: () => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  onTriggerTestAlert,
  onClearAlerts,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'normal'>('all');

  const filteredAlerts = alerts.filter((a) => (filter === 'all' ? true : a.severity === filter));

  const uniformLimeLiquid = "liquid-bg-blob bg-lime-400/40 dark:bg-lime-500/35";

  const getSeverityBadge = (severity: AlertEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 text-xs font-mono font-black">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Critical</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 text-xs font-mono font-black">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Warning</span>
          </div>
        );
      case 'normal':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/20 text-lime-600 dark:text-lime-400 border border-lime-500/40 text-xs font-mono font-black">
            <span className="w-2 h-2 rounded-full bg-lime-500"></span>
            <span>Normal</span>
          </div>
        );
    }
  };

  return (
    <div className="neu-card p-6 space-y-5 shadow-xl">
      {/* Liquid Wave Overlay */}
      <div className={`${uniformLimeLiquid} liquid-pos-4`}></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/40 dark:border-slate-800 z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-rose-500">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-main tracking-wide font-mono">
              ALERTS & NOTIFICATIONS
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button
            onClick={onTriggerTestAlert}
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-black font-mono text-lime-600 dark:text-lime-400 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test SNS Alert</span>
          </button>
          
          {alerts.length > 0 && (
            <button
              onClick={onClearAlerts}
              className="neu-btn px-3 py-2 text-xs text-sub hover:text-main font-mono font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 font-mono z-10 overflow-x-auto max-w-full scrollbar-none py-0.5">
        {(['all', 'critical', 'warning', 'normal'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition whitespace-nowrap flex-shrink-0 ${
              filter === f
                ? 'neu-btn-primary text-slate-950 shadow-md'
                : 'neu-btn text-main'
            }`}
          >
            {f === 'all' ? `All (${alerts.length})` : f}
          </button>
        ))}
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 font-mono z-10">
        {filteredAlerts.length === 0 ? (
          <div className="neu-inset text-center py-8 text-sub text-xs font-bold rounded-xl">
            No alert logs registered. System operating normally.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="neu-inset p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs rounded-xl"
            >
              <div className="flex items-center gap-3">
                {getSeverityBadge(alert.severity)}
                <span className="font-extrabold text-main text-sm">
                  {alert.message.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')}
                </span>
              </div>

              <div className="text-right flex-shrink-0 text-sub text-xs font-bold">
                <span>{alert.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AlertsSection;
