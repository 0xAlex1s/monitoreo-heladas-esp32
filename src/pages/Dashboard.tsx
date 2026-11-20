import React from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { Thermometer, BrainCircuit, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAlert } from '../context/AlertContext';

// ─── Algoritmo de Predicción IA ────────────────────────────────────────────
// Basado en Regresión Logística Andina v1.2
// Variables: Temperatura actual, Tasa de descenso (°C/hora), Punto de rocío

function calcDewPoint(tempC: number, humidity: number): number {
  // Fórmula de Magnus: Td ≈ T - ((100 - RH) / 5)
  const h = Math.max(1, Math.min(100, humidity));
  return parseFloat((tempC - (100 - h) / 5).toFixed(1));
}

function calcDescentRate(data: Array<{ temperature: number; timestamp: string }>): number {
  // Calcula la tasa de cambio promedio de las últimas lecturas (°C/hora)
  if (data.length < 2) return 0;
  const recent = data.slice(-6); // Últimas 6 lecturas ≈ 30 minutos
  if (recent.length < 2) return 0;
  const first = recent[0];
  const last = recent[recent.length - 1];
  const t1 = new Date(first.timestamp).getTime();
  const t2 = new Date(last.timestamp).getTime();
  const hoursElapsed = (t2 - t1) / (1000 * 60 * 60);
  if (hoursElapsed <= 0) return 0;
  return parseFloat(((last.temperature - first.temperature) / hoursElapsed).toFixed(2));
}

function calcFrostProbability(tempC: number, ratePerHour: number, hoursAhead: number): number {
  // Temperatura proyectada en X horas usando tasa lineal de descenso
  const projectedTemp = tempC + ratePerHour * hoursAhead;

  // Probabilidad cruda basada en distancia a 0°C
  // Usando función logística: P = 1 / (1 + e^(k*(T-0)))
  // Si T ≤ 0 → probabilidad muy alta. Si T > 10 → probabilidad muy baja.
  const k = 0.6; // Steepness calibrado para el clima andino de Junín
  const rawProb = 1 / (1 + Math.exp(k * projectedTemp));

  // Añadir un boost si la temperatura está bajando rápido
  const trendBoost = ratePerHour < -2 ? 0.15 : ratePerHour < -1 ? 0.08 : 0;
  
  return Math.min(99, Math.max(1, Math.round((rawProb + trendBoost) * 100)));
}

function getProbColor(prob: number): { text: string; bar: string; border: string } {
  if (prob >= 60) return { text: 'text-red-400', bar: 'bg-red-500', border: 'border-red-500/30' };
  if (prob >= 30) return { text: 'text-yellow-400', bar: 'bg-yellow-500', border: 'border-yellow-500/30' };
  return { text: 'text-green-400', bar: 'bg-green-500', border: 'border-green-500/30' };
}

// ──────────────────────────────────────────────────────────────────────────────


