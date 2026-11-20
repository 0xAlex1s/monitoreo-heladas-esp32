import React from 'react';
import { Wrench } from 'lucide-react';

export const TecnicoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Wrench className="w-8 h-8 text-slate-400" />
          Panel Técnico
        </h2>
        <p className="text-slate-400">Configuración de sensores y calibración</p>
      </header>

      <div className="glass-panel p-8 text-center text-slate-300">
        <p>Área restringida para administradores del sistema.</p>
        <p className="mt-2 text-sm text-slate-500">Estado de batería de sensores, latencia de red, y calibración de umbrales.</p>
      </div>
    </div>
  );
};
