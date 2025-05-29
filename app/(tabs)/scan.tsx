// app/(tabs)/scan.tsx
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CameraViewComponent from '../components/scan/CameraView';
import MenuResult from '../components/menu/MenuResult';

type RootStackParamList = {
  Home: undefined;
};

type ScanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Scan = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [showCamera, setShowCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Masquer la tabBar pour cet écran
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    };
  }, [navigation]);

  // Réinitialiser l'état de la caméra quand l'écran reçoit le focus
  useFocusEffect(
    useCallback(() => {
      setShowCamera(true);
      setCapturedImage(null);
      
      return () => {
        // Nettoyage si nécessaire
      };
    }, [])
  );

  const handlePhotoTaken = (uri: string) => {
    setCapturedImage(uri);
    setShowCamera(false);
  };

  // Afficher directement la caméra
  if (showCamera) {
    return (
      <CameraViewComponent 
        onPhotoTaken={handlePhotoTaken}
        onClose={() => navigation.goBack()}
      />
    );
  }

  // Afficher le résultat du menu si une image a été capturée
  if (capturedImage) {
    return (
      <MenuResult 
        imageUri={capturedImage} 
        onClose={() => {
          setShowCamera(true);
          setCapturedImage(null);
        }} 
      />
    );
  }

  // Par défaut, afficher la caméra
  return (
    <CameraViewComponent 
      onPhotoTaken={handlePhotoTaken}
      onClose={() => navigation.goBack()}
    />
  );
};

export default Scan;  