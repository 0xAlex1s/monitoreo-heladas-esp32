import React from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { Thermometer, Activity, ArrowDownRight, ArrowUpRight, Snowflake } from 'lucide-react';

export const MonitoreoPage: React.FC = () => {
  const { data } = useSheetData();
  
  const currentData = data[data.length - 1] || { temperature: 0, humidity: 0, timestamp: new Date().toISOString() };
  
  // Risk logic
  let riskColor = 'text-green-400';
  let riskBg = 'bg-green-500/10 border-green-500/30';
  let riskDot = 'bg-green-500';
  let riskText = 'Sin Riesgo';
  
  if (currentData.temperature <= 0) {
    riskColor = 'text-red-400';
    riskBg = 'bg-red-500/10 border-red-500/30';
    riskDot = 'bg-red-500';
    riskText = 'Alerta Helada';
  } else if (currentData.temperature <= 4) {
    riskColor = 'text-yellow-400';
    riskBg = 'bg-yellow-500/10 border-yellow-500/30';
    riskDot = 'bg-yellow-500';
    riskText = 'Precaución';
  }

  const tempDisplay = currentData.temperature > 0 ? `+${currentData.temperature.toFixed(1)}` : currentData.temperature.toFixed(1);
  
  // Safe time formatting
  let updateTime = currentData.timestamp;
  try {
    const d = new Date(currentData.timestamp);
    if (!isNaN(d.getTime())) {
      updateTime = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  } catch (e) {
    // Keep raw string
  }

  // Calculate stats
  const temps = data.map(d => d.temperature).filter(t => !isNaN(t));
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const avgTemp = temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length) : 0;
  
  const freezeCount = temps.filter(t => t <= 0).length;
  const freezePercentage = temps.length > 0 ? Math.round((freezeCount / temps.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Monitoreo en Tiempo Real</h2>
        <p className="text-slate-400 text-sm mt-1">Panel de control de temperatura y riesgo de heladas</p>
      </header>

      {/* Main Large Card */}
      <div className="glass-panel p-10 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 text-sm mb-4">Concepción, Junín — Temperatura actual</p>
        
        <div className="flex items-center justify-center space-x-6 mb-6">
          <Thermometer className={`w-12 h-12 ${riskColor}`} />
          <div className="flex items-baseline">
            <span className={`text-6xl sm:text-8xl font-bold tracking-tighter ${riskColor}`}>{tempDisplay}</span>
            <span className="text-5xl text-slate-400 ml-2">°C</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border ${riskBg}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${riskDot}`}></div>
            <span className={`text-sm font-bold ${riskColor}`}>{riskText}</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">—</span>
          <span className="text-slate-400 text-sm">Tendencia: <strong className="text-slate-200">Estable</strong></span>
          <span className="text-slate-500 text-sm flex items-center"><Activity className="w-3 h-3 mr-1"/> {updateTime}</span>
        </div>
      </div>

      {/* Stats Row */}
      <h3 className="text-lg font-bold text-white flex items-center pt-2">
        <Activity className="w-5 h-5 text-blue-400 mr-2" />
        Estadísticas últimas 24h
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Min */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 bg-surface/50">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperatura Mínima</p>
            <div className="p-1 bg-blue-500/10 rounded">
              <ArrowDownRight className="w-3 h-3 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400 mb-1">{minTemp > 0 ? `+${minTemp.toFixed(1)}` : minTemp.toFixed(1)} <span className="text-sm font-normal text-slate-500">°C</span></p>
          <p className="text-xs text-slate-500">{minTemp <= 0 ? 'Helada registrada' : 'Sin helada'}</p>
        </div>
        
        {/* Max */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 bg-surface/50">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperatura Máxima</p>
            <div className="p-1 bg-green-500/10 rounded">
              <ArrowUpRight className="w-3 h-3 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-400 mb-1">{maxTemp > 0 ? `+${maxTemp.toFixed(1)}` : maxTemp.toFixed(1)} <span className="text-sm font-normal text-slate-500">°C</span></p>
        </div>

        {/* Avg */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 bg-surface/50">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperatura Promedio</p>
            <div className="p-1 bg-slate-500/10 rounded">
              <Thermometer className="w-3 h-3 text-slate-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-200 mb-1">{avgTemp > 0 ? `+${avgTemp.toFixed(1)}` : avgTemp.toFixed(1)} <span className="text-sm font-normal text-slate-500">°C</span></p>
        </div>

        {/* Freeze Time */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 bg-surface/50">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiempo &lt; 0°C</p>
            <div className="p-1 bg-cyan-500/10 rounded">
              <Snowflake className="w-3 h-3 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-400 mb-1">{freezePercentage}<span className="text-sm font-normal text-slate-500">%</span></p>
          <p className="text-xs text-slate-500">del periodo con helada</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-40 flex flex-col justify-between relative">
        <div className="flex justify-between items-center mb-4 text-sm font-bold text-white">
          <span>Curva de temperatura — últimas 24h</span>
          <span className="text-xs font-normal text-slate-500">{data.length} lecturas</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-slate-600 text-xs">Sin datos</span>
        </div>
        <div className="flex justify-between w-full text-[10px] text-slate-500 uppercase tracking-wider">
          <span>24h atrás</span>
          <span>Ahora</span>
        </div>
      </div>

      {/* Sensor Status */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface/30">
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Estado por sensor</h4>
            <p className="text-xs text-slate-400 mt-1">Concepción, Junín <br/> <span className="text-slate-500">S01 - {updateTime}</span></p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-bold text-green-400 text-lg">{tempDisplay}°C</span>
          <span className="px-2 py-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 rounded-md">Sin Riesgo</span>
        </div>
      </div>
    </div>
  );
};
