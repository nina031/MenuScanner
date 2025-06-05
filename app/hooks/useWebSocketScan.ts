// app/hooks/useWebSocketScan.ts
import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { webSocketService } from '../services/websocketService';
import { useMenuStore } from '../stores/MenuStore';

type UseWebSocketScanProps = {
  imageUri?: string;
  onError?: () => void;
};

export const useWebSocketScan = ({ imageUri, onError }: UseWebSocketScanProps) => {
  const {
    setMenuTitle,
    setDetectedSections,
    addCompletedSection,
    setComplete,
    setLoading,
    setError,
    setScanId,
    resetMenu
  } = useMenuStore();
  
  // Refs pour éviter les multiples traitements
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      webSocketService.disconnect();
    };
  }, []);

  // Configuration des handlers WebSocket
  const setupWebSocketHandlers = useCallback(() => {
    webSocketService.setEventHandlers({
      onConnected: (connectionId) => {
        if (!isMountedRef.current) return;
        console.log('✅ WebSocket connecté:', connectionId);
      },

      onProcessingStarted: (scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('🚀 Traitement démarré');
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onProgress: (step, message, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('📊 Progrès:', step, message);
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onSectionsDetected: (title, sections, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('📋 Sections détectées:', sections);
        setMenuTitle(title || 'Menu');
        setDetectedSections(sections);
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onSectionComplete: (section, current, total, scanIdReceived) => {
        if (!isMountedRef.current) return;
        const receiveTime = new Date().toLocaleTimeString();
        console.log(`📦 SECTION REÇUE EN TEMPS RÉEL à ${receiveTime}:`, section.name, `(${current}/${total})`);
        
        addCompletedSection(section, current, total);
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onComplete: (time, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('✅ Traitement terminé en', time, 'secondes');
        setLoading(false);
        setComplete(true);
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onError: (message, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.error('❌ Erreur WebSocket:', message);
        setError(message);
        setLoading(false);
        isProcessingRef.current = false;
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },
    });
  }, [addCompletedSection, setMenuTitle, setDetectedSections, setLoading, setComplete, setError, setScanId]);

  // Démarrage du traitement
  useEffect(() => {
    if (!imageUri || isProcessingRef.current) return;

    const startProcessing = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        // Reset complet de l'état
        resetMenu();
        
        // Configurer les handlers
        setupWebSocketHandlers();
        
        // Connecter WebSocket
        const connectionId = await webSocketService.connect();
        if (!isMountedRef.current) return;
        
        console.log('✅ WebSocket connecté avec ID:', connectionId);
        
        // Démarrer le traitement
        const uploadResponse = await webSocketService.uploadAndProcess(imageUri);
        if (!isMountedRef.current) return;
        
        if (uploadResponse.success) {
          setScanId(uploadResponse.data?.scan_id || null);
          console.log('📤 Upload réussi:', uploadResponse.data?.scan_id);
        } else {
          throw new Error(uploadResponse.message);
        }

      } catch (error) {
        if (!isMountedRef.current) return;
        
        console.error('❌ Erreur de traitement:', error);
        
        let errorMessage = 'Erreur lors du traitement du menu';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setLoading(false);
        isProcessingRef.current = false;
        
        Alert.alert(
          'Erreur de traitement',
          errorMessage,
          [{ text: 'OK', onPress: onError }]
        );
      }
    };

    startProcessing();
  }, [imageUri, onError, setupWebSocketHandlers, resetMenu, setError, setLoading, setScanId]);

  // Return scan status for external usage if needed
  const { loading, error, currentMenu, menuState } = useMenuStore();
  
  return {
    loading,
    error,
    currentMenu,
    menuState,
    isScanning: loading || menuState === 'streaming'
  };
};