// app/components/menu/MenuResultWebSocket.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { webSocketService } from '../../services/websocketService';
import { Menu, MenuSection } from '../../types/menu';
import MenuDisplay from './MenuDisplay';
import MenuSectionLive from './MenuSectionLive';

type MenuResultWebSocketProps = {
  imageUri?: string;
  onClose?: () => void;
};

type SectionWithTimestamp = {
  section: MenuSection;
  timestamp: number;
  id: string;
};

const MenuResultWebSocket: React.FC<MenuResultWebSocketProps> = ({ imageUri, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Initialisation...');
  const [error, setError] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  
  // État du menu progressif
  const [menuTitle, setMenuTitle] = useState<string>('');
  const [detectedSections, setDetectedSections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<SectionWithTimestamp[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
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

  // Fonction pour ajouter une section IMMÉDIATEMENT
  const addSectionImmediate = useCallback((
    section: MenuSection, 
    current: number, 
    total: number, 
    scanIdReceived?: string
  ) => {
    if (!isMountedRef.current) return;
    
    const timestamp = Date.now();
    const displayTime = new Date(timestamp).toLocaleTimeString();
    const sectionId = `${section.name}_${current}_${timestamp}`;
    
    console.log(`🎯 AJOUT IMMÉDIAT SECTION ${section.name} À: ${displayTime}`);
    
    const newSectionData: SectionWithTimestamp = {
      section,
      timestamp,
      id: sectionId
    };
    
    // MISE À JOUR IMMÉDIATE DES ÉTATS
    setCompletedSections(prev => {
      const newSections = [...prev, newSectionData];
      console.log(`📦 NOUVEAU TOTAL: ${newSections.length} sections`);
      return newSections;
    });
    
    setCurrentSection(current);
    setTotalSections(total);
    setStatus(`Section "${section.name}" analysée (${current}/${total})`);
    
    if (scanIdReceived) {
      setScanId(scanIdReceived);
    }
  }, []);

  // Configuration des handlers WebSocket
  const setupWebSocketHandlers = useCallback(() => {
    webSocketService.setEventHandlers({
      onConnected: (connectionId) => {
        if (!isMountedRef.current) return;
        console.log('✅ WebSocket connecté:', connectionId);
        setStatus('WebSocket connecté, envoi de l\'image...');
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
        setStatus(message);
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onSectionsDetected: (title, sections, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('📋 Sections détectées:', sections);
        setMenuTitle(title || 'Menu');
        setDetectedSections(sections);
        setTotalSections(sections.length);
        setStatus(`${sections.length} sections détectées, analyse en cours...`);
        if (scanIdReceived) {
          setScanId(scanIdReceived);
        }
      },

      onSectionComplete: (section, current, total, scanIdReceived) => {
        if (!isMountedRef.current) return;
        const receiveTime = new Date().toLocaleTimeString();
        console.log(`📦 SECTION REÇUE EN TEMPS RÉEL à ${receiveTime}:`, section.name, `(${current}/${total})`);
        
        // APPEL IMMÉDIAT
        addSectionImmediate(section, current, total, scanIdReceived);
      },

      onComplete: (time, scanIdReceived) => {
        if (!isMountedRef.current) return;
        console.log('✅ Traitement terminé en', time, 'secondes');
        setStatus(`Analyse terminée en ${time.toFixed(1)}s`);
        setLoading(false);
        setIsComplete(true);
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
  }, [addSectionImmediate]);

  // Démarrage du traitement
  useEffect(() => {
    if (!imageUri || isProcessingRef.current) return;

    const startProcessing = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        // Reset complet de l'état
        setCompletedSections([]);
        setDetectedSections([]);
        setCurrentSection(0);
        setTotalSections(0);
        setIsComplete(false);
        setError(null);
        setMenuTitle('');
        
        setStatus('Connexion WebSocket...');
        
        // Configurer les handlers
        setupWebSocketHandlers();
        
        // Connecter WebSocket
        const connectionId = await webSocketService.connect();
        if (!isMountedRef.current) return;
        
        console.log('✅ WebSocket connecté avec ID:', connectionId);
        setStatus('Envoi de l\'image...');
        
        // Démarrer le traitement
        const uploadResponse = await webSocketService.uploadAndProcess(imageUri);
        if (!isMountedRef.current) return;
        
        if (uploadResponse.success) {
          setScanId(uploadResponse.data?.scan_id || null);
          setStatus('Image envoyée, extraction du texte...');
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
          [{ text: 'OK', onPress: onClose }]
        );
      }
    };

    startProcessing();
  }, [imageUri, onClose, setupWebSocketHandlers]);

  // Debug logs EN TEMPS RÉEL
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📊 CHANGEMENT SECTIONS à ${timestamp}: ${completedSections.length} sections`);
    if (completedSections.length > 0) {
      const lastSection = completedSections[completedSections.length - 1];
      console.log(`➕ DERNIÈRE AJOUTÉE: ${lastSection.section.name}`);
    }
  }, [completedSections]);

  // Créer un menu partiel avec les sections complétées
  const partialMenu: Menu = {
    name: menuTitle || 'Menu',
    sections: completedSections.map(s => s.section)
  };

  // Si le traitement est terminé et qu'on a des sections, afficher le menu complet
  if (isComplete && !error && completedSections.length > 0) {
    return (
      <View className="flex-1">
        <MenuDisplay menu={partialMenu} onClose={onClose} />
        
        {/* Informations de debug */}
        {__DEV__ && scanId && (
          <View className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-3">
            <Text className="text-white text-xs text-center">
              🔧 Scan: {scanId.substring(0, 8)}
              {'\n'}📊 {completedSections.length} sections | 🍽️ {completedSections.reduce((acc, s) => acc + s.section.items.length, 0)} plats
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
          <Text className="text-red-500 text-3xl">⚠️</Text>
        </View>
        <Text className="text-red-500 text-lg font-medium mb-2 text-center">
          Erreur de traitement
        </Text>
        <Text className="text-gray-700 text-center mb-4">
          {error}
        </Text>
        {scanId && (
          <Text className="text-gray-500 text-xs">
            ID: {scanId.substring(0, 8)}
          </Text>
        )}
      </View>
    );
  }

  // Écran de chargement avec sections qui apparaissent EN TEMPS RÉEL
  return (
    <View className="flex-1 bg-white">
      {/* Header de statut */}
      <View className="px-4 pt-6 pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
          Analyse du menu en temps réel...
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          {status}
        </Text>
        
        {/* Barre de progression EN TEMPS RÉEL */}
        {totalSections > 0 && (
          <View className="mt-4">
            <View className="flex-row justify-between text-xs text-gray-500 mb-1">
              <Text>Sections analysées</Text>
              <Text>{completedSections.length}/{totalSections}</Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <Animated.View 
                className="bg-primary h-2 rounded-full"
                style={{ 
                  width: `${totalSections > 0 ? (completedSections.length / totalSections) * 100 : 0}%` 
                }}
              />
            </View>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Titre du menu détecté */}
        {menuTitle && (
          <Animated.View 
            entering={FadeIn.delay(200)}
            className="py-6 items-center"
          >
            <Text className="text-2xl font-light text-gray-900 tracking-wider">
              {menuTitle}
            </Text>
            <View className="h-0.5 w-24 bg-primary/30 rounded-full mt-2" />
          </Animated.View>
        )}

        {/* Sections détectées mais pas encore analysées */}
        {detectedSections.length > 0 && (
          <Animated.View entering={FadeIn.delay(400)} className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Sections à analyser :
            </Text>
            <View className="flex-row flex-wrap">
              {detectedSections.map((sectionName, index) => {
                const isCompleted = completedSections.some(s => s.section.name === sectionName);
                const isCurrentlyProcessing = index === completedSections.length && !isCompleted;
                
                return (
                  <View 
                    key={`${sectionName}-${index}`}
                    className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
                      isCompleted 
                        ? 'bg-green-100 border border-green-300' 
                        : isCurrentlyProcessing 
                          ? 'bg-primary/20 border border-primary' 
                          : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm ${
                      isCompleted 
                        ? 'text-green-700' 
                        : isCurrentlyProcessing 
                          ? 'text-primary font-medium' 
                          : 'text-gray-600'
                    }`}>
                      {isCompleted && '✅ '}{isCurrentlyProcessing && '⏳ '}{sectionName}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* SECTIONS QUI APPARAISSENT EN TEMPS RÉEL */}
        {completedSections.map((sectionData, index) => {
          const renderTime = new Date().toLocaleTimeString();
          console.log(`🎨 RENDU TEMPS RÉEL à ${renderTime}: section ${index + 1} - ${sectionData.section.name}`);
          
          return (
            <MenuSectionLive
              key={sectionData.id}
              section={sectionData.section}
              index={index}
              timestamp={sectionData.timestamp}
            />
          );
        })}

        {/* Indicateur de chargement */}
        {loading && (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#129EA1" />
            <Text className="mt-3 text-gray-500 text-center">
              {completedSections.length > 0 
                ? `${completedSections.length} section${completedSections.length > 1 ? 's' : ''} reçue${completedSections.length > 1 ? 's' : ''} en temps réel...`
                : 'Préparation de l\'analyse...'
              }
            </Text>
            {scanId && (
              <Text className="mt-1 text-gray-400 text-xs text-center">
                ID: {scanId.substring(0, 8)}
              </Text>
            )}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default MenuResultWebSocket;