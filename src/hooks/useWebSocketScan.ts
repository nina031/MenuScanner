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
  
  // État de traitement plus robuste
  const processingState = useRef({
    isProcessing: false,
    currentScanId: null as string | null,
    connectionId: null as string | null,
    imageUri: null as string | null
  });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      // Déconnecter WebSocket mais garder le menu
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
          processingState.current.currentScanId = scanIdReceived;
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

      onMenuTitle: (title, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('🏪 Titre du menu reçu:', title);
        setMenuTitle(title || 'Menu');
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onSectionsDetected: (sections, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('📋 Sections détectées:', sections);
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
        // Reset état de traitement
        processingState.current.isProcessing = false;
        processingState.current.currentScanId = null;
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onError: (message, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.error('❌ Erreur WebSocket:', message);
        setError(message);
        setLoading(false);
        // Reset état de traitement
        processingState.current.isProcessing = false;
        processingState.current.currentScanId = null;
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },
    });
  }, []); // Dépendances vides pour éviter les re-créations

  // Démarrage du traitement
  useEffect(() => {
    if (!imageUri) return;
    
    // Protection robuste contre les multiples traitements
    if (processingState.current.isProcessing) {
      console.log('⚠️ Traitement déjà en cours, ignoré', processingState.current);
      return;
    }
    
    // Éviter de traiter la même image plusieurs fois
    if (processingState.current.imageUri === imageUri) {
      console.log('⚠️ Image déjà en cours de traitement, ignoré');
      return;
    }

    const startProcessing = async () => {
      if (processingState.current.isProcessing) return;
      
      processingState.current.isProcessing = true;
      processingState.current.imageUri = imageUri;

      try {
        // Reset complet de l'état
        resetMenu();
        
        // Configurer les handlers
        setupWebSocketHandlers();
        
        // Activer temporairement le mode démo pour éviter les logs d'erreur
        webSocketService.setDemoMode(true);
        
        // Connecter WebSocket
        const connectionId = await webSocketService.connect();
        if (!isMountedRef.current) return;
        
        // Désactiver le mode démo si connexion réussie
        webSocketService.setDemoMode(false);
        
        processingState.current.connectionId = connectionId;
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
        
        // Ne pas logger l'erreur si on va basculer en mode démo
        let errorMessage = 'Erreur lors du traitement du menu';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        const isConnectionError = errorMessage.includes('Network') || 
                                 errorMessage.includes('fetch') ||
                                 errorMessage.includes('Connection') ||
                                 errorMessage.includes('connexion') ||
                                 errorMessage.includes('WebSocket') ||
                                 errorMessage.includes('ECONNREFUSED') ||
                                 errorMessage.includes('Connection refused') ||
                                 error instanceof TypeError;
        
        if (!isConnectionError) {
          console.error('❌ Erreur de traitement:', error);
        }
        
        if (isConnectionError) {
          console.log('🔄 Backend indisponible, basculement vers le mode démo');
          
          // Le mode démo est déjà activé, on garde cet état
          
          // Reset des erreurs d'abord
          setError(null);
          
          // Utiliser le menu d'exemple au lieu d'afficher une erreur
          const { loadExampleMenu } = useMenuStore.getState();
          loadExampleMenu();
          
          // Reset état de traitement
          processingState.current.isProcessing = false;
          processingState.current.currentScanId = null;
          processingState.current.imageUri = null;
          
          return; // Pas d'alerte d'erreur, on utilise l'exemple
        }
        
        // Pour les autres erreurs, comportement normal
        setError(errorMessage);
        setLoading(false);
        // Reset état de traitement
        processingState.current.isProcessing = false;
        processingState.current.currentScanId = null;
        processingState.current.imageUri = null;
        
        Alert.alert(
          'Erreur de traitement',
          errorMessage,
          [{ text: 'OK', onPress: onError }]
        );
      }
    };

    startProcessing();
  }, [imageUri]); // Seule dépendance nécessaire

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