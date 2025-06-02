// app/components/menu/MenuResult.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { apiService, ScanMenuResponse } from '../../services/api';
import { Menu } from '../../types/menu';
import MenuDisplay from './MenuDisplay';

type MenuResultProps = {
  imageUri?: string;
  onClose?: () => void;
};

const MenuResult: React.FC<MenuResultProps> = ({ imageUri, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanResponse, setScanResponse] = useState<ScanMenuResponse | null>(null);

  useEffect(() => {
    if (imageUri) {
      scanMenuImage(imageUri);
    }
  }, [imageUri]);

  const scanMenuImage = async (uri: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Début du scan complet du menu...');
      
      // Utiliser le nouvel endpoint de scan complet
      const response = await apiService.scanMenuComplete(
        uri,
        'fr', // Langue française par défaut
        true  // Nettoyer le fichier temporaire après traitement
      );
      
      setScanResponse(response);
      
      if (response.success && response.data) {
        console.log('✅ Menu analysé avec succès:', response.data);
        setMenu(response.data.menu as Menu);
        setLoading(false);
      } else {
        setError(response.message || 'Erreur lors de l\'analyse du menu');
        setLoading(false);
      }

    } catch (error) {
      console.error('❌ Erreur scan menu:', error);
      
      let errorMessage = 'Erreur lors du scan du menu';
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Le traitement prend trop de temps. Réessayez avec une image plus petite.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
      
      // Afficher une alerte à l'utilisateur avec options
      Alert.alert(
        'Erreur de traitement',
        errorMessage,
        [
          { text: 'Réessayer', onPress: () => scanMenuImage(uri) },
          { text: 'Annuler', onPress: onClose }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#129EA1" />
        <Text className="mt-4 text-gray-600 text-center px-4">
          Analyse du menu en cours...
        </Text>
        <Text className="mt-2 text-sm text-gray-500 text-center px-4">
          📸 Extraction du texte
          {'\n'}🤖 Structuration intelligente
          {'\n'}🍽️ Finalisation du menu
        </Text>
        {scanResponse && (
          <View className="mt-4 p-3 bg-blue-50 rounded-lg mx-4">
            <Text className="text-blue-700 text-sm font-medium text-center">
              ID: {scanResponse.scan_id}
            </Text>
          </View>
        )}
      </View>
    );
  }

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
        
        {scanResponse && (
          <View className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-gray-600 text-sm text-center">
              🆔 Scan ID: {scanResponse.scan_id}
              {'\n'}⏱️ Temps: {scanResponse.processing_time_seconds}s
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (!menu) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Text className="text-gray-500 text-3xl">🔍</Text>
        </View>
        <Text className="text-gray-700 text-center">
          Aucun menu détecté dans l'image
        </Text>
        <Text className="text-gray-500 text-sm text-center mt-2">
          Vérifiez que l'image contient un menu lisible
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MenuDisplay menu={menu} onClose={onClose} />
      
      {/* Informations de debug en bas (seulement en mode dev) */}
      {__DEV__ && scanResponse && (
        <View className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-3">
          <Text className="text-white text-xs text-center">
            🔧 Debug: {scanResponse.scan_id} | ⏱️ {scanResponse.processing_time_seconds}s
            {'\n'}📊 {menu.sections.length} sections | 🍽️ {menu.sections.reduce((acc, s) => acc + s.items.length, 0)} plats
          </Text>
        </View>
      )}
    </View>
  );
};

export default MenuResult;