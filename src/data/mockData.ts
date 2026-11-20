import { subMinutes } from 'date-fns';

export const SENSOR_ID = 'S01';
const INTERVAL_MIN = 5;

export function generateTemps(count: number): number[] {
  const temps: number[] = [];
  const now = new Date();
  const esMesHelada = [5, 6, 7].includes(now.getMonth());
  const baseMin = esMesHelada ? -3 : 2;
  const baseMax = esMesHelada ? 16 : 21;
  const amplitud = (baseMax - baseMin) / 2;
  const centro = (baseMax + baseMin) / 2;
  
  for (let i = count - 1; i >= 0; i--) {
    const pastDate = subMinutes(now, i * INTERVAL_MIN);
    const hourOfDay = pastDate.getHours() + pastDate.getMinutes() / 60;
    const dayIndex = Math.floor(i / (24 * 60 / INTERVAL_MIN));
    const cycleTemp = centro - amplitud * Math.cos(((hourOfDay - 4) * 2 * Math.PI) / 24);
    const dayVariation = Math.sin(dayIndex * 1.7 + 2.3) * 1.5;
    const noise = Math.sin(i * 17.3 + 5.4) * 0.6;
    temps.push(parseFloat((cycleTemp + dayVariation + noise).toFixed(1)));
  }
  return temps;
}

export function generateMockData(count: number = 24) {
  const temps = generateTemps(count);
  const data = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const pastDate = subMinutes(now, i * INTERVAL_MIN);
    // humidity slightly inversely proportional to temp
    const temp = temps[count - 1 - i];
    const humidity = Math.min(100, Math.max(30, 85 - (temp * 1.5) + (Math.random() * 10 - 5)));
    
    data.push({
      timestamp: pastDate.toISOString(),
      temperature: temp,
      humidity: parseFloat(humidity.toFixed(1))
    });
  }
  
  return data;
}
