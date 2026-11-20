import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AlertProvider } from './context/AlertContext';

const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MapaPage = lazy(() => import('./pages/MapaPage').then(module => ({ default: module.MapaPage })));
const HistorialPage = lazy(() => import('./pages/HistorialPage').then(module => ({ default: module.HistorialPage })));
const AlertasPage = lazy(() => import('./pages/AlertasPage').then(module => ({ default: module.AlertasPage })));
const NotificacionesPage = lazy(() => import('./pages/NotificacionesPage').then(module => ({ default: module.NotificacionesPage })));
const EducativaPage = lazy(() => import('./pages/EducativaPage').then(module => ({ default: module.EducativaPage })));
const MonitoreoPage = lazy(() => import('./pages/MonitoreoPage').then(module => ({ default: module.MonitoreoPage })));
const InformacionPage = lazy(() => import('./pages/InformacionPage').then(module => ({ default: module.InformacionPage })));

function FallbackSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <Suspense fallback={<FallbackSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="mapa" element={<MapaPage />} />
              <Route path="historial" element={<HistorialPage />} />
              <Route path="alertas" element={<AlertasPage />} />
              <Route path="notificaciones" element={<NotificacionesPage />} />
              <Route path="educativa" element={<EducativaPage />} />
              <Route path="monitoreo" element={<MonitoreoPage />} />
              <Route path="informacion" element={<InformacionPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
