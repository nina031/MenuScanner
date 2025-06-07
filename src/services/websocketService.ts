// app/services/websocketService.ts
import { MenuSection } from '../types/menu';

interface WebSocketMessage {
  type: 'connected' | 'processing_started' | 'progress' | 'menu_title' | 'sections_detected' | 'section_complete' | 'complete' | 'error';
  connection_id?: string;
  scan_id?: string;
  message?: string;
  step?: string;
  menu_title?: string;
  sections?: string[];
  section?: MenuSection;
  current_section?: number;
  total_sections?: number;
  processing_time_seconds?: number;
}

interface WebSocketEventHandlers {
  onConnected?: (connectionId: string) => void;
  onProcessingStarted?: (scanId?: string) => void;
  onProgress?: (step: string, message: string, scanId?: string) => void;
  onMenuTitle?: (menuTitle: string, scanId?: string) => void;
  onSectionsDetected?: (sections: string[], scanId?: string) => void;
  onSectionComplete?: (section: MenuSection, current: number, total: number, scanId?: string) => void;
  onComplete?: (processingTime: number, scanId?: string) => void;
  onError?: (message: string, scanId?: string) => void;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    scan_id: string;
    connection_id: string;
    file_key: string;
    processing_status: string;
  };
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private connectionId: string | null = null;
  private eventHandlers: WebSocketEventHandlers = {};
  private isConnecting = false;
  private shouldReconnect = true;
  private demoMode = false;

  private get wsUrl(): string {
    return __DEV__ 
      ? 'ws://192.168.1.30:8000/api/ws'
      : 'wss://your-production-api.com/api/ws';
  }

  private get apiUrl(): string {
    return __DEV__ 
      ? 'http://192.168.1.30:8000/api'
      : 'https://your-production-api.com/api';
  }

  async connect(): Promise<string> {
    console.log('🚀 WebSocketService.connect() appelé');
    
    // Éviter les connexions multiples
    if (this.isConnecting) {
      console.log('⚠️ Connexion déjà en cours, attente...');
      throw new Error('Connexion WebSocket déjà en cours');
    }
    
    if (this.isConnected() && this.connectionId) {
      console.log('⚠️ Déjà connecté avec ID:', this.connectionId);
      return this.connectionId;
    }

    this.isConnecting = true;
    this.shouldReconnect = true;

    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Création WebSocket vers:', this.wsUrl);
        
        // Fermer toute connexion existante
        if (this.ws) {
          this.ws.close();
        }

        this.ws = new WebSocket(this.wsUrl);

        const timeout = setTimeout(() => {
          console.log('⏰ Timeout connexion WebSocket');
          this.isConnecting = false;
          this.ws?.close();
          reject(new Error('Timeout de connexion WebSocket'));
        }, 30000); // Augmenté à 30 secondes

        this.ws.onopen = () => {
          console.log('✅ WebSocket.onopen déclenché');
          this.isConnecting = false;
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('📨 Message WebSocket reçu:', message.type, message);
            
            // TRAITEMENT IMMÉDIAT - Pas de queue, pas d'attente
            this.handleMessageImmediate(message);

            // Résoudre la promesse lors de la réception du connection_id
            if (message.type === 'connected' && message.connection_id && !this.connectionId) {
              console.log('🎯 Connection ID reçu:', message.connection_id);
              this.connectionId = message.connection_id;
              clearTimeout(timeout);
              resolve(message.connection_id);
            }
          } catch (error) {
            console.error('❌ Erreur parsing message WebSocket:', error, event.data);
          }
        };

        this.ws.onerror = (error) => {
          if (!this.demoMode) {
            console.error('❌ WebSocket.onerror:', error);
          }
          this.isConnecting = false;
          clearTimeout(timeout);
          reject(new Error('Erreur de connexion WebSocket'));
        };

        this.ws.onclose = (event) => {
          if (!this.demoMode) {
            console.log('🔌 WebSocket.onclose:', event.code, event.reason);
          }
          this.isConnecting = false;
          this.connectionId = null;
          clearTimeout(timeout);
          
          if (this.shouldReconnect && !this.demoMode) {
            this.eventHandlers.onError?.('Connexion WebSocket fermée');
          }
        };

      } catch (error) {
        console.error('❌ Erreur création WebSocket:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private handleMessageImmediate(message: WebSocketMessage) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔄 TRAITEMENT IMMÉDIAT à ${timestamp}:`, message.type);
    
    switch (message.type) {
      case 'connected':
        console.log('✅ Handler connected');
        this.eventHandlers.onConnected?.(message.connection_id!);
        break;

      case 'processing_started':
        console.log('🚀 Handler processing_started');
        this.eventHandlers.onProcessingStarted?.(message.scan_id);
        break;

      case 'progress':
        console.log('🔄 Handler progress:', message.step, message.message);
        this.eventHandlers.onProgress?.(
          message.step!, 
          message.message!, 
          message.scan_id
        );
        break;

      case 'menu_title':
        console.log('🏪 Handler menu_title:', message.menu_title);
        this.eventHandlers.onMenuTitle?.(
          message.menu_title!,
          message.scan_id
        );
        break;

      case 'sections_detected':
        console.log('📋 Handler sections_detected:', message.sections?.length, 'sections');
        this.eventHandlers.onSectionsDetected?.(
          message.sections!,
          message.scan_id
        );
        break;

      case 'section_complete':
        const sectionTimestamp = new Date().toLocaleTimeString();
        console.log(`📦 SECTION COMPLETE IMMÉDIATE à ${sectionTimestamp}:`, message.section?.name, `(${message.current_section}/${message.total_sections})`);
        
        // APPEL DIRECT ET IMMÉDIAT
        this.eventHandlers.onSectionComplete?.(
          message.section!,
          message.current_section!,
          message.total_sections!,
          message.scan_id
        );
        break;

      case 'complete':
        console.log('✅ Handler complete:', message.processing_time_seconds);
        this.eventHandlers.onComplete?.(
          message.processing_time_seconds!,
          message.scan_id
        );
        break;

      case 'error':
        console.log('❌ Handler error:', message.message);
        this.eventHandlers.onError?.(message.message!, message.scan_id);
        break;

      default:
        console.warn('⚠️ Type de message WebSocket non géré:', message.type);
    }
  }

  setEventHandlers(handlers: WebSocketEventHandlers) {
    console.log('🎯 setEventHandlers appelé');
    this.eventHandlers = handlers;
  }

  async uploadAndProcess(
    imageUri: string, 
    languageHint: string = 'fr', 
    cleanupTempFile: boolean = true
  ): Promise<UploadResponse> {
    console.log('📤 uploadAndProcess appelé');
    
    if (!this.connectionId) {
      throw new Error('WebSocket non connecté. Appelez connect() d\'abord.');
    }

    try {
      console.log('📤 Upload et traitement via WebSocket');

      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `menu_image_${Date.now()}.jpg`,
      } as any);

      formData.append('connection_id', this.connectionId);
      formData.append('language_hint', languageHint);
      formData.append('cleanup_temp_file', cleanupTempFile.toString());

      console.log('📤 Envoi vers:', `${this.apiUrl}/upload-and-process`);
      console.log('📤 Connection ID:', this.connectionId);

      const response = await fetch(`${this.apiUrl}/upload-and-process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('📤 Réponse upload:', data);

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return data;

    } catch (error) {
      console.error('❌ Erreur upload et traitement:', error);
      throw error;
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket non connecté, impossible d\'envoyer le message');
    }
  }

  ping() {
    this.sendMessage({
      type: 'ping',
      timestamp: Date.now()
    });
  }

  disconnect() {
    console.log('🔌 disconnect() appelé');
    this.shouldReconnect = false;
    
    if (this.ws) {
      console.log('🔌 Fermeture WebSocket');
      this.ws.close();
      this.ws = null;
    }
    
    this.connectionId = null;
    this.isConnecting = false;
    this.eventHandlers = {};
  }

  isConnected(): boolean {
    const connected = this.ws?.readyState === WebSocket.OPEN && this.connectionId !== null;
    console.log('🔍 isConnected():', connected);
    return connected;
  }

  getConnectionId(): string | null {
    return this.connectionId;
  }

  setDemoMode(enabled: boolean) {
    this.demoMode = enabled;
    console.log('🎮 Mode démo WebSocket:', enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ');
  }
}

export const webSocketService = new WebSocketService();