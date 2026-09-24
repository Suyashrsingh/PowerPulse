import React from 'react';

interface PowerPulseLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const PowerPulseLogo: React.FC<PowerPulseLogoProps> = ({
  className = '',
  size = 42,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* ⚡ Stylized "P" Lightning Bolt SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="powerPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="40%" stopColor="#84cc16" />
            <stop offset="80%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#84cc16" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Main Stylized "P" Lightning Bolt Body */}
        <path
          d="M 22 92 L 34 56 L 22 56 L 44 14 L 70 14 C 84 14 94 24 94 38 C 94 52 83 62 68 62 L 48 62 L 40 92 Z M 46 48 L 66 48 C 72 48 78 44 78 38 C 78 32 72 28 66 28 L 52 28 Z"
          fill="url(#powerPulseGrad)"
          filter="url(#logoGlow)"
        />

        {/* 3 Ascending Bar Chart Columns Inside the "P" Loop */}
        <rect x="52" y="38" width="4" height="6" rx="1.5" fill="#ffffff" />
        <rect x="58" y="34" width="4" height="10" rx="1.5" fill="#ffffff" />
        <rect x="64" y="30" width="4" height="14" rx="1.5" fill="#ffffff" />
      </svg>

      {/* 🏷️ Full Brand Text + Subtitle Tagline (Matching Logo Image) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="text-lg sm:text-2xl font-black tracking-tight flex items-center">
            <span className="text-slate-900 dark:text-white font-extrabold">Power</span>
            <span className="bg-gradient-to-r from-emerald-500 via-lime-400 to-lime-500 bg-clip-text text-transparent font-black">
              Pulse
            </span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <span>Monitor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 inline-block"></span>
            <span>Analyze</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 inline-block"></span>
            <span>Save</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerPulseLogo;
