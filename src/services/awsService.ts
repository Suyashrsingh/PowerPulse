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
      if (parsed && typeof parsed.apiGatewayUrl === 'string' && parsed.apiGatewayUrl.trim() !== '') {
        return {
          ...DEFAULT_AWS_CONFIG,
          ...parsed,
        };
      }
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
  const list = Array.isArray(data) ? data : data.readings || data.items || data.value || [];
  
  return list.map((item: any) => {
    const tsNum = Number(item.timestamp);
    const tsDate = !isNaN(tsNum) && tsNum > 0 ? new Date(tsNum) : new Date(item.timestamp || Date.now());
    let v = Number(item.voltage) || 0;
    const p = Number(item.power) || 0;
    const c = Number(item.current) || 0;
    if (v === 0 && (p > 0 || c > 0)) {
      v = c > 0 ? Number((p / c).toFixed(1)) : 230.0;
    }
    return {
      timestamp: !isNaN(tsNum) && tsNum > 0 ? tsDate.toISOString() : (item.timestamp || new Date().toISOString()),
      timeLabel: item.timeLabel || tsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voltage: v,
      current: c,
      power: p,
      energy: Number(item.energy) || 0,
      frequency: Number(item.frequency) || (v > 0 || p > 0 ? 50.0 : 0),
      powerFactor: Number(item.power_factor ?? item.powerFactor ?? 0.95),
    };
  });
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
  
  const tsNum = Number(reading.timestamp);
  const tsDate = !isNaN(tsNum) && tsNum > 0 ? new Date(tsNum) : new Date(reading.timestamp || Date.now());

  let v = Number(reading.voltage) || 0;
  const p = Number(reading.power) || 0;
  const c = Number(reading.current) || 0;
  if (v === 0 && (p > 0 || c > 0)) {
    v = c > 0 ? Number((p / c).toFixed(1)) : 230.0;
  }

  return {
    timestamp: !isNaN(tsNum) && tsNum > 0 ? tsDate.toISOString() : (reading.timestamp || new Date().toISOString()),
    timeLabel: tsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voltage: v,
    current: c,
    power: p,
    energy: Number(reading.energy) || 0,
    frequency: Number(reading.frequency) || (v > 0 || p > 0 ? 50.0 : 0),
    powerFactor: Number(reading.power_factor ?? reading.powerFactor ?? 0.95),
  };
};
