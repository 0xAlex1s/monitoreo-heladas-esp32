import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import {
  FROST_AI_BODY,
  getNotificationPermission,
  requestNotificationPermission,
  sendFrostNotification,
} from '../utils/notifications';

export type PermissionState = NotificationPermission | 'unsupported';

interface AlertContextValue {
  permission: PermissionState;
  simulatedHighRisk: boolean;
  simulatedTemp: number | null;   // null = usar dato real del sensor
  lastAlertMessage: string | null;
  requestPermission: () => Promise<PermissionState>;
  activateNotifications: () => Promise<PermissionState>;
  testNotification: () => Promise<boolean>;
  simulateAiFrost: () => Promise<void>;
  simulateCriticalFrost: () => Promise<void>; // Demo jurado: -2.5 °C, 10 s
  clearSimulation: () => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isOnline, espConnected } = useSheetData();
  const [permission, setPermission] = useState<PermissionState>(() => getNotificationPermission());
  const [simulatedHighRisk, setSimulatedHighRisk] = useState(false);
  const [simulatedTemp, setSimulatedTemp] = useState<number | null>(null);
  const [lastAlertMessage, setLastAlertMessage] = useState<string | null>(null);
  const sensorFiredRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  const activateNotifications = useCallback(async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      sendFrostNotification('Notificaciones activadas. Recibirás alertas de helada en este dispositivo.');
    }
    return result;
  }, [requestPermission]);

  const fireAlert = useCallback(async (body: string, turnRed: boolean) => {
    let current = getNotificationPermission();
    if (current === 'default') {
      current = await requestNotificationPermission();
      setPermission(current);
    } else {
      setPermission(current);
    }

    const sent = sendFrostNotification(body);
    setLastAlertMessage(body);
    if (turnRed) setSimulatedHighRisk(true);
    return sent;
  }, []);

  const testNotification = useCallback(async () => {
    return fireAlert('Prueba de notificación: las alertas llegan a este dispositivo.', false);
  }, [fireAlert]);

  const simulateAiFrost = useCallback(async () => {
    await fireAlert(FROST_AI_BODY, true);
  }, [fireAlert]);

  /** Demo para el jurado: temperatura −2.0 °C, notificación realista, auto-reset 10 s */
  const simulateCriticalFrost = useCallback(async () => {
    // 1. Solicitar permiso si aún no se tiene
    let current = getNotificationPermission();
    if (current === 'default') {
      current = await requestNotificationPermission();
      setPermission(current);
    } else {
      setPermission(current);
    }

    // 2. Disparar la notificación nativa exacta del brief
    if (current === 'granted') {
      try {
        new Notification('⚠️ ALERTA DE HELADA CRÍTICA — FríoAlerta', {
          body: 'Se pronostica un descenso térmico severo de -2.0 °C para las 03:00 AM en Concepción, Junín. Se recomienda activar coberturas térmicas en cultivos y resguardar el ganado.',
          icon: '/favicon.svg',
          tag: 'frost-critical',
          requireInteraction: true,
        });
      } catch (_) { /* Notification puede fallar en algunos navegadores */ }
    }

    // 3. Poner la UI en estado crítico con temperatura simulada
    const criticalMsg = '⚠️ ALERTA DE HELADA CRÍTICA — FríoAlerta: Se pronostica un descenso térmico severo de -2.0 °C para las 03:00 AM en Concepción, Junín. Se recomienda activar coberturas térmicas en cultivos y resguardar el ganado.';
    setLastAlertMessage(criticalMsg);
    setSimulatedHighRisk(true);
    setSimulatedTemp(-2.0);

    // 4. Auto-reset después de 10 segundos
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setSimulatedHighRisk(false);
      setSimulatedTemp(null);
      setLastAlertMessage(null);
    }, 10_000);
  }, []);

  const clearSimulation = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setSimulatedHighRisk(false);
    setSimulatedTemp(null);
    setLastAlertMessage(null);
  }, []);

  // Disparo en vivo: solo con datos reales de la placa, ≤ 0 °C, una vez por sesión
  useEffect(() => {
    if (sensorFiredRef.current || simulatedHighRisk || !isOnline || !espConnected) return;
    const latest = data[data.length - 1];
    if (!latest || latest.temperature > 0) return;
    sensorFiredRef.current = true;
    const body = `Disparo por sensor (placa en vivo): temperatura ${latest.temperature.toFixed(1)} °C. Riesgo Alto de helada.`;
    void fireAlert(body, true);
  }, [data, fireAlert, simulatedHighRisk, isOnline, espConnected]);

  const value = useMemo(
    () => ({
      permission,
      simulatedHighRisk,
      simulatedTemp,
      lastAlertMessage,
      requestPermission,
      activateNotifications,
      testNotification,
      simulateAiFrost,
      simulateCriticalFrost,
      clearSimulation,
    }),
    [permission, simulatedHighRisk, simulatedTemp, lastAlertMessage, requestPermission, activateNotifications, testNotification, simulateAiFrost, simulateCriticalFrost, clearSimulation]
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert debe usarse dentro de AlertProvider');
  return ctx;
}
