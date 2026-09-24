import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Zap } from 'lucide-react';
import { EnergyReading, TimeRangeFilter } from '../types/energy';

interface PowerGraphProps {
  data: EnergyReading[];
  activeFilter: TimeRangeFilter;
  onFilterChange: (filter: TimeRangeFilter) => void;
}

export const PowerGraph: React.FC<PowerGraphProps> = ({
  data,
  activeFilter,
  onFilterChange,
}) => {
  const filters: TimeRangeFilter[] = ['1H', '6H', '24H', '7D', '30D'];
  const filterLabels: Record<TimeRangeFilter, string> = {
    '1H': '1 Hour',
    '6H': '6 Hours',
    '24H': '24 Hours',
    '7D': '7 Days',
    '30D': '30 Days',
  };

  const powers = data.map((d) => d.power);
  const maxPower = powers.length > 0 ? Math.max(...powers) : 0;
  const avgPower = powers.length > 0 ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="neu-card p-6 space-y-4 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-300/40 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-500">
            <Zap className="w-4 h-4 fill-lime-500" />
          </div>
          <h3 className="text-base font-black tracking-wide font-mono text-main">
            POWER GRAPH
          </h3>
        </div>

        {/* Time Filters */}
        <div className="neu-inset p-1.5 flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto max-w-full overflow-x-auto scrollbar-none rounded-xl">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange(filter)}
              className={`px-2.5 sm:px-3.5 py-1.5 text-xs font-black font-mono rounded-lg transition whitespace-nowrap flex-1 sm:flex-initial text-center ${
                activeFilter === filter
                  ? 'neu-btn-primary text-slate-950 shadow-md'
                  : 'neu-btn text-main'
              }`}
            >
              <span className="sm:hidden">{filter}</span>
              <span className="hidden sm:inline">{filterLabels[filter]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="neu-inset p-3 text-center">
          <span className="text-[10px] font-extrabold uppercase text-sub">Peak Power</span>
          <div className="text-lg font-black text-lime-600 dark:text-lime-400 mt-0.5">{maxPower} W</div>
        </div>
        <div className="neu-inset p-3 text-center">
          <span className="text-[10px] font-extrabold uppercase text-sub">Average Power</span>
          <div className="text-lg font-black text-main mt-0.5">{avgPower} W</div>
        </div>
        <div className="neu-inset p-3 text-center">
          <span className="text-[10px] font-extrabold uppercase text-sub">Warning Limit</span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">2000 W</div>
        </div>
        <div className="neu-inset p-3 text-center">
          <span className="text-[10px] font-extrabold uppercase text-sub">Critical Limit</span>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">3000 W</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="limePowerGrad3D" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3e635" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />

            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
              unit=" W"
              domain={[0, (dataMax: number) => Math.max(3500, Math.ceil(dataMax * 1.15))]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload as EnergyReading;
                  return (
                    <div className="neu-card p-3 font-mono text-xs shadow-2xl">
                      <p className="text-main text-[10px] mb-1 font-extrabold">
                        Time: {dataPoint.timeLabel}
                      </p>
                      <div className="space-y-1 font-bold">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-lime-600 dark:text-lime-400 font-black">Power:</span>
                          <span className="text-main font-black text-sm">{dataPoint.power} W</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-sub">
                          <span>Voltage / Current:</span>
                          <span>{dataPoint.voltage} V / {dataPoint.current} A</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceLine y={2000} stroke="#f59e0b" strokeDasharray="5 5" />
            <ReferenceLine y={3000} stroke="#ef4444" strokeDasharray="4 4" />

            <Area
              type="monotone"
              dataKey="power"
              stroke="#84cc16"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#limePowerGrad3D)"
              activeDot={{ r: 7, fill: '#a3e635', stroke: '#ffffff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </motion.div>
  );
};
