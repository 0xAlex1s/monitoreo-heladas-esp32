import React, { useMemo } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';

export const HistorialPage: React.FC = () => {
  const { data, loading } = useSheetData();

  const formattedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      timeString: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }, [data]);

  if (loading && data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold">Historial y Análisis</h2>
        <p className="text-slate-400">Tendencias de las últimas 24 horas</p>
      </header>

      <div className="flex-1 grid grid-cols-1 gap-6 min-h-[400px]">
        {/* Main Temperature Chart */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-xl font-bold text-slate-200 mb-6">Evolución de Temperatura</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="timeString" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <ReferenceLine y={0} label="Congelamiento (0°C)" stroke="#ef4444" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperatura (°C)" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-xl font-bold text-slate-200 mb-6">Evolución de Humedad</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="timeString" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <Line type="monotone" dataKey="humidity" stroke="#06b6d4" name="Humedad (%)" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
