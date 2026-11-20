import React, { useState } from 'react';
import { Bell, BellRing, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const WebNotificationCard: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return 'Notification' in window ? Notification.permission : 'default';
  });

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones web nativas.');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const handleTestNotification = () => {
    if (permission === 'granted') {
      new Notification('⚠️ ALERTA DE HELADA CRÍTICA — FríoAlerta', {
        body: 'Se pronostica un descenso térmico severo de -2.0 °C para las 03:00 AM en Concepción, Junín. Se recomienda activar coberturas térmicas en cultivos y resguardar el ganado.',
        icon: '/favicon.svg',
        // @ts-ignore: La propiedad vibrate puede no estar en los types por defecto de TS
        vibrate: [200, 100, 200],
      });
    }
  };

  const isGranted = permission === 'granted';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/60
                    bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800
                    backdrop-blur-md shadow-2xl p-6 sm:p-8">
      
      {/* ── Orbes decorativos (Glassmorphism) ── */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8  w-36 h-36 rounded-full bg-slate-700/10 blur-3xl pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-6 relative">
        <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/20 shrink-0">
          <Bell className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white leading-tight">
            Gestión de Notificaciones Web
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Centro de Configuración de Alertas
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-6" />

      {/* ── Columnas de Acción (2 cols en PC, apilado en móvil) ──────────── */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
        
        {/* Columna 1: Permisos */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">1. Permisos del Navegador</h4>
            <p className="text-[11px] text-slate-400">
              Autoriza a este dispositivo para recibir alertas emergentes.
            </p>
          </div>
          
          <button
            onClick={handleRequestPermission}
            disabled={isGranted}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-200
              ${isGranted
                ? 'bg-green-500/10 border-green-500/30 text-green-400 cursor-default'
                : 'bg-blue-600 hover:bg-blue-500 border-blue-400/30 text-white shadow-lg shadow-blue-900/30 active:scale-95'
              }
            `}
          >
            {isGranted ? <CheckCircle2 className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
            {isGranted ? 'Notificaciones Activadas' : 'Habilitar Notificaciones'}
          </button>
          
          <div className="flex items-center gap-2 text-xs font-semibold mt-1 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Estado actual:</span>
            {isGranted ? (
              <span className="text-green-400 flex items-center gap-1">🟢 Concedido</span>
            ) : (
              <span className="text-red-400 flex items-center gap-1">
                🔴 {permission === 'denied' ? 'Bloqueado' : 'Por defecto'}
              </span>
            )}
          </div>
        </div>

        {/* Separador vertical (solo PC) / horizontal (solo móvil) */}
        <div className="w-full md:w-px h-px md:h-auto bg-slate-700/50" />

        {/* Columna 2: Prueba */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">2. Simulación de Alerta</h4>
            <p className="text-[11px] text-slate-400">
              Verifica cómo se muestra la alerta nativa en este sistema.
            </p>
          </div>
          
          <button
            onClick={handleTestNotification}
            disabled={!isGranted}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-200
              ${isGranted
                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border-red-500/50 text-white shadow-lg shadow-red-900/40 active:scale-95'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-600 cursor-not-allowed'
              }
            `}
          >
            <AlertTriangle className="w-4 h-4" />
            Probar Alerta de Helada
          </button>
          
          {!isGranted && (
            <p className="text-[11px] text-slate-500 mt-1 leading-tight px-1 text-center md:text-left">
              * Debes habilitar las notificaciones primero para probar esta función.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
