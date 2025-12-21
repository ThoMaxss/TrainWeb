// WebSocket client for real-time notifications
export class NotificationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private listeners: Set<(notification: any) => void> = new Set();

  constructor(private url: string) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[NotificationService] Already connected');
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[NotificationService] Connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          this.notifyListeners(notification);
        } catch (error) {
          console.error('[NotificationService] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[NotificationService] WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('[NotificationService] Disconnected');
        this.ws = null;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[NotificationService] Failed to connect:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[NotificationService] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[NotificationService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(callback: (notification: any) => void) {
    this.listeners.add(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: (notification: any) => void) {
    this.listeners.delete(callback);
  }

  private notifyListeners(notification: any) {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('[NotificationService] Listener error:', error);
      }
    });
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[NotificationService] Cannot send message, not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:7128/ws';
    notificationService = new NotificationService(wsUrl);
  }
  return notificationService;
}

// React hook for notifications
import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'ticket' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const service = getNotificationService();
    
    // Connect to WebSocket
    service.connect();
    
    // Subscribe to notifications
    const unsubscribe = service.subscribe((notification: Notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    });

    // Check connection status
    const checkConnection = setInterval(() => {
      setConnected(service.isConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    clearAll,
  };
}
