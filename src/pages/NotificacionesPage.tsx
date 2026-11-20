import React from 'react';
import { Shield, Clock } from 'lucide-react';
import { WebNotificationCard } from '../components/WebNotificationCard';

// ─── Componente ───────────────────────────────────────────────────────────────
export const NotificacionesPage: React.FC = () => {
  const ahora = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  const fecha = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 shrink-0" />
            Notificaciones
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            Herramientas de gestión y simulación de alertas
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span className="capitalize">{fecha} — {ahora}</span>
        </div>
      </header>

      {/* ── Fila principal: Simulación ──────────────────────── */}
      <div className="max-w-4xl mx-auto w-full">
        <WebNotificationCard />
      </div>
    </div>
  );
};
