import React from 'react';
import { IndianRupee, Edit3 } from 'lucide-react';
import { EnergyCostSummary } from '../types/energy';

interface CostCalculatorProps {
  summary: EnergyCostSummary;
  onRateChange: (newRate: number) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  summary,
  onRateChange,
}) => {
  const ratePresets = [5.0, 7.5, 8.0, 10.0, 12.0];
  const dailyAvgKwh = summary.todayKwh;
  const projectedMonthCost = (dailyAvgKwh * 30 * summary.ratePerKwh).toFixed(2);

  const uniformLimeLiquid = "liquid-bg-blob bg-lime-400/40 dark:bg-lime-500/35";

  return (
    <div className="neu-card p-6 space-y-5 shadow-xl">
      {/* Liquid Wave Effect */}
      <div className={`${uniformLimeLiquid} liquid-pos-4`}></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/40 dark:border-slate-800 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-lime-500">
            <IndianRupee className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-main tracking-wide font-mono">
            ESTIMATED ELECTRICITY COST
          </h3>
        </div>

        {/* Rate Input */}
        <div className="flex items-center gap-2 neu-inset p-2 px-3 rounded-xl z-10">
          <span className="text-xs font-bold text-sub font-mono flex items-center gap-1">
            <Edit3 className="w-3.5 h-3.5 text-lime-500" />
            Rate:
          </span>
          <div className="flex items-center gap-1 font-mono text-xs font-bold">
            <span className="text-lime-500 font-black">₹</span>
            <input
              type="number"
              step="0.5"
              min="1"
              max="50"
              value={summary.ratePerKwh}
              onChange={(e) => onRateChange(parseFloat(e.target.value) || 1)}
              className="w-14 bg-transparent text-main font-black text-center focus:outline-none"
            />
            <span className="text-sub font-normal">/ kWh</span>
          </div>
        </div>
      </div>

      {/* Preset Rate Selector */}
      <div className="flex items-center gap-2 text-xs font-mono text-sub z-10 overflow-x-auto max-w-full scrollbar-none py-0.5">
        <span className="font-bold flex-shrink-0">Tariff Quick Pick:</span>
        {ratePresets.map((r) => (
          <button
            key={r}
            onClick={() => onRateChange(r)}
            className={`px-3 py-1 rounded-xl transition font-mono whitespace-nowrap flex-shrink-0 ${
              summary.ratePerKwh === r
                ? 'neu-btn-primary text-slate-950 font-black'
                : 'neu-btn text-main'
            }`}
          >
            ₹{r.toFixed(1)}
          </button>
        ))}
      </div>

      {/* 3 Main Cost Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 z-10">
        
        {/* Today */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-1`}></div>
          <div className="z-10">
            <span className="text-xs font-black uppercase tracking-wider text-lime-600 dark:text-lime-400 font-mono">
              Today
            </span>
            <div className="mt-3">
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-sm font-bold text-lime-500">₹</span>
                <span className="text-3xl font-black text-main">
                  {summary.todayCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Week */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-2`}></div>
          <div className="z-10">
            <span className="text-xs font-black uppercase tracking-wider text-lime-600 dark:text-lime-400 font-mono">
              This Week
            </span>
            <div className="mt-3">
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-sm font-bold text-lime-500">₹</span>
                <span className="text-3xl font-black text-main">
                  {summary.weekCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Month */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-3`}></div>
          <div className="z-10">
            <span className="text-xs font-black uppercase tracking-wider text-lime-600 dark:text-lime-400 font-mono">
              This Month
            </span>
            <div className="mt-3">
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-sm font-bold text-lime-500">₹</span>
                <span className="text-3xl font-black text-main">
                  {summary.monthCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Monthly Projection */}
      <div className="neu-inset p-4 rounded-xl flex items-center justify-between text-xs font-mono z-10">
        <span className="text-sub font-bold">Projected Month End Bill:</span>
        <span className="text-lime-600 dark:text-lime-400 font-black text-base">₹{projectedMonthCost}</span>
      </div>

    </div>
  );
};

export default CostCalculator;
