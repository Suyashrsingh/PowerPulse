import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Battery, Calendar, TrendingUp } from 'lucide-react';
import { DailyConsumption } from '../types/energy';

interface EnergyAnalyticsProps {
  todayKwh: number;
  weekKwh: number;
  monthKwh: number;
  dailyData: DailyConsumption[];
  ratePerKwh: number;
}

export const EnergyAnalytics: React.FC<EnergyAnalyticsProps> = ({
  todayKwh,
  weekKwh,
  monthKwh,
  dailyData,
  ratePerKwh,
}) => {
  const uniformLimeLiquid = "liquid-bg-blob bg-lime-400/40 dark:bg-lime-500/35";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="neu-card p-6 space-y-5 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-300/40 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-500">
            <Battery className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-main tracking-wide font-mono">
              ENERGY ANALYTICS
            </h3>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards with Uniform Light Green Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Today */}
        <motion.div whileHover={{ y: -3 }} className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-1`}></div>

          <div className="z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider font-mono">Today</span>
              <Calendar className="w-4 h-4 text-lime-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-main">
                  {todayKwh.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-lime-500">kWh</span>
              </div>
              <span className="text-xs text-sub font-mono font-bold">
                ₹{(todayKwh * ratePerKwh).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* This Week */}
        <motion.div whileHover={{ y: -3 }} className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-2`}></div>

          <div className="z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider font-mono">This Week</span>
              <TrendingUp className="w-4 h-4 text-lime-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-main">
                  {weekKwh.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-lime-500">kWh</span>
              </div>
              <span className="text-xs text-sub font-mono font-bold">
                ₹{(weekKwh * ratePerKwh).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* This Month */}
        <motion.div whileHover={{ y: -3 }} className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-3`}></div>

          <div className="z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider font-mono">This Month</span>
              <Battery className="w-4 h-4 text-lime-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-main">
                  {monthKwh.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-lime-500">kWh</span>
              </div>
              <span className="text-xs text-sub font-mono font-bold">
                ₹{(monthKwh * ratePerKwh).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Daily Energy Bar Chart with Uniform Light Green Bars */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-sub font-mono uppercase">
            Daily Breakdown (7 Days)
          </span>
          <span className="text-[11px] text-lime-600 dark:text-lime-400 font-mono font-bold">
            Avg: {(dailyData.reduce((a, b) => a + b.kwh, 0) / dailyData.length).toFixed(1)} kWh/day
          </span>
        </div>

        <div className="h-52 w-full neu-inset p-3 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                unit=" kWh"
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as DailyConsumption;
                    return (
                      <div className="neu-card p-2.5 font-mono text-xs shadow-xl">
                        <p className="text-lime-500 font-bold mb-1">{dataPoint.day}</p>
                        <p className="text-main">Energy: <span className="font-black">{dataPoint.kwh} kWh</span></p>
                        <p className="text-sub">Cost: <span className="text-lime-500 font-bold">₹{(dataPoint.kwh * ratePerKwh).toFixed(2)}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar dataKey="kwh" radius={[8, 8, 0, 0]}>
                {dailyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === dailyData.length - 1 ? '#a3e635' : '#84cc16'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </motion.div>
  );
};
