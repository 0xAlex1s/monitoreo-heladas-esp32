import React, { useEffect, useRef, useState } from 'react';
import {
  Bell, BellOff, BellRing, CheckCircle2, Loader2,
  ShieldAlert, Snowflake, Timer, X, Zap,
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { type PermissionState } from '../context/AlertContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function PermissionBadge({ permission }: { permission: PermissionState }) {
  if (permission === 'granted') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide
                       px-2.5 py-1 rounded-full
                       bg-green-500/15 border border-green-500/30 text-green-400">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Permiso concedido
      </span>
    );
  }
  if (permission === 'denied') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide
                       px-2.5 py-1 rounded-full
                       bg-red-500/15 border border-red-500/30 text-red-400">
        <X className="w-3 h-3" />
        Bloqueado
      </span>
    );
  }
  if (permission === 'unsupported') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide
                       px-2.5 py-1 rounded-full
                       bg-slate-700/50 border border-slate-600/40 text-slate-400">
        No compatible
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide
                     px-2.5 py-1 rounded-full
                     bg-slate-700/50 border border-slate-600/40 text-slate-400">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      Sin configurar
    </span>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export const SimulacionAlertasCard: React.FC = () => {
  const {
    permission,
    activateNotifications,
    simulateCriticalFrost,
    simulatedHighRisk,
    clearSimulation,
  } = useAlert();

  const [activating, setActivating]     = useState(false);
  const [simulating, setSimulating]     = useState(false);
  const [countdown, setCountdown]       = useState<number | null>(null);
  const [hint, setHint]                 = useState<string | null>(null);
  const countdownRef                    = useRef<ReturnType<typeof setInterval> | null>(null);

  const isGranted    = permission === 'granted';
  const isDenied     = permission === 'denied';
  const isUnsupported = permission === 'unsupported';

  // Sincronizar estado del countdown con simulatedHighRisk
  useEffect(() => {
    if (!simulatedHighRisk && countdown !== null) {
      setCountdown(null);
      setSimulating(false);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [simulatedHighRisk, countdown]);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Paso 1: Habilitar notificaciones ──────────────────────────────────────
  const handleActivate = async () => {
    setActivating(true);
    setHint(null);
    const result = await activateNotifications();
    setActivating(false);

    if (result === 'granted') {
      setHint(null);
    } else if (result === 'denied') {
      setHint('Abre el candado (🔒) en la barra de direcciones y permite las notificaciones.');
    } else if (result === 'unsupported') {
      setHint('Usa Chrome o Edge. En iPhone, añade la página al inicio y ábrela desde ahí.');
    } else {
      setHint('Presiona de nuevo y elige Permitir en el aviso del sistema.');
    }
  };

  // ── Paso 2: Simular Helada Crítica ────────────────────────────────────────
  const handleSimulateFrost = async () => {
    if (!isGranted || simulating) return;

    setSimulating(true);
    setHint(null);

    // Iniciar countdown visual de 10 s
    setCountdown(10);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!);
          setSimulating(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    await simulateCriticalFrost();
  };

  // ── Cancelar simulación manualmente ───────────────────────────────────────
  const handleCancel = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
    setSimulating(false);
    clearSimulation();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border transition-all duration-500
      ${simulating
        ? 'border-red-500/60 bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-950 shadow-2xl shadow-red-900/30'
        : 'border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-xl'
      }
      backdrop-blur-md p-6 sm:p-8
    `}>

      {/* ── Orbes decorativos ── */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-700
        ${simulating ? 'bg-red-600/25' : 'bg-indigo-600/10'}`} />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-700/10 blur-3xl pointer-events-none" />

      {/* ── Pulso de alerta activa ── */}
      {simulating && (
        <div className="absolute inset-0 rounded-2xl border-2 border-red-500/40 animate-ping pointer-events-none" />
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl transition-colors duration-500
            ${simulating ? 'bg-red-500/25' : 'bg-indigo-500/15'}`}>
            {simulating
              ? <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
              : <Bell className="w-6 h-6 text-indigo-400" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              Simulación de Alertas
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Demostración interactiva de prevención de heladas
            </p>
          </div>
        </div>
        <PermissionBadge permission={permission} />
      </div>

      {/* ── Separador ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/70 to-transparent mb-6" />

      {/* ── PASO 1: Habilitar alertas ───────────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
            ${isGranted ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {isGranted ? '✓' : '1'}
          </span>
          <span className="text-sm font-semibold text-slate-200">
            Habilitar Alertas en este dispositivo
          </span>
        </div>

        <button
          id="btn-habilitar-alertas"
          type="button"
          onClick={() => void handleActivate()}
          disabled={activating || isDenied || isUnsupported || isGranted}
          className={`
            w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl
            text-sm font-bold border transition-all duration-200
            disabled:cursor-not-allowed
            ${isGranted
              ? 'bg-green-500/15 border-green-500/40 text-green-300 opacity-80'
              : isDenied || isUnsupported
              ? 'bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-60'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98] border-blue-400/30 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40'
            }
          `}
        >
          {activating
            ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            : isGranted
            ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            : isDenied
            ? <BellOff className="w-4 h-4 shrink-0" />
            : <BellRing className="w-4 h-4 shrink-0" />}
          <span>
            {activating
              ? 'Solicitando permiso...'
              : isGranted
              ? 'Permiso concedido 🟢'
              : isDenied
              ? 'Bloqueado 🔴 — Ver instrucciones abajo'
              : isUnsupported
              ? 'Navegador no compatible'
              : 'Habilitar Alertas en este dispositivo'}
          </span>
        </button>

        {/* Pista de error */}
        {hint && !isGranted && (
          <p className="mt-2 text-xs text-amber-400/90 leading-relaxed pl-1">
            ⚠️ {hint}
          </p>
        )}
        {isDenied && (
          <p className="mt-2 text-xs text-red-400/80 leading-relaxed pl-1">
            🔒 Bloqueado. Abre el candado de la barra de direcciones → Configuración del sitio → Notificaciones → Permitir.
          </p>
        )}
      </div>

      {/* ── PASO 2: Simular Helada Crítica ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
            ${simulating ? 'bg-red-500 text-white animate-pulse' : isGranted ? 'bg-slate-600 text-slate-300' : 'bg-slate-800 text-slate-600'}`}>
            {simulating ? '!' : '2'}
          </span>
          <span className={`text-sm font-semibold transition-colors ${isGranted ? 'text-slate-200' : 'text-slate-600'}`}>
            Simular Helada Crítica
          </span>
        </div>

        {!simulating ? (
          <button
            id="btn-simular-helada-critica"
            type="button"
            onClick={() => void handleSimulateFrost()}
            disabled={!isGranted || simulating}
            title={!isGranted ? 'Primero habilita las alertas (Paso 1)' : 'Disparar simulación de helada para el jurado'}
            className={`
              group w-full relative overflow-hidden flex items-center justify-center gap-3
              px-5 py-4 rounded-xl text-sm font-bold border transition-all duration-200
              ${isGranted
                ? `bg-gradient-to-r from-red-700 to-red-600
                   hover:from-red-600 hover:to-red-500
                   border-red-500/50 text-white
                   shadow-lg shadow-red-900/40 hover:shadow-red-800/50
                   active:scale-[0.98]`
                : 'bg-slate-900/60 border-slate-800/50 text-slate-600 cursor-not-allowed'
              }
            `}
          >
            {/* Brillo en hover */}
            {isGranted && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            )}
            <Snowflake className={`w-5 h-5 shrink-0 ${isGranted ? 'animate-spin [animation-duration:3s]' : ''}`} />
            <span className="relative">
              {isGranted ? '🌡️ SIMULAR HELADA CRÍTICA (< 0°C)' : 'SIMULAR HELADA CRÍTICA (< 0°C) — Bloquado'}
            </span>
            {isGranted && <Zap className="w-4 h-4 shrink-0 opacity-80" />}
          </button>
        ) : (
          /* ── Estado activo: countdown + cancelar ── */
          <div className="space-y-3">
            {/* Barra de progreso del countdown */}
            <div className="relative w-full h-14 rounded-xl border border-red-500/40 bg-red-950/40 overflow-hidden flex items-center justify-center gap-3">
              <div
                className="absolute left-0 top-0 h-full bg-red-600/30 transition-all duration-1000 ease-linear"
                style={{ width: countdown !== null ? `${(countdown / 10) * 100}%` : '0%' }}
              />
              <Timer className="relative w-5 h-5 text-red-400 animate-pulse shrink-0" />
              <span className="relative text-red-300 font-bold text-sm">
                ⚠️ Alerta activa — Restaurando en{' '}
                <span className="text-white text-lg font-black tabular-nums">{countdown ?? 0}s</span>
              </span>
            </div>

            <button
              id="btn-cancelar-simulacion"
              type="button"
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                         text-xs font-bold border border-slate-700/50 bg-slate-800/50
                         text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar simulación
            </button>
          </div>
        )}
      </div>

      {/* ── Nota técnica ── */}
      {!simulating && (
        <p className="mt-5 text-[11px] text-slate-600 leading-relaxed border-t border-slate-800/60 pt-4">
          Al presionar el Paso 2, el sistema envía una alerta global y la interfaz cambia a estado de{' '}
          <span className="text-red-400">Riesgo Alto</span> durante 10 segundos.
        </p>
      )}
    </div>
  );
};
