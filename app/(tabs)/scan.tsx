// app/(tabs)/scan.tsx
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import CameraViewComponent from '../components/scan/CameraView';
import MenuViewer from '../components/menu/MenuViewer';
import { useWebSocketScan } from '../../src/hooks/useWebSocketScan';

type RootStackParamList = {
  Home: undefined;
};

type ScanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Scan = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [showCamera, setShowCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Hook pour gérer le scan WebSocket
  const { isScanning } = useWebSocketScan({ 
    imageUri: capturedImage || undefined, 
    onError: handleClose 
  });

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

  function handleClose() {
    setShowCamera(true);
    setCapturedImage(null);
    navigation.goBack();
  }

  // Afficher directement la caméra
  if (showCamera) {
    return (
      <CameraViewComponent 
        onPhotoTaken={handlePhotoTaken}
        onClose={handleClose}
      />
    );
  }

  // Afficher MenuViewer si une image a été capturée
  if (capturedImage) {
    return <MenuViewer onClose={handleClose} />;
  }

  // Par défaut, afficher la caméra
  return (
    <CameraViewComponent 
      onPhotoTaken={handlePhotoTaken}
      onClose={handleClose}
    />
  );
};

export default Scan;