import React from 'react';
import { Bell, MoonStar } from 'lucide-react';
import { useAlert } from '../context/AlertContext';

export const AlertActionButtons: React.FC = () => {
  const { permission, activateNotifications, simulateAiFrost } = useAlert();
  const [hint, setHint] = React.useState<string | null>(null);

  const handleActivate = async () => {
    const result = await activateNotifications();
    if (result === 'granted') {
      setHint('Listo. Este celular o tablet recibirá las alertas de helada.');
    } else if (result === 'denied') {
      setHint('Están bloqueadas. En el navegador abre el candado de la barra de direcciones y permite notificaciones.');
    } else if (result === 'unsupported') {
      setHint('Usa Chrome o Edge. En iPhone, añade la página a la pantalla de inicio y ábrela desde ahí.');
    } else {
      setHint('Pulsa de nuevo y elige Permitir en el aviso del sistema.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => void handleActivate()}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${
            permission === 'granted'
              ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
              : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400/30 text-white shadow-lg shadow-cyan-900/30'
          }`}
        >
          <Bell className="w-4 h-4 shrink-0" />
          {permission === 'granted' ? 'Notificaciones activadas' : 'Activar notificaciones'}
        </button>
        <button
          type="button"
          onClick={() => void simulateAiFrost()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40"
        >
          <MoonStar className="w-4 h-4 shrink-0" />
          Simular helada en la madrugada
        </button>
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
};
