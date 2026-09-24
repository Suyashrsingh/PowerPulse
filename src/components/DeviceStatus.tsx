import React from 'react';
import { Cpu, Cloud, Wifi, RefreshCw, Power } from 'lucide-react';
import { DeviceState } from '../types/energy';

interface DeviceStatusProps {
  state: DeviceState;
  onToggleDeviceOnline: () => void;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({
  state,
  onToggleDeviceOnline,
}) => {
  const uniformLimeLiquid = "liquid-bg-blob bg-lime-400/40 dark:bg-lime-500/35";

  return (
    <div className="neu-card p-6 space-y-5 shadow-xl">
      {/* Liquid Fill Overlay */}
      <div className={`${uniformLimeLiquid} liquid-pos-4`}></div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/40 dark:border-slate-800 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-lime-500">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-main tracking-wide font-mono">
            DEVICE STATUS & AWS CONNECTIVITY
          </h3>
        </div>

        <button
          onClick={onToggleDeviceOnline}
          className={`neu-btn px-4 py-2 rounded-xl text-xs font-black font-mono transition flex items-center gap-2 z-10 ${
            state.isOnline
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-lime-600 dark:text-lime-400'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{state.isOnline ? 'Simulate Offline' : 'Restore Online'}</span>
        </button>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono z-10">
        
        {/* ESP32 */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-1`}></div>

          <div className="z-10">
            <div className="flex items-center justify-between text-sub font-black">
              <span className="text-xs uppercase tracking-wider">ESP32 Hardware</span>
              <Cpu className="w-4 h-4 text-lime-500" />
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${state.isOnline ? 'bg-lime-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className={`text-lg font-black ${state.isOnline ? 'text-lime-600 dark:text-lime-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {state.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* AWS IoT */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-2`}></div>

          <div className="z-10">
            <div className="flex items-center justify-between text-sub font-black">
              <span className="text-xs uppercase tracking-wider">AWS IoT Core</span>
              <Cloud className="w-4 h-4 text-lime-500" />
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${state.isOnline && state.awsConnected ? 'bg-lime-500' : 'bg-rose-500'}`}></span>
              <span className={`text-lg font-black ${state.isOnline && state.awsConnected ? 'text-lime-600 dark:text-lime-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {state.isOnline && state.awsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-3`}></div>

          <div className="z-10">
            <div className="flex items-center justify-between text-sub font-black">
              <span className="text-xs uppercase tracking-wider">Last Telemetry</span>
              <RefreshCw className={`w-4 h-4 text-lime-500 ${state.isOnline ? 'animate-spin' : ''}`} />
            </div>
            <div className="mt-4">
              {state.isOnline ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-main">{state.secondsAgo}</span>
                  <span className="text-xs text-lime-600 dark:text-lime-400 font-black">sec ago</span>
                </div>
              ) : (
                <span className="text-sm font-black text-rose-500">No Signal</span>
              )}
            </div>
          </div>
        </div>

        {/* Wi-Fi & PZEM */}
        <div className="neu-card p-5 flex flex-col justify-between group">
          <div className={`${uniformLimeLiquid} liquid-pos-6`}></div>

          <div className="z-10">
            <div className="flex items-center justify-between text-sub font-black">
              <span className="text-xs uppercase tracking-wider">Wi-Fi Signal</span>
              <Wifi className="w-4 h-4 text-lime-500" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-black text-lime-600 dark:text-lime-400">Connected</span>
              <span className="text-xs text-sub font-black">{state.wifiRssi} dBm</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DeviceStatus;
