import { EnergyReading, TimeRangeFilter } from '../types/energy';

// Configuration interface for AWS connection
export interface AwsConfig {
  apiGatewayUrl: string; // e.g. "https://xyz123.execute-api.ap-south-1.amazonaws.com/prod"
  apiKey?: string;
  region: string; // e.g. "ap-south-1"
  deviceId: string; // e.g. "SmartEnergyMeter01"
  useRealAws: boolean;
}

const DEFAULT_AWS_CONFIG: AwsConfig = {
  apiGatewayUrl: '',
  apiKey: '',
  region: 'ap-south-1',
  deviceId: 'SmartEnergyMeter01',
  useRealAws: false,
};

// Local storage key for persistent configuration
const CONFIG_STORAGE_KEY = 'SEM_AWS_CONFIG';

export const getStoredAwsConfig = (): AwsConfig => {
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
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
    throw new Error('AWS API Gateway URL is missing.');
  }

  const endpoint = `${config.apiGatewayUrl.replace(/\/$/, '')}/readings?deviceId=${config.deviceId}&range=${range}`;
  
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
  // Expecting data to be an array of EnergyReading or AWS DynamoDB items
  return data.map((item: any) => ({
    timestamp: item.timestamp || new Date().toISOString(),
    timeLabel: item.timeLabel || new Date(item.timestamp).toLocaleTimeString(),
    voltage: +item.voltage,
    current: +item.current,
    power: +item.power,
    energy: +item.energy,
    frequency: +item.frequency,
    powerFactor: +item.power_factor || +item.powerFactor || 0.94,
  }));
};

// Fetch latest single telemetry reading from AWS DynamoDB
export const fetchAwsLatestReading = async (
  config: AwsConfig
): Promise<EnergyReading> => {
  if (!config.apiGatewayUrl) {
    throw new Error('AWS API Gateway URL is missing.');
  }

  const endpoint = `${config.apiGatewayUrl.replace(/\/$/, '')}/latest?deviceId=${config.deviceId}`;

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
    throw new Error(`AWS API Gateway HTTP ${response.status}`);
  }

  const item = await response.json();
  return {
    timestamp: item.timestamp || new Date().toISOString(),
    timeLabel: new Date(item.timestamp || Date.now()).toLocaleTimeString(),
    voltage: +item.voltage,
    current: +item.current,
    power: +item.power,
    energy: +item.energy,
    frequency: +item.frequency,
    powerFactor: +item.power_factor || +item.powerFactor || 0.94,
  };
};
