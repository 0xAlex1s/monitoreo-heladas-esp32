import React, { useState } from 'react';
import { BookOpen, Snowflake, Thermometer, ChevronDown, ChevronUp, Radio } from 'lucide-react';

export const EducativaPage: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(0);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <BookOpen className="w-6 h-6 text-green-500 mr-3" />
          Sección Educativa
        </h2>
        <p className="text-slate-400 mt-1">Aprende a identificar heladas y frío extremo en Concepción, Junín</p>
      </header>

      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl border border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center mb-2">
            <Snowflake className="w-6 h-6 text-blue-400 mr-3" />
            ¿Qué es una helada?
          </h3>
          <p className="text-slate-400 text-sm mb-6 ml-9">Definición y tipos según el clima andino de Junín</p>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Una <strong>helada</strong> ocurre cuando la temperatura del aire desciende por debajo de los <strong>0°C</strong>. 
            En Concepción, ubicada a ~3,250 m s.n.m., las heladas son frecuentes durante el invierno austral (mayo–agosto), 
            cuando el cielo despejado permite que el calor de la Tierra se escape hacia la atmósfera en la noche.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface/50 border border-slate-700 p-4 rounded-xl text-center flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-yellow-500 mb-1">≤ 4°C</span>
              <span className="text-sm font-medium text-slate-200">Riesgo agronómico</span>
              <span className="text-xs text-slate-500 mt-1">Cultivos sensibles en peligro</span>
            </div>
            <div className="bg-surface/50 border border-slate-700 p-4 rounded-xl text-center flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-orange-400 mb-1">≤ 0°C</span>
              <span className="text-sm font-medium text-slate-200">Helada meteorológica</span>
              <span className="text-xs text-slate-500 mt-1">Temperatura del aire bajo cero</span>
            </div>
            <div className="bg-surface/50 border border-slate-700 p-4 rounded-xl text-center flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-red-400 mb-1">&lt; -2°C</span>
              <span className="text-sm font-medium text-slate-200">Frío extremo</span>
              <span className="text-xs text-slate-500 mt-1">Daños severos en cultivos</span>
            </div>
            <div className="bg-surface/50 border border-slate-700 p-4 rounded-xl text-center flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-red-600 mb-1">&lt; -5°C</span>
              <span className="text-sm font-medium text-slate-200">Helada severa</span>
              <span className="text-xs text-slate-500 mt-1">Pérdidas totales posibles</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
              <button onClick={() => toggleRow(0)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="font-medium text-white flex items-center"><Thermometer className="w-4 h-4 text-pink-400 mr-2"/> Helada meteorológica</span>
                {expandedRow === 0 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedRow === 0 && (
                <div className="p-4 bg-transparent border-t border-slate-700/50 text-sm text-slate-300">
                  Se produce cuando la temperatura del aire, medida a 1.5 m del suelo (estación meteorológica estándar), desciende a 0°C o menos. Es el tipo registrado por nuestro sensor ESP32+DHT11.
                </div>
              )}
            </div>
            
            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
              <button onClick={() => toggleRow(1)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="font-medium text-white flex items-center"><span className="text-green-400 mr-2 text-lg leading-none">🌱</span> Helada agronómica</span>
                {expandedRow === 1 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedRow === 1 && (
                <div className="p-4 bg-transparent border-t border-slate-700/50 text-sm text-slate-300">
                  Ocurre cuando la temperatura desciende al punto crítico donde los tejidos vegetales sufren daño irreversible. Para algunos cultivos, esto puede suceder incluso a temperaturas positivas (ej. 2°C).
                </div>
              )}
            </div>

            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
              <button onClick={() => toggleRow(2)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="font-medium text-white flex items-center"><Snowflake className="w-4 h-4 text-blue-300 mr-2"/> Helada de superficie (escarcha)</span>
                {expandedRow === 2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedRow === 2 && (
                <div className="p-4 bg-transparent border-t border-slate-700/50 text-sm text-slate-300">
                  Se forma cuando el vapor de agua en el aire se congela directamente sobre superficies frías (hojas, pasto, suelo). Es visible como cristales de hielo blancos.
                </div>
              )}
            </div>

            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
              <button onClick={() => toggleRow(3)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="font-medium text-white flex items-center"><span className="text-slate-400 mr-2 text-lg leading-none">🧊</span> Helada negra (black frost)</span>
                {expandedRow === 3 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedRow === 3 && (
                <div className="p-4 bg-transparent border-t border-slate-700/50 text-sm text-slate-300">
                  Ocurre con baja humedad ambiental. La temperatura cae bajo cero pero no se forma escarcha visible. El hielo se forma dentro de las plantas, rompiendo sus células y dejándolas con un aspecto negro o quemado. Es la más destructiva.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center mb-6">
            <Thermometer className="w-6 h-6 text-yellow-500 mr-3" />
            ¿Por qué ocurren heladas en Concepción?
          </h3>
          
          <p className="text-slate-300 text-sm mb-6">
            Concepción se encuentra en el <strong>Valle del Mantaro</strong>, un entorno rodeado de montañas donde el aire frío se acumula en las noches despejadas del invierno. Los factores que favorecen las heladas locales son:
          </p>

          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-bold text-blue-400">Altitud:</span>
              <span className="text-slate-300">~3,250 m s.n.m. — el aire es más delgado y se enfría más rápidamente</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-bold text-blue-400">Cielo despejado:</span>
              <span className="text-slate-300">Sin nubes, la radiación de la Tierra escapa libremente al espacio</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-bold text-blue-400">Vientos calmados:</span>
              <span className="text-slate-300">El viento mezclaría el aire; sin él, el frío se acumula en el suelo</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-bold text-blue-400">Baja humedad:</span>
              <span className="text-slate-300">El invierno en Junín es la temporada seca, lo que facilita el enfriamiento</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-bold text-blue-400">Inversión térmica:</span>
              <span className="text-slate-300">El aire frío (más pesado) queda atrapado en el valle</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/30 to-transparent">
          <h3 className="text-xl font-bold text-white flex items-center mb-2">
            <Radio className="w-6 h-6 text-red-400 mr-3" />
            Disparo por Sensor (En vivo con la placa)
          </h3>
          <p className="text-slate-400 text-sm mb-6 ml-9">Cómo se activa la alerta durante la exposición</p>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            El ESP32 envía temperatura cada pocos segundos a Google Sheets. Esta app lee esos datos en vivo.
            Si la placa registra <strong>0 °C o menos</strong>, el sistema pasa a <strong>riesgo Alto</strong> (pantalla en rojo)
            y dispara una notificación en el celular o la laptop.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Para la feria no hace falta depender solo de congelar el sensor: en el panel principal o en Notificaciones
            está el botón <strong>Simular Predicción de Helada (IA)</strong>, que muestra el mismo efecto con el mensaje
            de proyección meteorológica a las 03:00 AM.
          </p>
        </div>
      </div>
    </div>
  );
};
