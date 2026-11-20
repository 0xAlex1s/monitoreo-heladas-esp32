export const FROST_ALERT_TITLE = 'Alerta Frío — Concepción';
export const FROST_AI_BODY =
  'Proyección meteorológica: Se iniciará una helada de -2.0 °C estimada para las 03:00 AM.';

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function sendFrostNotification(body: string = FROST_AI_BODY): boolean {
  if (!notificationsSupported() || Notification.permission !== 'granted') return false;
  try {
    new Notification(FROST_ALERT_TITLE, {
      body,
      icon: '/favicon.svg',
      tag: 'frost-alert',
      requireInteraction: true,
    });
    return true;
  } catch {
    return false;
  }
}
