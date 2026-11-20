import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Bell, Activity, TrendingUp, GraduationCap, ShieldAlert, Info, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Inicio', icon: LayoutDashboard },
  { path: '/mapa', label: 'Mapa SIG', icon: Map },
  { path: '/alertas', label: 'Alertas', icon: Bell },
  { path: '/monitoreo', label: 'Monitoreo', icon: Activity },
  { path: '/historial', label: 'Historial', icon: TrendingUp },
  { path: '/educativa', label: 'Educación', icon: GraduationCap },
  { path: '/notificaciones', label: 'Notificaciones', icon: ShieldAlert },
  { path: '/informacion', label: 'Información', icon: Info },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  return (
    <>
      {/* ── Overlay backdrop (solo móvil, cuando el drawer está abierto) ── */}
      <button
        type="button"
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* ── Sidebar / Drawer ── */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-[min(18rem,85vw)] md:w-64
          bg-slate-900/98 md:bg-background/50
          border-r border-slate-800
          h-dvh flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:flex
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Header del Sidebar ── */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center space-x-3">
            <div className="p-1.5 bg-blue-600 rounded-lg shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" />
              </svg>
            </div>
            <span>FríoAlerta</span>
          </h1>
          {/* Botón cerrar — solo visible en móvil cuando el drawer está abierto */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] tracking-widest uppercase text-slate-500 font-medium px-6 pt-3 pb-1">
          Concepción, Junín — Perú
        </p>

        {/* ── Navegación ── */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Footer ── */}
        <div className="p-6 border-t border-slate-800 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="text-[10px] text-slate-600 font-medium">Sistema de Alerta Temprana</p>
          <p className="text-[10px] text-slate-600">Feria Escolar de Ciencias — 2026</p>
        </div>
      </aside>
    </>
  );
};
