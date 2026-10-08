import { EnergyReading, TimeRangeFilter } from '../types/energy';

// Configuration interface for AWS connection
export interface AwsConfig {
  apiGatewayUrl: string; // e.g. "https://e92lgpx45c.execute-api.ap-south-1.amazonaws.com/prod"
  apiKey?: string;
  region: string; // e.g. "ap-south-1"
  deviceId: string; // e.g. "SmartEnergyMeter01"
  useRealAws: boolean;
}

const DEFAULT_AWS_CONFIG: AwsConfig = {
  apiGatewayUrl: 'https://e92lgpx45c.execute-api.ap-south-1.amazonaws.com/prod',
  apiKey: '',
  region: 'ap-south-1',
  deviceId: 'SmartEnergyMeter01',
  useRealAws: true,
};

// Local storage key for persistent configuration
const CONFIG_STORAGE_KEY = 'SEM_AWS_CONFIG';

export const getStoredAwsConfig = (): AwsConfig => {
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.apiGatewayUrl) return parsed;
    } catch (e) {
      console.error('Failed to parse stored AWS config', e);
    }
  }
  return DEFAULT_AWS_CONFIG;
};

export const saveAwsConfig = (config: AwsConfig): void => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

// Fetch real telemetry history from AWS API Gateway -> DynamoDB
export const fetchAwsHistoricalData = async (
  config: AwsConfig,
  range: TimeRangeFilter
): Promise<EnergyReading[]> => {
  if (!config.apiGatewayUrl) {
    throw new Error('AWS API Gateway Endpoint URL is missing.');
  }

  const endpoint = `${config.apiGatewayUrl.replace(/\/$/, '')}/readings?deviceId=${encodeURIComponent(config.deviceId)}&range=${encodeURIComponent(range)}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['x-api-key'] = config.apiKey;
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`AWS API Gateway returned HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const list = Array.isArray(data) ? data : data.readings || data.items || [];
  
  return list.map((item: any) => ({
    timestamp: item.timestamp || new Date().toISOString(),
    timeLabel: item.timeLabel || new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voltage: Number(item.voltage) || 0,
    current: Number(item.current) || 0,
    power: Number(item.power) || 0,
    energy: Number(item.energy) || 0,
    frequency: Number(item.frequency) || 0,
    powerFactor: Number(item.power_factor ?? item.powerFactor ?? 0.95),
  }));
};

// Fetch latest single telemetry reading from AWS DynamoDB
export const fetchAwsLatestReading = async (
  config: AwsConfig
): Promise<EnergyReading> => {
  if (!config.apiGatewayUrl) {
    throw new Error('AWS API Gateway Endpoint URL is missing.');
  }

  const endpoint = `${config.apiGatewayUrl.replace(/\/$/, '')}/latest?deviceId=${encodeURIComponent(config.deviceId)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['x-api-key'] = config.apiKey;
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`AWS API Gateway returned HTTP ${response.status}`);
  }

  const item = await response.json();
  const reading = item.item || item.data || item;
  
  return {
    timestamp: reading.timestamp || new Date().toISOString(),
    timeLabel: new Date(reading.timestamp || Date.now()).toLocaleTimeString(),
    voltage: Number(reading.voltage) || 0,
    current: Number(reading.current) || 0,
    power: Number(reading.power) || 0,
    energy: Number(reading.energy) || 0,
    frequency: Number(reading.frequency) || 0,
    powerFactor: Number(reading.power_factor ?? reading.powerFactor ?? 0.95),
  };
};
