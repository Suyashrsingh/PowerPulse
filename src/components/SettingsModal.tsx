import React, { useState, useEffect } from 'react';
import { X, Settings, Cloud, IndianRupee, Download, Zap, Check, Link } from 'lucide-react';
import { LoadPreset } from '../types/energy';
import { AwsConfig, getStoredAwsConfig, saveAwsConfig } from '../services/awsService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratePerKwh: number;
  onRateChange: (rate: number) => void;
  loadPreset: LoadPreset;
  onPresetChange: (preset: LoadPreset) => void;
  onExportData: (format: 'json' | 'csv') => void;
  onAwsConfigSaved?: (config: AwsConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  ratePerKwh,
  onRateChange,
  loadPreset,
  onPresetChange,
  onExportData,
  onAwsConfigSaved,
}) => {
  const [awsConfig, setAwsConfig] = useState<AwsConfig>(getStoredAwsConfig());
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setAwsConfig(getStoredAwsConfig());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAws = () => {
    saveAwsConfig(awsConfig);
    if (onAwsConfigSaved) {
      onAwsConfigSaved(awsConfig);
    }
    setConnectionStatus('success');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-mono">
      <div className="neu-card w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-300/40 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-lime-500">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-main tracking-wide">
                AWS CONNECT & DASHBOARD CONFIG
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-2 text-sub hover:text-main"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-sub">
          
          {/* Section 1: Live AWS Connection Settings */}
          <div className="space-y-3 neu-inset p-4 rounded-xl border border-lime-500/30">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-main uppercase tracking-wider flex items-center gap-2 text-xs">
                <Cloud className="w-4 h-4 text-lime-500" />
                Connect Live AWS Account Data
              </h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={awsConfig.useRealAws}
                  onChange={(e) => setAwsConfig({ ...awsConfig, useRealAws: e.target.checked })}
                  className="w-4 h-4 accent-lime-500 rounded cursor-pointer"
                />
                <span className={`font-mono text-xs font-black ${awsConfig.useRealAws ? 'text-lime-600 dark:text-lime-400' : 'text-sub'}`}>
                  {awsConfig.useRealAws ? 'LIVE AWS ENABLED' : 'Simulated Data'}
                </span>
              </label>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] text-sub font-black mb-1">
                  1. AWS API Gateway Endpoint URL (REST API):
                </label>
                <input
                  type="text"
                  placeholder="https://xyz123.execute-api.ap-south-1.amazonaws.com/prod"
                  value={awsConfig.apiGatewayUrl}
                  onChange={(e) => setAwsConfig({ ...awsConfig, apiGatewayUrl: e.target.value })}
                  className="w-full neu-inset text-main font-bold text-xs p-2.5 rounded-lg focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-sub font-black mb-1">
                    2. Device ID Filter:
                  </label>
                  <input
                    type="text"
                    value={awsConfig.deviceId}
                    onChange={(e) => setAwsConfig({ ...awsConfig, deviceId: e.target.value })}
                    className="w-full neu-inset text-main font-bold text-xs p-2 rounded-lg focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-sub font-black mb-1">
                    3. API Key (Optional):
                  </label>
                  <input
                    type="password"
                    placeholder="x-api-key"
                    value={awsConfig.apiKey || ''}
                    onChange={(e) => setAwsConfig({ ...awsConfig, apiKey: e.target.value })}
                    className="w-full neu-inset text-main font-bold text-xs p-2 rounded-lg focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tariff Rate */}
          <div className="space-y-2">
            <h4 className="font-black text-main uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-lime-500" />
              Electricity Tariff Rate
            </h4>
            <div className="flex items-center gap-3 neu-inset p-3 rounded-xl">
              <span className="text-sub font-bold">Current Tariff Rate:</span>
              <div className="flex items-center gap-1">
                <span className="text-lime-500 font-black text-sm">₹</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="50"
                  value={ratePerKwh}
                  onChange={(e) => onRateChange(parseFloat(e.target.value) || 1)}
                  className="w-20 bg-transparent text-main font-black px-2 py-1 rounded border border-slate-400/30 dark:border-slate-700 focus:outline-none text-center"
                />
                <span className="text-sub font-normal">per kWh</span>
              </div>
            </div>
          </div>

          {/* Section 3: Load Preset Switcher */}
          <div className="space-y-2">
            <h4 className="font-black text-main uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-lime-500" />
              Load Preset Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'normal', label: 'Normal (530W)', desc: 'Standard load' },
                { id: 'heavy', label: 'Heavy (2.4kW)', desc: 'AC + Geyser' },
                { id: 'spike', label: 'Spike (3.2kW)', desc: 'Overload alert' },
                { id: 'standby', label: 'Standby (120W)', desc: 'Night idle' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPresetChange(p.id as LoadPreset)}
                  className={`p-2.5 rounded-xl text-left transition font-mono ${
                    loadPreset === p.id
                      ? 'neu-btn-primary text-slate-950 font-black'
                      : 'neu-btn text-main'
                  }`}
                >
                  <div className="text-xs font-black">{p.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Export Data Reports */}
          <div className="space-y-2">
            <h4 className="font-black text-main uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-lime-500" />
              Export Telemetry & Historical Reports
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExportData('json')}
                className="neu-btn px-4 py-2 text-xs font-black text-main flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-lime-500" />
                Export JSON
              </button>

              <button
                onClick={() => onExportData('csv')}
                className="neu-btn px-4 py-2 text-xs font-black text-main flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-lime-500" />
                Export CSV
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-300/40 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono">
            {connectionStatus === 'success' && (
              <span className="text-lime-600 dark:text-lime-400 font-black flex items-center gap-1">
                <Check className="w-4 h-4" /> Configuration Saved!
              </span>
            )}
          </div>

          <button
            onClick={handleSaveAws}
            className="neu-btn-primary px-5 py-2.5 text-xs font-black text-slate-950 flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            Save & Connect AWS
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
