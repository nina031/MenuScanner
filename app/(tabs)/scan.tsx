// app/(tabs)/scan.tsx
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CameraViewComponent from '../components/scan/CameraView';

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
    
    // Afficher l'alerte après la capture
    Alert.alert(
      'Photo capturée!', 
      'Votre menu a été scanné avec succès.',
      [
        {
          text: 'Nouvelle photo',
          onPress: () => {
            setShowCamera(true);
            setCapturedImage(null);
          }
        },
        {
          text: 'Analyser',
          onPress: () => {
            // Logique d'analyse du menu
            console.log('Analyse du menu:', uri);
            Alert.alert('Analyse', 'Fonctionnalité en cours de développement');
          }
        }
      ]
    );
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

  // Afficher l'image capturée si elle existe
  if (capturedImage) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full items-center">
            <View className="w-full h-80 rounded-xl overflow-hidden shadow-lg mb-6 bg-gray-100">
              <Image 
                source={{ uri: capturedImage }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            
            <Text className="text-xl font-bold text-primary mb-2">
              Menu scanné !
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Votre photo a été capturée avec succès
            </Text>

            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="bg-gray-100 px-6 py-3 rounded-full border border-gray-300"
                onPress={() => {
                  setShowCamera(true);
                  setCapturedImage(null);
                }}
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 font-medium">Nouvelle photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-primary px-6 py-3 rounded-full"
                onPress={() => {
                  Alert.alert('Analyse', 'Fonctionnalité en cours de développement');
                }}
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Analyser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
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