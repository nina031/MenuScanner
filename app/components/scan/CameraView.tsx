// app/components/scan/CameraView.tsx
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CameraViewComponentProps {
  onPhotoTaken?: (uri: string) => void;
  onClose?: () => void;
}

export default function CameraViewComponent({ onPhotoTaken, onClose }: CameraViewComponentProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <StatusBar barStyle="dark-content" />
        <Ionicons name="camera-outline" size={80} color="#2A9D8F" className="mb-4" />
        <Text className="text-center text-gray-700 text-lg mb-4 px-4">
          Nous avons besoin de votre permission pour utiliser la caméra
        </Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-white font-medium">Autoriser l'accès à la caméra</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="mt-4 px-6 py-3"
          onPress={onClose}
        >
          <Text className="text-gray-600">Annuler</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleFlash() {
    setFlashMode(current => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'off';
      }
    });
  }

  function getFlashIcon() {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
      case 'off':
      default:
        return 'flash-off';
    }
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        
        if (photo && onPhotoTaken) {
          onPhotoTaken(photo.uri);
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de prendre la photo');
        console.error('Erreur lors de la prise de photo:', error);
      }
    }
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <CameraView 
        style={{ flex: 1 }}
        facing={facing}
        flash={flashMode}
        ref={cameraRef}
        mode="picture"
      >
        <View className="flex-1">
          {/* Header avec boutons */}
          <View className="flex-row justify-between items-center p-4 pt-14 bg-black/20">
            <TouchableOpacity 
              className="w-12 h-12 rounded-full bg-black/50 justify-center items-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            <Text className="text-white font-medium text-lg">Scanner</Text>
            
            <TouchableOpacity 
              className="w-12 h-12 rounded-full bg-black/50 justify-center items-center"
              onPress={toggleFlash}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={getFlashIcon()} 
                size={28} 
                color={flashMode === 'off' ? '#9CA3AF' : 'white'} 
              />
            </TouchableOpacity>
          </View>

          {/* Zone de scan avec cadre */}
          <View className="flex-1 justify-center items-center px-8 border-2 border-primary rounded-lg"/>
          {/* Bouton de capture */}
          <View className="p-6 pb-10 items-center bg-black/20">
            <TouchableOpacity 
              className="w-20 h-20 rounded-full bg-white justify-center items-center border-4 border-primary shadow-lg"
              onPress={takePicture}
              activeOpacity={0.8}
            >
              <View className="w-16 h-16 rounded-full bg-primary justify-center items-center">
                <Ionicons name="camera" size={32} color="white" />
              </View>
            </TouchableOpacity>
            
            <Text className="text-white/80 text-sm mt-3">
              Appuyez pour capturer
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}