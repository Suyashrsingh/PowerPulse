import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, ActivePage } from './components/Navigation';
import { LiveReadings } from './components/LiveReadings';
import { PowerGraph } from './components/PowerGraph';
import { EnergyAnalytics } from './components/EnergyAnalytics';
import { TrendGraphs } from './components/TrendGraphs';
import { AlertsSection } from './components/AlertsSection';
import { CostCalculator } from './components/CostCalculator';
import { DeviceStatus } from './components/DeviceStatus';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SettingsModal } from './components/SettingsModal';

import {
  EnergyReading,
  TimeRangeFilter,
  AlertEvent,
  DeviceState,
  DailyConsumption,
  LoadPreset,
} from './types/energy';

import {
  generateHistoricalData,
  generateDailyConsumption,
  INITIAL_ALERTS,
  generateNextReading,
  formatTime,
} from './services/mockDataService';

export const App: React.FC = () => {
  // 1. Persistent Theme State (Default: Dark Mode for ultra 3D high contrast)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('SEM_THEME');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('SEM_THEME', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('SEM_THEME', 'light');
    }
  }, [isDarkMode]);

  // 2. Active Website Page View State ('dashboard' | 'analytics' | 'trends' | 'alerts' | 'device')
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  // 3. Core Telemetry State
  const [activeFilter, setActiveFilter] = useState<TimeRangeFilter>('24H');
  const [historicalData, setHistoricalData] = useState<EnergyReading[]>(() =>
    generateHistoricalData('24H')
  );
  
  const [currentReading, setCurrentReading] = useState<EnergyReading>(() => {
    const data = generateHistoricalData('24H');
    return data[data.length - 1];
  });

  const [dailyData, setDailyData] = useState<DailyConsumption[]>(() =>
    generateDailyConsumption()
  );

  // 4. Dashboard Settings & Rate State
  const [ratePerKwh, setRatePerKwh] = useState<number>(8.0);
  const [loadPreset, setLoadPreset] = useState<LoadPreset>('normal');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // 5. Alerts State
  const [alerts, setAlerts] = useState<AlertEvent[]>(INITIAL_ALERTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 6. Device State
  const [deviceState, setDeviceState] = useState<DeviceState>({
    deviceId: 'SmartEnergyMeter01',
    isOnline: true,
    awsConnected: true,
    wifiConnected: true,
    wifiRssi: -58,
    lastUpdated: formatTime(new Date()),
    secondsAgo: 0,
    pzemStatus: 'OK',
    dynamoDbStatus: 'SYNCED',
    snsStatus: 'ACTIVE',
  });

  // 7. Modals State
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Filter Change
  const handleFilterChange = (filter: TimeRangeFilter) => {
    setActiveFilter(filter);
    const newData = generateHistoricalData(filter);
    setHistoricalData(newData);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 8. Telemetry Loop
  useEffect(() => {
    if (!isSimulating || !deviceState.isOnline) return;

    const interval = setInterval(() => {
      const nextReading = generateNextReading(currentReading, loadPreset);
      setCurrentReading(nextReading);

      setHistoricalData((prev) => [...prev.slice(1), nextReading]);

      const now = new Date();
      setDeviceState((prev) => ({
        ...prev,
        lastUpdated: formatTime(now),
        secondsAgo: 0,
      }));

      if (nextReading.power >= 3000) {
        const newAlert: AlertEvent = {
          id: `alt-${Date.now()}`,
          severity: 'critical',
          message: `Critical: Power exceeded 3000 W (${nextReading.power} W)`,
          timestamp: formatTime(now),
          value: nextReading.power,
        };
        setAlerts((prev) => [newAlert, ...prev]);
        showToast(`Power Overload Alert (${nextReading.power} W)`);
      } else if (nextReading.power >= 2000 && nextReading.power < 3000) {
        const existsWarning = alerts.some(
          (a) => a.severity === 'warning' && a.timestamp === formatTime(now)
        );
        if (!existsWarning) {
          const newAlert: AlertEvent = {
            id: `alt-${Date.now()}`,
            severity: 'warning',
            message: `Warning: Power exceeded 2000 W (${nextReading.power} W)`,
            timestamp: formatTime(now),
            value: nextReading.power,
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, deviceState.isOnline, currentReading, loadPreset, alerts]);

  // Ticker
  useEffect(() => {
    if (!deviceState.isOnline) return;

    const ticker = setInterval(() => {
      setDeviceState((prev) => ({
        ...prev,
        secondsAgo: prev.secondsAgo + 1,
      }));
    }, 1000);

    return () => clearInterval(ticker);
  }, [deviceState.isOnline]);

  const handleTriggerTestAlert = () => {
    const now = new Date();
    const testAlert: AlertEvent = {
      id: `test-${Date.now()}`,
      severity: 'critical',
      message: 'Critical: Power exceeded 3250 W (SNS Test)',
      timestamp: formatTime(now),
      value: 3250,
    };
    setAlerts((prev) => [testAlert, ...prev]);
    showToast('AWS Lambda -> SNS Alert Dispatched');
  };

  const handleToggleDeviceOnline = () => {
    setDeviceState((prev) => {
      const nextOnline = !prev.isOnline;
      showToast(nextOnline ? 'Device Reconnected' : 'Device Offline');
      return {
        ...prev,
        isOnline: nextOnline,
        awsConnected: nextOnline,
        wifiConnected: nextOnline,
      };
    });
  };

  const handleExportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const jsonStr = JSON.stringify(historicalData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SEM_Telemetry_${activeFilter}.json`;
      a.click();
    } else {
      const headers = ['Timestamp', 'Time', 'Voltage(V)', 'Current(A)', 'Power(W)', 'Energy(kWh)', 'Freq(Hz)', 'PF'];
      const rows = historicalData.map((d) => [
        d.timestamp,
        d.timeLabel,
        d.voltage,
        d.current,
        d.power,
        d.energy,
        d.frequency,
        d.powerFactor,
      ]);
      const csvStr = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvStr], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SEM_Telemetry_${activeFilter}.csv`;
      a.click();
    }
    showToast(`Exported as ${format.toUpperCase()}`);
  };

  const todayKwh = 4.82 + (currentReading.energy - 1.284);
  const weekKwh = 28.6 + (todayKwh - 4.82);
  const monthKwh = 94.3 + (todayKwh - 4.82);

  const costSummary = {
    ratePerKwh,
    todayKwh,
    weekKwh,
    monthKwh,
    todayCost: +(todayKwh * ratePerKwh).toFixed(2),
    weekCost: +(weekKwh * ratePerKwh).toFixed(2),
    monthCost: +(monthKwh * ratePerKwh).toFixed(2),
  };

  return (
    <div className="page-3d-container min-h-screen transition-colors duration-300 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 card-3d text-blue-600 dark:text-blue-400 font-mono text-xs font-black shadow-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        deviceState={deviceState}
        isSimulating={isSimulating}
        isDarkMode={isDarkMode}
        activePage={activePage}
        onPageChange={setActivePage}
        alertCount={alerts.length}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onOpenArchitecture={() => setIsArchModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* 3D Navigation Bar for Website Pages (Desktop only; Mobile uses Hamburger Menu) */}
      <div className="hidden lg:block">
        <Navigation
          activePage={activePage}
          onPageChange={setActivePage}
          alertCount={alerts.length}
        />
      </div>

      {/* Website Page Views */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Page 1: Dashboard Overview */}
        {activePage === 'dashboard' && (
          <>
            <LiveReadings reading={currentReading} />
            <PowerGraph
              data={historicalData}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </>
        )}

        {/* Page 2: Analytics & Cost */}
        {activePage === 'analytics' && (
          <div className="space-y-6">
            <EnergyAnalytics
              todayKwh={todayKwh}
              weekKwh={weekKwh}
              monthKwh={monthKwh}
              dailyData={dailyData}
              ratePerKwh={ratePerKwh}
            />
            <CostCalculator
              summary={costSummary}
              onRateChange={(r) => setRatePerKwh(r)}
            />
          </div>
        )}

        {/* Page 3: Trend Graphs */}
        {activePage === 'trends' && (
          <div className="space-y-6">
            <TrendGraphs data={historicalData} />
            <PowerGraph
              data={historicalData}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Page 4: Alerts & Logs */}
        {activePage === 'alerts' && (
          <div className="space-y-6">
            <AlertsSection
              alerts={alerts}
              onTriggerTestAlert={handleTriggerTestAlert}
              onClearAlerts={() => setAlerts([])}
            />
          </div>
        )}

        {/* Page 5: Device & AWS Cloud */}
        {activePage === 'device' && (
          <div className="space-y-6">
            <DeviceStatus
              state={deviceState}
              onToggleDeviceOnline={handleToggleDeviceOnline}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        ratePerKwh={ratePerKwh}
        onRateChange={setRatePerKwh}
        loadPreset={loadPreset}
        onPresetChange={setLoadPreset}
        onExportData={handleExportData}
      />

    </div>
  );
};

export default App;
