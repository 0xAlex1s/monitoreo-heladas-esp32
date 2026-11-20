import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSheetData } from '../hooks/useSheetData';
import { MapPin, Layers, Activity } from 'lucide-react';

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const center: [number, number] = [-11.917, -75.317];

const SIG_MAPS = [
  {
    id: 'climatica',
    label: 'Clasificación Climática',
    src: '/img/Mapa de clasificacion climatica.jpg',
    description: 'Mapa de vulnerabilidad climática de la provincia de Concepción. Elaborado por la Universidad Continental, Proyección UTM Zona 18s, Datum WGS84, Escala 1:500,000.',
    legend: [
      { color: '#dbeafe', label: '1 — Muy Bajo' },
      { color: '#93c5fd', label: '2 — Bajo' },
      { color: '#60a5fa', label: '3 — Medio' },
      { color: '#7c3aed', label: '4 — Alto' },
      { color: '#1e1b4b', label: '5 — Muy Alto' },
    ],
  },
  {
    id: 'poblados',
    label: 'Centros Poblados',
    src: '/img/Mapa de proximidad a los centros poblados.jpg',
    description: 'Mapa de proximidad a los centros poblados de Concepción. Elaborado por la Universidad Continental, Proyección UTM Zona 18s, Datum WGS84, Escala 1:500,000.',
    legend: [
      { color: '#fef08a', label: '1 — Muy baja >2000m' },
      { color: '#84cc16', label: '2 — Baja (1500-2000)m' },
      { color: '#14b8a6', label: '3 — Media (1000-1500)m' },
      { color: '#22d3ee', label: '4 — Alta (500-1000)m' },
      { color: '#e879f9', label: '5 — Muy alta (0-500)m' },
    ],
  },
  {
    id: 'pendientes',
    label: 'Mapa de Pendientes',
    src: '/img/Mapa de Pendientes.jpg',
    description: 'Mapa de pendientes del terreno en la provincia de Concepción. Elaborado por la Universidad Continental, Proyección UTM Zona 18s, Datum WGS84, Escala 1:500,000.',
    legend: [
      { color: '#15803d', label: '1 — Pendiente (0-7)%' },
      { color: '#a3e635', label: '2 — Pendiente (7-12)%' },
      { color: '#fde047', label: '3 — Pendiente (12-25)%' },
      { color: '#fb923c', label: '4 — Pendiente (25-75)%' },
      { color: '#ef4444', label: '5 — Pendiente >75%' },
    ],
  },
];

type MapTab = 'live' | 'climatica' | 'poblados' | 'pendientes';

