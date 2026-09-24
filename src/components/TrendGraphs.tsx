import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Zap, Plug } from 'lucide-react';
import { EnergyReading } from '../types/energy';

interface TrendGraphsProps {
  data: EnergyReading[];
}

export const TrendGraphs: React.FC<TrendGraphsProps> = ({ data }) => {
  const recentData = data.slice(-18);

  const voltages = recentData.map((d) => d.voltage);
  const minV = voltages.length > 0 ? Math.min(...voltages) : 220;
  const maxV = voltages.length > 0 ? Math.max(...voltages) : 240;

  const currents = recentData.map((d) => d.current);
  const maxI = currents.length > 0 ? Math.max(...currents) : 5;

  const uniformLimeLiquid = "liquid-bg-blob bg-lime-400/40 dark:bg-lime-500/35";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
      
      {/* Voltage Trend - 3D Glossy Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="neu-card p-5 flex flex-col justify-between group shadow-xl"
      >
        <div className={`${uniformLimeLiquid} liquid-pos-1`}></div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-300/40 dark:border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-main">Voltage Trend</h4>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-black text-lime-600 dark:text-lime-400">
              {recentData[recentData.length - 1]?.voltage || 230} V
            </span>
          </div>
        </div>

        <div className="h-44 w-full mt-3 neu-inset p-2 rounded-2xl z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              
              <XAxis
                dataKey="timeLabel"
                stroke="#94a3b8"
                fontSize={9}
                tickLine={false}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                domain={[(dataMin: number) => Math.floor(dataMin - 2), (dataMax: number) => Math.ceil(dataMax + 2)]}
                unit="V"
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as EnergyReading;
                    return (
                      <div className="neu-card p-2 font-mono text-[11px] shadow-xl">
                        <span className="text-lime-500 font-bold">Voltage: {pt.voltage} V</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="voltage"
                stroke="#84cc16"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#a3e635' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Current Trend - 3D Glossy Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="neu-card p-5 flex flex-col justify-between group shadow-xl"
      >
        <div className={`${uniformLimeLiquid} liquid-pos-2`}></div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-300/40 dark:border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-500">
              <Plug className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-main">Current Trend</h4>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-black text-lime-600 dark:text-lime-400">
              {recentData[recentData.length - 1]?.current || 2.3} A
            </span>
          </div>
        </div>

        <div className="h-44 w-full mt-3 neu-inset p-2 rounded-2xl z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              
              <XAxis
                dataKey="timeLabel"
                stroke="#94a3b8"
                fontSize={9}
                tickLine={false}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.25)]}
                unit="A"
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as EnergyReading;
                    return (
                      <div className="neu-card p-2 font-mono text-[11px] shadow-xl">
                        <span className="text-lime-500 font-bold">Current: {pt.current} A</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="current"
                stroke="#84cc16"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#a3e635' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
};
