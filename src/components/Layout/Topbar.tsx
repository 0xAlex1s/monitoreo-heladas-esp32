import React from 'react';
import { Wifi, WifiOff, Database, DatabaseZap, RefreshCw, Menu } from 'lucide-react';
import { useSheetData } from '../../hooks/useSheetData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TopbarProps {
  onOpenMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMenu }) => {
  const { isOnline, espConnected, loading, refetch } = useSheetData();

  const now = format(new Date(), "HH:mm:ss", { locale: es });

  return (
    <header className="min-h-14 flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 py-2 border-b border-slate-800/50">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block text-sm text-slate-500 truncate">
          Última actualización: <span className="text-slate-400">{now}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full">
        <button
          onClick={refetch}
          disabled={loading}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-40 shrink-0"
          title="Actualizar datos"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <div className={`flex items-center space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border backdrop-blur-sm transition-all duration-500 shrink-0 ${
          espConnected
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="relative flex h-2.5 w-2.5">
            {espConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${espConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
          {espConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">{espConnected ? 'ESP32' : 'ESP32 off'}</span>
        </div>

        <div className={`flex items-center space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border backdrop-blur-sm transition-all duration-500 shrink-0 ${
          isOnline
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="relative flex h-2.5 w-2.5">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
          {isOnline ? <DatabaseZap className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
          <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">{isOnline ? 'Sheets' : 'Sin datos'}</span>
        </div>
      </div>
    </header>
  );
};