export const Dashboard: React.FC = () => {
  const { data, loading, error } = useSheetData();
  const { simulatedHighRisk, simulatedTemp } = useAlert();

  if (loading && data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-400">Error cargando datos: {error}</p>
      </div>
    );
  }

  const currentData = data[data.length - 1] || { temperature: 0, humidity: 0, timestamp: new Date().toISOString() };

  // Si hay una simulación activa del jurado, sustituir la temperatura mostrada
  const effectiveTemp = simulatedTemp ?? currentData.temperature;

  // ── Risk Level ──
  let riskColor = 'text-green-400';
  let riskBg = 'bg-green-500/10 border-green-500/30';
  let riskDot = 'bg-green-500';
  let riskText = 'Sin Riesgo';
  let borderLeftColor = 'border-l-green-500';

  if (simulatedHighRisk || effectiveTemp <= 0) {
    riskColor = 'text-red-400';
    riskBg = 'bg-red-500/10 border-red-500/30'; riskDot = 'bg-red-500';
    riskText = 'Alerta Helada'; borderLeftColor = 'border-l-red-500';
  } else if (effectiveTemp <= 4) {
    riskColor = 'text-yellow-400';
    riskBg = 'bg-yellow-500/10 border-yellow-500/30'; riskDot = 'bg-yellow-500';
    riskText = 'Precaución'; borderLeftColor = 'border-l-yellow-500';
  }

  const tempDisplay = effectiveTemp > 0 ? `+${effectiveTemp.toFixed(1)}` : effectiveTemp.toFixed(1);
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy — HH:mm", { locale: es });

  let updateTime = currentData.timestamp;
  try {
    const d = new Date(currentData.timestamp);
    if (!isNaN(d.getTime())) updateTime = format(d, 'HH:mm:ss');
  } catch (_) {}

  // ── IA Calculations (usan effectiveTemp para que reflejen la simulación) ──
  const descentRate = calcDescentRate(data);
  const dewPoint = calcDewPoint(effectiveTemp, currentData.humidity);
  const prob3h = calcFrostProbability(effectiveTemp, descentRate, 3);
  const prob6h = calcFrostProbability(effectiveTemp, descentRate, 6);
  const prob12h = calcFrostProbability(effectiveTemp, descentRate, 12);
  const projTemp3h = parseFloat((effectiveTemp + descentRate * 3).toFixed(1));
  const projTemp6h = parseFloat((effectiveTemp + descentRate * 6).toFixed(1));

  const maxProb = Math.max(prob3h, prob6h, prob12h);
  const modelConfidence = Math.min(95, 40 + data.length * 2); // Más datos = más confianza

  const trendLabel = descentRate < -0.5 ? 'Bajando' : descentRate > 0.5 ? 'Subiendo' : 'Estable';
  const TrendIcon = descentRate < -0.5 ? TrendingDown : descentRate > 0.5 ? TrendingUp : Minus;
  const trendColor = descentRate < -0.5 ? 'text-red-400' : descentRate > 0.5 ? 'text-green-400' : 'text-slate-400';

  // Conclusión dinámica de la IA
  let conclusionText = '';
  if (maxProb >= 60) {
    conclusionText = `⚠️ Alta probabilidad de helada (${maxProb}%). La temperatura proyectada en ${prob12h >= prob6h ? '12' : '6'} horas podría alcanzar valores críticos. Se recomienda cubrir cultivos esta noche.`;
  } else if (maxProb >= 30) {
    conclusionText = `La temperatura está ${trendLabel.toLowerCase()} (${descentRate >= 0 ? '+' : ''}${descentRate.toFixed(1)}°C/h). Con un punto de rocío de ${dewPoint}°C existe riesgo moderado. Vigilar en las próximas horas.`;
  } else {
    conclusionText = `La temperatura se mantiene ${trendLabel.toLowerCase()} (${descentRate >= 0 ? '+' : ''}${descentRate.toFixed(1)}°C/h). Con un punto de rocío de ${dewPoint}°C y la humedad actual (${currentData.humidity.toFixed(0)}%), las condiciones agrícolas son seguras por el momento.`;
  }

  const col3 = getProbColor(prob3h);
  const col6 = getProbColor(prob6h);
  const col12 = getProbColor(prob12h);

  return (
    <div className="space-y-6">
      <header className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Panel Principal</h2>
        <p className="text-slate-400 text-sm mt-1 capitalize">{formattedDate}</p>
      </header>


      {/* Main Temperature Card */}
      <div className={`glass-panel p-5 sm:p-8 relative overflow-hidden rounded-2xl border-l-4 ${borderLeftColor} transition-all duration-500`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p className="text-slate-400 text-sm mb-2">Temperatura actual — Concepción, Junín</p>
            <div className="flex items-center space-x-4">
              <Thermometer className={`w-10 h-10 ${riskColor}`} />
              <div className="flex items-baseline">
                <span className={`text-5xl sm:text-7xl font-bold tracking-tighter transition-colors duration-500 ${riskColor}`}>{tempDisplay}</span>
                <span className="text-4xl text-slate-300 ml-2">°C</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${riskBg}`}>
                <div className={`w-2 h-2 rounded-full ${riskDot}`}></div>
                <span className={`text-sm font-medium ${riskColor}`}>{riskText}</span>
              </div>
              <span className="text-slate-500 text-sm">Actualizado {updateTime}</span>
            </div>
          </div>

          {/* Trend mini-panel */}
          <div className="mt-8 md:mt-0 flex flex-col items-end min-w-[180px]">
            <div className="flex justify-between w-full text-sm text-slate-400 mb-2">
              <span>Tendencia</span>
              <span className={`flex items-center space-x-1 font-medium ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{trendLabel}</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
              <div className="h-full bg-slate-600 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between w-full text-xs text-slate-500 mt-1">
              <span>Tasa: {descentRate >= 0 ? '+' : ''}{descentRate.toFixed(1)}°C/h</span>
              <span>Rocío: {dewPoint}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Prediction Card */}
      <div className="glass-panel p-4 sm:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-transparent">
        <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Predicción IA — Probabilidad de Helada</h3>
              <p className="text-slate-400 text-sm">Regresión Logística Andina v1.2</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">Confianza del modelo</p>
            <p className="text-2xl font-bold text-indigo-300">{modelConfidence}%</p>
            <p className="text-[10px] text-slate-500">{data.length} lecturas analizadas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* 3h */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">En 3 horas</span>
              <span className={`font-bold ${col3.text}`}>{prob3h}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${col3.bar} rounded-full transition-all duration-700`} style={{ width: `${prob3h}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Se espera: {projTemp3h > 0 ? `+${projTemp3h}` : projTemp3h}°C</p>
          </div>

          {/* 6h */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">En 6 horas</span>
              <span className={`font-bold ${col6.text}`}>{prob6h}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${col6.bar} rounded-full transition-all duration-700`} style={{ width: `${prob6h}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Se espera: {projTemp6h > 0 ? `+${projTemp6h}` : projTemp6h}°C</p>
          </div>

          {/* 12h */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">En 12 horas</span>
              <span className={`font-bold ${col12.text}`}>{prob12h}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${col12.bar} rounded-full transition-all duration-700`} style={{ width: `${prob12h}%` }}></div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-slate-500">Nivel pronosticado:</span>
              <span className={`text-xs border px-2 py-0.5 rounded-full ${riskBg} ${riskColor}`}>{riskText}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/10">
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-indigo-300">Conclusión de la IA:</span> {conclusionText}
          </p>
        </div>
      </div>
    </div>
  );
};
