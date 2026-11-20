import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationBanner } from './NotificationBanner';
import { useAlert } from '../../context/AlertContext';

export const Layout: React.FC = () => {
  const { simulatedHighRisk, lastAlertMessage, clearSimulation } = useAlert();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`flex min-h-dvh text-slate-100 overflow-hidden relative transition-colors duration-500 ${
        simulatedHighRisk ? 'bg-red-950' : 'bg-background'
      }`}
    >
      {/* ── Efecto de fondo de riesgo alto ── */}
      {simulatedHighRisk && (
        <div className="absolute inset-0 bg-red-600/35 pointer-events-none z-0 animate-pulse" />
      )}

      {/* ── Orbes decorativos de fondo ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />

      {/* ── Sidebar (oculto en móvil, visible como drawer al abrir) ── */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Contenido principal: ocupa todo el ancho en móvil ── */}
      <div className="flex-1 flex flex-col h-dvh overflow-hidden z-10 relative min-w-0 w-full">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <NotificationBanner />

        {/* ── Banner de alerta alta ── */}
        {simulatedHighRisk && (
          <div className="mx-3 sm:mx-6 md:mx-8 mt-3 p-4 rounded-xl border border-red-400/50 bg-red-600/80 text-white shadow-lg flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wide">Nivel de riesgo: Alto</p>
              <p className="text-sm mt-1">{lastAlertMessage}</p>
            </div>
            <button
              type="button"
              onClick={clearSimulation}
              className="px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold transition-colors"
            >
              Quitar simulación
            </button>
          </div>
        )}

        {/* ── Área principal de contenido ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
