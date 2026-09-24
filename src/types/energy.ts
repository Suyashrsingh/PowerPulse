export interface EnergyReading {
  timestamp: string;
  timeLabel: string;
  voltage: number; // V
  current: number; // A
  power: number;   // W
  energy: number;  // kWh
  frequency: number; // Hz
  powerFactor: number; // 0 - 1
}

export type TimeRangeFilter = '1H' | '6H' | '24H' | '7D' | '30D';

export interface AlertEvent {
  id: string;
  severity: 'critical' | 'warning' | 'normal';
  message: string;
  timestamp: string;
  value?: number;
  acknowledged?: boolean;
}

export interface DeviceState {
  deviceId: string;
  isOnline: boolean;
  awsConnected: boolean;
  wifiConnected: boolean;
  wifiRssi: number;
  lastUpdated: string;
  secondsAgo: number;
  pzemStatus: 'OK' | 'ERROR';
  dynamoDbStatus: 'SYNCED' | 'DELAYED' | 'OFFLINE';
  snsStatus: 'ACTIVE' | 'PAUSED';
}

export interface EnergyCostSummary {
  ratePerKwh: number; // in INR (₹)
  todayKwh: number;
  weekKwh: number;
  monthKwh: number;
  todayCost: number;
  weekCost: number;
  monthCost: number;
}

export interface DailyConsumption {
  day: string;
  kwh: number;
  cost: number;
}

export type LoadPreset = 'normal' | 'heavy' | 'spike' | 'standby';
