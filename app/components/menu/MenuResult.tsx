// app/components/menu/MenuResult.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import menuExample from '../../lib/data/menuExample.json';
import { apiService, UploadImageResponse } from '../../services/api';
import { Menu, MenuData } from '../../types/menu';
import MenuDisplay from './MenuDisplay';

type MenuResultProps = {
  imageUri?: string;
  onClose?: () => void;
};

const MenuResult: React.FC<MenuResultProps> = ({ imageUri, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadImageResponse | null>(null);

  useEffect(() => {
    if (imageUri) {
      uploadImageToBackend(imageUri);
    }
  }, [imageUri]);

  const uploadImageToBackend = async (uri: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Début upload vers backend...');
      
      // 1. Upload l'image vers le backend
      const response = await apiService.uploadImage(uri);
      setUploadResponse(response);
      
      console.log('✅ Image uploadée avec succès:', response.data?.file_key);
      
      // 2. Pour l'instant, on utilise toujours les données d'exemple
      // Plus tard, le backend retournera le menu analysé
      setTimeout(() => {
        try {
          const menuData = menuExample as MenuData;
          
          if (menuData && menuData.menu) {
            setMenu(menuData.menu);
            setLoading(false);
          } else {
            setError('Le format du menu est invalide');
            setLoading(false);
          }
        } catch (err) {
          setError('Erreur lors du chargement du menu');
          setLoading(false);
          console.error('Erreur lors du chargement du menu:', err);
        }
      }, 1000); // Délai réduit car l'upload est déjà fait

    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setError(`Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setLoading(false);
      
      // Afficher une alerte à l'utilisateur
      Alert.alert(
        'Erreur de connexion',
        'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.',
        [
          { text: 'Réessayer', onPress: () => uploadImageToBackend(uri) },
          { text: 'Annuler', onPress: onClose }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#129EA1" />
        <Text className="mt-4 text-gray-600">
          {uploadResponse ? 'Analyse du menu en cours...' : 'Upload de l\'image...'}
        </Text>
        {uploadResponse && (
          <Text className="mt-2 text-sm text-gray-500">
            ID: {uploadResponse.data?.scan_id}
          </Text>
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-lg font-medium mb-2">Erreur</Text>
        <Text className="text-gray-700 text-center">{error}</Text>
        {uploadResponse && (
          <View className="mt-4 p-3 bg-green-50 rounded-lg">
            <Text className="text-green-700 text-sm font-medium">
              ✅ Image uploadée avec succès
            </Text>
            <Text className="text-green-600 text-xs mt-1">
              ID: {uploadResponse.data?.scan_id}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (!menu) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-gray-700 text-center">Aucun menu détecté</Text>
      </View>
    );
  }

  return <MenuDisplay menu={menu} onClose={onClose} />;
};

export default MenuResult;