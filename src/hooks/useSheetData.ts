import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import type { SensorData } from '../types';
import { generateMockData } from '../data/mockData';

// URL pública del CSV de la hoja "Datos" en Google Sheets (configurable por variable de entorno)
const SHEET_URL = import.meta.env.VITE_SHEET_URL || '';

// URL de la Web App de Google Apps Script (configurable por variable de entorno)
export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || '';

/**
 * Parsea el timestamp del formato peruano "dd/MM/yyyy HH:mm:ss"
 * a un objeto Date válido de JavaScript.
 * Ejemplo: "19/08/2026 17:27:37" → new Date(2026, 7, 19, 17, 27, 37)
 */
function parsePeruTimestamp(raw: string): Date {
  // Formato esperado: "dd/MM/yyyy HH:mm:ss"
  const parts = raw.trim().split(' ');
  if (parts.length < 2) return new Date(NaN);
  const [datePart, timePart] = parts;
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  // month - 1 porque en JS los meses van de 0 a 11
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export function useSheetData() {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [espConnected, setEspConnected] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(SHEET_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData: SensorData[] = (results.data as any[]).map((row) => {
            const rawTimestamp = row['Fecha y Hora'] || '';
            const parsedDate = parsePeruTimestamp(rawTimestamp);
            return {
              // Guardamos el timestamp como ISO para uso interno consistente
              timestamp: isNaN(parsedDate.getTime())
                ? new Date().toISOString()
                : parsedDate.toISOString(),
              // parseFloat elimina el " °C" y " %" que manda el ESP32
              temperature: parseFloat(row['Temperatura'] ?? '0'),
              humidity: parseFloat(row['Humedad'] ?? '0'),
            };
          }).filter(item => !isNaN(item.temperature) && !isNaN(item.humidity));
          
          if (parsedData.length > 0) {
            setData(parsedData);
            setIsOnline(true);
            setError(null);

            // Verificar si el ESP32 mandó datos en los últimos 10 minutos
            const latestDate = new Date(parsedData[parsedData.length - 1].timestamp);
            const nowMs = Date.now();
            const diffMinutes = (nowMs - latestDate.getTime()) / 60000;
            
            console.log(`[FríoAlerta] Último dato: ${latestDate.toLocaleString('es-PE')}`);
            console.log(`[FríoAlerta] Diferencia: ${diffMinutes.toFixed(1)} minutos`);
            
            setEspConnected(diffMinutes <= 10);
          } else {
            throw new Error('No se encontraron datos válidos en la hoja "Datos"');
          }
        },
        error: (err: Error) => {
          throw err;
        }
      });
    } catch (err) {
      console.warn('[FríoAlerta] Error al leer Sheets, usando datos mock:', err);
      setIsOnline(false);
      setEspConnected(false);
      const mock = generateMockData(24);
      setData(mock);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Polling frecuente para disparo en vivo con la placa
    const interval = setInterval(fetchData, 20 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, isOnline, espConnected, refetch: fetchData };
}
