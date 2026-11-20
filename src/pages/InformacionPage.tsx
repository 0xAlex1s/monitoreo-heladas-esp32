import React from 'react';
import { Info, Cpu, Database, MonitorPlay, Brain, CheckCircle, Snowflake, Activity } from 'lucide-react';

export const InformacionPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <Info className="w-6 h-6 text-blue-500 mr-3" />
          Información del Proyecto
        </h2>
        <p className="text-slate-400 mt-1">Conoce cómo funciona FríoAlerta y cómo ayuda a nuestra comunidad</p>
      </header>

      {/* Intro - What is frost? */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Snowflake className="w-6 h-6 text-blue-400" /> ¿Qué es una helada?
        </h3>
        <p className="text-slate-300 leading-relaxed text-lg">
          Las heladas ocurren cuando la temperatura del ambiente desciende por debajo de los 0 °C. En la región andina, como en Concepción, esto sucede frecuentemente durante las madrugadas de invierno. Este frío extremo congela los líquidos dentro de las plantas, destruyendo los cultivos y afectando gravemente la economía de nuestros agricultores.
        </p>
      </div>

      {/* How it works - How does the sensor work? */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-400" /> ¿Cómo funciona nuestro sensor en el campo?
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          <strong className="text-blue-400 font-semibold">FríoAlerta</strong> utiliza dispositivos inteligentes colocados estratégicamente en las zonas de cultivo. Estos equipos están diseñados para resistir el clima andino y trabajar de forma continua.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <Cpu className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">1. Captura Constante</h4>
            <p className="text-sm text-slate-400">El dispositivo cuenta con un <strong>sistema de toma de tiempo continuo</strong> para evitar pérdidas de señal, midiendo la temperatura y humedad cada 5 minutos sin interrupciones.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <Database className="w-8 h-8 text-green-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">2. Envío Inmediato</h4>
            <p className="text-sm text-slate-400">La información es transmitida mediante un <strong>envío automático de datos en tiempo real mediante red Wi-Fi</strong> hacia nuestra base de datos central, manteniéndola siempre actualizada.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <MonitorPlay className="w-8 h-8 text-purple-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">3. Visualización y Alertas</h4>
            <p className="text-sm text-slate-400">Nuestra plataforma web realiza una <strong>actualización constante desde la base de datos central</strong> para mostrar gráficos en vivo y alertar a los usuarios antes de que ocurra el daño.</p>
          </div>
        </div>
      </div>

      {/* IA Algorithm - Simplified */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-7 h-7 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white">Inteligencia para Prevenir</h3>
        </div>
        <p className="text-slate-300 text-lg mb-6">No solo mostramos la temperatura actual; nuestro sistema aprende y predice el futuro.</p>
        
        <div className="space-y-4">
          <div className="flex space-x-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">1</span>
            <div>
              <h5 className="font-semibold text-slate-200 text-lg">Analizamos el clima</h5>
              <p className="text-slate-400">Observamos qué tan rápido está bajando la temperatura y cuánta humedad hay en el aire.</p>
            </div>
          </div>
          <div className="flex space-x-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">2</span>
            <div>
              <h5 className="font-semibold text-slate-200 text-lg">Proyección a futuro</h5>
              <p className="text-slate-400">El sistema calcula si en las próximas horas llegaremos a temperaturas de congelamiento.</p>
            </div>
          </div>
          <div className="flex space-x-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">3</span>
            <div>
              <h5 className="font-semibold text-slate-200 text-lg">Avisos oportunos</h5>
              <p className="text-slate-400">Si hay riesgo, te enviamos una notificación preventiva para que tengas tiempo de proteger tus cultivos y ganado.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it helps the community */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">¿Cómo ayuda esta plataforma a Concepción?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex space-x-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 transition-all hover:bg-slate-800/60">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-slate-200 text-lg">Cuidamos el trabajo agrícola</h5>
              <p className="text-slate-400">Al saber cuándo ocurrirá una helada, los agricultores pueden encender fogatas controladas, activar aspersores o cubrir sus sembríos.</p>
            </div>
          </div>
          <div className="flex space-x-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 transition-all hover:bg-slate-800/60">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-slate-200 text-lg">Protegemos a los animales</h5>
              <p className="text-slate-400">Permite a los ganaderos resguardar a sus animales en cobertizos antes de que el frío extremo les afecte la salud.</p>
            </div>
          </div>
          <div className="flex space-x-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 transition-all hover:bg-slate-800/60">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-slate-200 text-lg">Información al alcance de todos</h5>
              <p className="text-slate-400">Cualquier persona desde su celular puede ver el estado del clima en tiempo real de su comunidad sin necesidad de equipos costosos.</p>
            </div>
          </div>
          <div className="flex space-x-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 transition-all hover:bg-slate-800/60">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-slate-200 text-lg">Tecnología económica</h5>
              <p className="text-slate-400">Utilizamos componentes accesibles para que el sistema pueda replicarse fácilmente en otras comunidades que lo necesiten.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