export const MapaPage: React.FC = () => {
  const { data } = useSheetData();
  const [activeTab, setActiveTab] = useState<MapTab>('live');
  const currentData = data[data.length - 1] || { temperature: 0, humidity: 0 };
  const tempDisplay = currentData.temperature > 0 ? `+${currentData.temperature.toFixed(1)}` : currentData.temperature.toFixed(1);

  let riskColorHex = '#22c55e';
  let riskBgClass = 'bg-green-500';
  let riskTextClass = 'text-green-400';
  if (currentData.temperature <= -3) { riskColorHex = '#ef4444'; riskBgClass = 'bg-red-500'; riskTextClass = 'text-red-400'; }
  else if (currentData.temperature <= 0) { riskColorHex = '#f97316'; riskBgClass = 'bg-orange-500'; riskTextClass = 'text-orange-400'; }
  else if (currentData.temperature <= 4) { riskColorHex = '#eab308'; riskBgClass = 'bg-yellow-500'; riskTextClass = 'text-yellow-400'; }

  const customIcon = useMemo(() => L.divIcon({
    html: `<div style="background:${riskColorHex};color:white;border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;border:3px solid rgba(255,255,255,0.85);box-shadow:0 0 18px ${riskColorHex}90;">${tempDisplay}°</div>`,
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  }), [riskColorHex, tempDisplay]);

  const activeSigMap = useMemo(() => SIG_MAPS.find(m => m.id === activeTab), [activeTab]);

  return (
    <div className="space-y-4 flex flex-col h-full">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-tight">Mapas SIG</h2>
        <p className="text-slate-400 mt-1 text-sm">Sistema de Información Geográfica — Concepción, Junín</p>
      </header>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-800 pb-0">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === 'live' ? 'bg-white/5 border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
        >
          <Activity className="w-4 h-4" />
          <span>Sensor en Tiempo Real</span>
        </button>
        {SIG_MAPS.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id as MapTab)}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === m.id ? 'bg-white/5 border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            <Layers className="w-4 h-4" />
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Live Map */}
      {activeTab === 'live' && (
        <>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6">
            {[
              { color: 'bg-green-500', label: 'Sin Riesgo (>4°C)' },
              { color: 'bg-yellow-500', label: 'Precaución (0–4°C)' },
              { color: 'bg-orange-500', label: 'Alerta Helada (<0°C)' },
              { color: 'bg-red-500', label: 'Helada Severa (<-3°C)' },
            ].map(item => (
              <div key={item.label} className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-full ${item.color}`}></div>
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel p-2 flex-1 rounded-2xl overflow-hidden min-h-[380px] border border-slate-700/50 shadow-2xl relative z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1rem' }} scrollWheelZoom={true}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={center} icon={customIcon}>
                <Popup><strong>Estación S01 — Concepción</strong><br />Temp: {tempDisplay}°C | Hum: {currentData.humidity.toFixed(0)}%</Popup>
              </Marker>
              <Circle center={center} pathOptions={{ color: riskColorHex, fillColor: riskColorHex, fillOpacity: 0.15, weight: 1 }} radius={1200} />
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            <div className="glass-panel p-5 rounded-2xl flex justify-between items-center border border-slate-700/50">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${riskBgClass}`}></div>
                <div>
                  <h3 className="font-bold text-white">S01</h3>
                  <p className="text-xs text-slate-500">Lat: {center[0]} — Lng: {center[1]}</p>
                  <p className="text-sm text-slate-400 mt-0.5">Concepción, Junín</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${riskTextClass}`}>{tempDisplay}°C</p>
                <p className="text-sm text-slate-400">{currentData.humidity.toFixed(0)}% hum.</p>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/50">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-3">HARDWARE DEL SISTEMA</h4>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-slate-400">Microcontrolador:</span> <span className="text-blue-400 font-medium">ESP32</span></p>
                <p><span className="text-slate-400">Sensor:</span> <span className="text-blue-400 font-medium">DHT11 (Temperatura + Humedad)</span></p>
                <p><span className="text-slate-400">Intervalo:</span> <span className="text-blue-400 font-medium">cada 5 minutos</span></p>
                <p><span className="text-slate-400">Almacenamiento:</span> <span className="text-blue-400 font-medium">Google Sheets (Apps Script)</span></p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Static SIG Maps */}
      {activeTab !== 'live' && activeSigMap && (
        <div className="flex flex-col gap-4 pb-4">
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
            {activeSigMap.src ? (
              <img
                src={activeSigMap.src}
                alt={activeSigMap.label}
                className="w-full h-auto object-contain bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-800/50">
                <MapPin className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400 font-medium">{activeSigMap.label}</p>
                <p className="text-slate-500 text-sm mt-2 max-w-sm text-center">
                  Añade la imagen a la carpeta <code className="bg-slate-700 px-1 rounded text-blue-300">public/</code> del proyecto con el nombre correspondiente para visualizarla aquí.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/50">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-3">LEYENDA</h4>
              <div className="space-y-2">
                {activeSigMap.legend.map(item => (
                  <div key={item.label} className="flex items-center space-x-3">
                    <div className="w-5 h-4 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/50">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-3">FICHA TÉCNICA</h4>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-300 leading-relaxed">{activeSigMap.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-1">
                  <p><span className="text-slate-400">Elaborado por:</span> <span className="text-slate-200">Ponce Ramos Clisman J. / Zacarías Arauco Nicole D.</span></p>
                  <p><span className="text-slate-400">Revisado por:</span> <span className="text-slate-200">ING. José Vladimir Cornejo Tueros</span></p>
                  <p><span className="text-slate-400">Fecha:</span> <span className="text-slate-200">12/11/2023</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
