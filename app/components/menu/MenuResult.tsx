import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MenuDisplay from './MenuDisplay';
import { Menu, MenuData } from '../../types/menu';
import menuExample from '../../lib/data/menuExample.json';

type MenuResultProps = {
  imageUri?: string;
  onClose?: () => void;
};

const MenuResult: React.FC<MenuResultProps> = ({ imageUri, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des données du menu
    const timer = setTimeout(() => {
      try {
        // Dans un cas réel, ici on enverrait l'image au backend pour analyse
        // Pour notre exemple, on utilise simplement les données d'exemple
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
    }, 1500); // Délai simulé pour montrer le chargement

    return () => clearTimeout(timer);
  }, [imageUri]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#129EA1" />
        <Text className="mt-4 text-gray-600">Analyse du menu en cours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-lg font-medium mb-2">Erreur</Text>
        <Text className="text-gray-700 text-center">{error}</Text>
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
