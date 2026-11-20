import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

export const NotificationBanner: React.FC = () => {
  const { permission } = useAlert();
  const [dismissed, setDismissed] = useState(false);

  const showBanner = !dismissed && (permission === 'default' || permission === 'denied' || permission === 'unsupported');

  if (!showBanner) return null;

  return (
    <div className="px-3 sm:px-6 lg:px-8 pt-3">
      <div className="glass-panel p-3 sm:p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/40 flex items-start gap-3">
        <Bell className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-300 flex-1">
          En el celular pulsa <strong className="text-white">Activar notificaciones</strong> y luego elige Permitir.
          {permission === 'denied' && ' Ahora están bloqueadas: ábrelas en el candado de la barra de direcciones.'}
          {permission === 'unsupported' && ' En iPhone usa Safari, Añadir a pantalla de inicio, y ábrela desde el icono.'}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-200"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
