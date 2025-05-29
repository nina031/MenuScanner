// app/components/RecentScans.tsx

import { Image, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "../ui/card";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ScanItem {
  id: number;
  restaurantName: string;
  date: string;
  image: string;
}

export default function RecentScans() {

const recentScans = [
        {
          id: 1,
          restaurantName: "Le Petit Bistro",
          date: "Il y a 2h",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 2,
          restaurantName: "Sushi Zen",
          date: "Hier",
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 3,
          restaurantName: "Pizza Corner",
          date: "Il y a 3 jours",
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center"
        }
      ];
    //   const recentScans: ScanItem[] = [];
  // Animation pour la flèche
  const arrowPosition = useSharedValue(0);

  useEffect(() => {
    arrowPosition.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Répéter indéfiniment
      true // Inverser l'animation
    );
  }, []);

  const arrowAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: arrowPosition.value }
      ]
    };
  });

  // Détection de la taille d'écran pour les classes dynamiques
  const isSmallScreen = SCREEN_WIDTH < 375;
  const arrowSize = isSmallScreen ? 48 : SCREEN_WIDTH < 414 ? 56 : 64;


  const renderScanItem = (scan: ScanItem) => (
    <TouchableOpacity
      key={scan.id}
      activeOpacity={0.7}
      className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100 mb-2"
    >
      <View className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg overflow-hidden mr-3 sm:mr-4 bg-gray-200">
        <Image
          source={{ uri: scan.image }}
          className="w-full h-full"
          resizeMode="cover"
          alt={scan.restaurantName}
        />
      </View>
      
      <View className="flex-1">
        <Text className="font-semibold text-gray-800 text-sm sm:text-base">
          {scan.restaurantName}
        </Text>
        <Text className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
          {scan.date}
        </Text>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={isSmallScreen ? 18 : 20} 
        color="#9ca3af" 
      />
    </TouchableOpacity>
  );

  return (
    <View className="px-4 sm:px-6 mb-6 sm:mb-8">
      {/* En-tête */}
      <View className="flex-row justify-between items-center mb-3 sm:mb-4">
        <Text className="text-lg sm:text-xl font-bold text-gray-800">
          Scans récents
        </Text>
      </View>

      {recentScans.length > 0 ? (
        <View className="space-y-2 sm:space-y-3">
          {recentScans.map(renderScanItem)}
        </View>
      ) : (
        <View className="relative">
          {/* Carte principale */}
          <Card className="bg-white border-gray-100 shadow-sm min-h-[200px] sm:min-h-[240px]">
            <CardContent className="flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
              <View className="items-center max-w-xs sm:max-w-sm">
                
                {/* Icône principale avec sparkles */}
                <View className="relative mb-4 sm:mb-6">
                  <View className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-violet-50 rounded-full items-center justify-center">
                    <View className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-violet-100 rounded-full items-center justify-center">
                      <Ionicons 
                        name="scan-outline" 
                        size={isSmallScreen ? 22 : SCREEN_WIDTH < 414 ? 28 : 32} 
                        color="#7C3AED" 
                      />
                    </View>
                  </View>
                  <View className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-6 h-6 sm:w-8 sm:h-8 items-center justify-center">
                    <Ionicons 
                      name="sparkles" 
                      size={isSmallScreen ? 12 : 14} 
                      color="#7C3AED" 
                    />
                  </View>
                </View>
                
                {/* Texte principal */}
                <Text className="text-gray-800 text-base sm:text-lg lg:text-xl font-semibold text-center mb-1 sm:mb-2 leading-tight">
                  Aucun scan pour le moment
                </Text>
                
                {/* Texte secondaire */}
                <Text className="text-gray-500 text-center text-xs sm:text-sm lg:text-base leading-relaxed px-2">
                  Scannez votre premier menu pour commencer
                </Text>
                
              </View>
            </CardContent>
          </Card>
          
          {/* Flèche animée qui chevauche */}
          <View 
            className="absolute bottom-0 left-1/2 items-center"
            style={{
              marginLeft: -(arrowSize / 2),
              transform: [{ translateY: arrowSize / 2 }]
            }}
          >
            <Animated.View 
              className="flex-row items-center justify-center bg-white rounded-full shadow-lg"
              style={[
                {
                  width: arrowSize,
                  height: arrowSize,
                  shadowColor: '#129EA1',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 4,
                }, 
                arrowAnimation
              ]}
            >
              <Ionicons 
                name="arrow-down" 
                size={isSmallScreen ? 24 : SCREEN_WIDTH < 414 ? 28 : 32} 
                color="#129EA1"
              />
            </Animated.View>
          </View>
          
        </View>
      )}
    </View>
  );
}