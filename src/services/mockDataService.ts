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

// Base generator for historical data
export const generateHistoricalData = (range: TimeRangeFilter): EnergyReading[] => {
  const data: EnergyReading[] = [];
  const now = new Date();
  let points = 24;
  let intervalMinutes = 60;

  switch (range) {
    case '1H':
      points = 30;
      intervalMinutes = 2;
      break;
    case '6H':
      points = 36;
      intervalMinutes = 10;
      break;
    case '24H':
      points = 24;
      intervalMinutes = 60;
      break;
    case '7D':
      points = 28;
      intervalMinutes = 6 * 60;
      break;
    case '30D':
      points = 30;
      intervalMinutes = 24 * 60;
      break;
  }

  let cumulativeEnergy = 1.05; // Base starting kWh

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const hour = time.getHours();

    // Model realistic peak usage hours (8AM - 11AM and 6PM - 10PM)
    let basePower = 400; // baseline idle load (fridge, router, standby)
    if ((hour >= 7 && hour <= 11) || (hour >= 18 && hour <= 22)) {
      basePower = 1800 + Math.random() * 1200; // Peak cooking/AC hours (1800W - 3000W)
      if (Math.random() > 0.8) basePower += 600; // Occasional spike
    } else if (hour >= 12 && hour <= 17) {
      basePower = 900 + Math.random() * 600; // Midday AC / fans
    } else {
      basePower = 350 + Math.random() * 200; // Night baseline
    }

    const voltage = +(228 + Math.random() * 5).toFixed(1); // 228V - 233V
    const power = +basePower.toFixed(1);
    const current = +(power / (voltage * 0.94)).toFixed(2); // I = P / (V * PF)
    const frequency = +(49.9 + Math.random() * 0.3).toFixed(1);
    const powerFactor = +(0.92 + Math.random() * 0.06).toFixed(2);

    // Increment energy step
    const energyAdded = (power * (intervalMinutes / 60)) / 1000;
    cumulativeEnergy += energyAdded;

    let timeLabel = formatTime(time);
    if (range === '7D' || range === '30D') {
      timeLabel = `${formatDate(time)} ${time.getHours()}:00`;
    }

    data.push({
      timestamp: time.toISOString(),
      timeLabel,
      voltage,
      current,
      power,
      energy: +cumulativeEnergy.toFixed(3),
      frequency,
      powerFactor,
    });
  }

  return data;
};

// Generate realistic daily consumption data for bar chart
export const generateDailyConsumption = (): DailyConsumption[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => {
    const kwh = +(3.5 + Math.random() * 2.8).toFixed(2);
    return {
      day,
      kwh,
      cost: +(kwh * 8.0).toFixed(2),
    };
  });
};

// Initial Alert Logs seed
export const INITIAL_ALERTS: AlertEvent[] = [
  {
    id: 'alt-1',
    severity: 'critical',
    message: 'Power exceeded 3000 W (Peak load detected)',
    timestamp: '10:21 PM',
    value: 3240,
    acknowledged: false,
  },
  {
    id: 'alt-2',
    severity: 'warning',
    message: 'Power exceeded 2000 W (High consumption)',
    timestamp: '09:48 PM',
    value: 2180,
    acknowledged: true,
  },
  {
    id: 'alt-3',
    severity: 'normal',
    message: 'Power returned to normal operating range',
    timestamp: '09:52 PM',
    value: 850,
    acknowledged: true,
  },
  {
    id: 'alt-4',
    severity: 'warning',
    message: 'Voltage dip detected: 218.2 V',
    timestamp: '07:15 PM',
    value: 218.2,
    acknowledged: true,
  },
];

// Generate next simulated reading given current preset
export const generateNextReading = (
  lastReading: EnergyReading,
  preset: LoadPreset = 'normal'
): EnergyReading => {
  const now = new Date();
  let basePower = 530;

  switch (preset) {
    case 'standby':
      basePower = 120 + (Math.random() * 40 - 20); // ~100W - 140W
      break;
    case 'normal':
      basePower = 532.2 + (Math.random() * 80 - 40); // ~500W - 600W
      break;
    case 'heavy':
      basePower = 2450 + (Math.random() * 350 - 175); // ~2300W - 2600W (Warning area)
      break;
    case 'spike':
      basePower = 3180 + (Math.random() * 400 - 200); // ~3000W - 3500W (Critical overload!)
      break;
  }

  const voltage = +(229.5 + (Math.random() * 2 - 1)).toFixed(1);
  const power = Math.max(10, +basePower.toFixed(1));
  const powerFactor = +(0.93 + (Math.random() * 0.03 - 0.015)).toFixed(2);
  const current = +(power / (voltage * powerFactor)).toFixed(2);
  const frequency = +(49.95 + (Math.random() * 0.1 - 0.05)).toFixed(1);
  
  // Energy accumulation (adding 3 seconds worth of kWh)
  const incrementalKwh = (power * (3 / 3600)) / 1000;
  const energy = +(lastReading.energy + incrementalKwh).toFixed(4);

  return {
    timestamp: now.toISOString(),
    timeLabel: formatTime(now),
    voltage,
    current,
    power,
    energy,
    frequency,
    powerFactor,
  };
};
