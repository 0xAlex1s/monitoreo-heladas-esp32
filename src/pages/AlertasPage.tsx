import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const AlertasPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-tight">Centro de Alertas</h2>
        <p className="text-slate-400 mt-1">Alertas generadas automáticamente por los sensores</p>
      </header>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 flex flex-col items-center justify-center rounded-2xl border-b-4 border-b-slate-600 bg-surface/50">
          <span className="text-3xl font-bold text-white mb-2">0</span>
          <span className="text-sm text-slate-400">Total</span>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center rounded-2xl border-b-4 border-b-red-500 bg-surface/50">
          <span className="text-3xl font-bold text-red-400 mb-2">0</span>
          <span className="text-sm text-slate-400">Activas</span>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center rounded-2xl border-b-4 border-b-green-500 bg-surface/50">
          <span className="text-3xl font-bold text-green-400 mb-2">0</span>
          <span className="text-sm text-slate-400">Reconocidas</span>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center rounded-2xl border-b-4 border-b-purple-500 bg-surface/50">
          <span className="text-3xl font-bold text-purple-400 mb-2">0</span>
          <span className="text-sm text-slate-400">Extremas</span>
        </div>
      </div>

      {/* Alertas Activas Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
          Alertas Activas
        </h3>
        
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-700/50">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/30">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h4 className="text-xl font-medium text-white mb-2">Sin alertas activas</h4>
          <p className="text-slate-400">Las condiciones actuales no representan riesgo de helada.</p>
        </div>
      </div>
    </div>
  );
};
