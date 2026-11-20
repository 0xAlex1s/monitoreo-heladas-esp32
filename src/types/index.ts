export interface SensorData {
  timestamp: string; // ISO String or display string
  temperature: number;
  humidity: number;
}

export type RiskLevel = 'Bajo' | 'Moderado' | 'Alto';
