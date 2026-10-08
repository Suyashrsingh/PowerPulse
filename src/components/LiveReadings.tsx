import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Zap, Plug, Activity, Battery, Radio, BarChart3 } from 'lucide-react';
import { EnergyReading } from '../types/energy';

interface LiveReadingsProps {
  reading: EnergyReading;
}

export const LiveReadings: React.FC<LiveReadingsProps> = ({ reading }) => {
  const isCritical = reading.power >= 3000;
  const isWarning = reading.power >= 2000 && reading.power < 3000;

  // Max load capacity: 3300W (Standard 230V / 15A circuit)
  const MAX_LOAD_W = 3300;
  const rawPercentage = (reading.power / MAX_LOAD_W) * 100;
  const powerPercentage = Math.min(100, rawPercentage);

  // Format percentage text cleanly: e.g. "0.1%" or "0.2%" for small loads like 3.9W/6W instead of 0%
  const displayPercentage = reading.power === 0
    ? '0'
    : powerPercentage < 1
    ? powerPercentage.toFixed(1)
    : Math.round(powerPercentage).toString();

  // Dial SVG stroke math (ensure a tiny visible stroke if load > 0)
  const strokePercentage = reading.power > 0 && powerPercentage < 2 ? 2 : powerPercentage;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (strokePercentage / 100) * circumference;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  // Uniform Light Green Overlay Class
  const uniformLimeLiquid = "liquid-bg-blob bg-lime-400/40 dark:bg-lime-500/35";

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-black text-main tracking-wider uppercase font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-lime-500 dark:text-lime-400 animate-pulse" />
          Live Telemetry Readouts
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Card 1: Voltage - Position 1: Bottom-Left Liquid Wave (Uniform Light Green) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="neu-card p-4 flex items-center justify-between shadow-lg group"
        >
          <div className={`${uniformLimeLiquid} liquid-pos-1`}></div>

          <div className="z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-600 dark:text-lime-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-main uppercase tracking-wider">Voltage</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-main">
                {reading.voltage.toFixed(1)}
              </span>
              <span className="text-xs font-black text-lime-600 dark:text-lime-400">V</span>
            </div>
          </div>
          <div className="text-right font-mono text-xs font-bold text-sub z-10">
            <span>230V Grid</span>
          </div>
        </motion.div>

        {/* Card 2: Current - Position 2: Bottom-Right Liquid Wave (Uniform Light Green) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="neu-card p-4 flex items-center justify-between shadow-lg group"
        >
          <div className={`${uniformLimeLiquid} liquid-pos-2`}></div>

          <div className="z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-600 dark:text-lime-400">
                <Plug className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-main uppercase tracking-wider">Current</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-main">
                {reading.current.toFixed(2)}
              </span>
              <span className="text-xs font-black text-lime-600 dark:text-lime-400">A</span>
            </div>
          </div>
          <div className="text-right font-mono text-xs font-bold text-sub z-10">
            <span>{(reading.current * (reading.voltage > 0 ? reading.voltage : 230)).toFixed(0)} VA</span>
          </div>
        </motion.div>

        {/* Card 3: Power Factor - Position 3: Top-Right Liquid Wave (Uniform Light Green) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="neu-card p-4 flex items-center justify-between shadow-lg group"
        >
          <div className={`${uniformLimeLiquid} liquid-pos-3`}></div>

          <div className="z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-600 dark:text-lime-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-main uppercase tracking-wider">Power Factor</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-main">
                {reading.powerFactor.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="text-right font-mono text-xs font-bold text-lime-600 dark:text-lime-400 z-10">
            <span>Optimal</span>
          </div>
        </motion.div>

        {/* Card 4: Active Power - Position 4: Center Expanding Fluid Wave Ripple (Uniform Light Green) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="col-span-1 md:col-span-2 lg:col-span-1 neu-card p-4 flex items-center justify-between shadow-xl group"
        >
          <div className={`${uniformLimeLiquid} liquid-pos-4`}></div>

          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-500">
                <Zap className="w-4 h-4 fill-lime-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-main">
                Active Power
              </span>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-lime-600 dark:text-lime-400 tracking-tight">
                  {reading.power.toFixed(1)}
                </span>
                <span className="text-sm font-black text-lime-500">W</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono pt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-rose-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-lime-500'}`}></span>
              <span className={`font-black ${isCritical ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-lime-600 dark:text-lime-400'}`}>
                {isCritical ? 'Critical' : isWarning ? 'Warning' : 'Normal'}
              </span>
            </div>
          </div>

          {/* 3D Ring Gauge Dial */}
          <div className="relative flex items-center justify-center flex-shrink-0 z-10">
            <div className="dial-outer relative">
              <svg className="w-full h-full transform -rotate-90 p-1.5">
                <circle
                  cx="51"
                  cy="51"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="transparent"
                  className="text-slate-300 dark:text-slate-800"
                />
                <circle
                  cx="51"
                  cy="51"
                  r={radius}
                  stroke="url(#limeGradUniform)"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="limeGradUniform" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a3e635" />
                    <stop offset="100%" stopColor="#65a30d" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="dial-inner text-center">
                  <span className="text-sm font-black font-mono text-lime-600 dark:text-lime-400">
                    {displayPercentage}%
                  </span>
                  <span className="text-[8px] font-black text-sub font-mono uppercase">Load</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 5: Energy - Position 5: Bottom Rising Fluid Wave Tide (Uniform Light Green) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="neu-card p-4 flex items-center justify-between shadow-lg group"
        >
          <div className={`${uniformLimeLiquid} liquid-pos-5`}></div>

          <div className="z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-600 dark:text-lime-400">
                <Battery className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-main uppercase tracking-wider">Energy</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-main">
                {reading.energy.toFixed(3)}
              </span>
              <span className="text-xs font-black text-lime-600 dark:text-lime-400">kWh</span>
            </div>
          </div>
          <div className="text-right font-mono text-xs font-bold text-sub z-10">
            <span>Total Meter</span>
          </div>
        </motion.div>

        {/* Card 6: Frequency - Position 6: Top-Left Fluid Wave Fill (Uniform Light Green) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="neu-card p-4 flex items-center justify-between shadow-lg group"
        >
          <div className={`${uniformLimeLiquid} liquid-pos-6`}></div>

          <div className="z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 neu-btn flex items-center justify-center text-lime-600 dark:text-lime-400">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-main uppercase tracking-wider">Frequency</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-main">
                {reading.frequency.toFixed(1)}
              </span>
              <span className="text-xs font-black text-lime-600 dark:text-lime-400">Hz</span>
            </div>
          </div>
          <div className="text-right font-mono text-xs font-bold text-sub z-10">
            <span>50Hz Grid</span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};
