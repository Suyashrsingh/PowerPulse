import { EnergyReading, TimeRangeFilter, AlertEvent, DailyConsumption, LoadPreset } from '../types/energy';

// Helper to format timestamps
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Zero Initial Telemetry Reading
export const EMPTY_READING: EnergyReading = {
  timestamp: new Date().toISOString(),
  timeLabel: formatTime(new Date()),
  voltage: 0,
  current: 0,
  power: 0,
  energy: 0,
  frequency: 0,
  powerFactor: 0,
};

// Initial Alert Logs seed (Empty for real AWS log streaming)
export const INITIAL_ALERTS: AlertEvent[] = [];

// Base generator for historical data fallback
export const generateHistoricalData = (range: TimeRangeFilter): EnergyReading[] => {
  return [];
};

// Generate daily consumption data
export const generateDailyConsumption = (): DailyConsumption[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    kwh: 0,
    cost: 0,
  }));
};

export const generateNextReading = (
  lastReading: EnergyReading,
  preset: LoadPreset = 'normal'
): EnergyReading => {
  return EMPTY_READING;
};
