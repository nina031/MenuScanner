// app/(tabs)/index.tsx
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Ionicons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Feature = {
  icon: IconName;
  title: string;
  description: string;
  color: string;
};

export default function Index() {
  // Données simulées pour les scans récents
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

  const features: Feature[] = [
    {
      icon: "scan-outline",
      title: "Scan",
      description: "Scan instantané de vos menus",
      color: "#FF6B6B"
    },
    {
      icon: "language-outline",
      title: "Traduction",
      description: "Traduction automatique",
      color: "#4ECDC4"
    },
    {
      icon: "shield-checkmark-outline",
      title: "Filtrage IA",
      description: "Régimes et allergènes",
      color: "#45B7D1"
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header />

      <View 
        className="flex-1" 
      >
        {/* Logo et titre */}
        <View className="px-6 py-8 items-center">
          <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center mb-4 shadow-lg">
            <Ionicons name="restaurant" size={32} color="#2A9D8F" />
          </View>
          
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            MenuScanner
          </Text>
          <Text className="text-gray-600 text-center text-base">
            Scannez, traduisez et filtrez vos menus en un clin d'œil
          </Text>
        </View>

          {/* Section des fonctionnalités */}
          <View className="mb-6 px-6">
            <View className="flex-row gap-3">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white border-gray-50 flex-1">
                  <CardContent className="p-3 items-center">
                    <View 
                      className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Ionicons 
                        name={feature.icon} 
                        size={20} 
                        color={feature.color} 
                      />
                    </View>
                    <CardTitle className="text-xs font-semibold text-gray-800 text-center mb-1">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>

        {/* Section des scans récents */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Scans récents
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-primary font-semibold">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          {recentScans.length > 0 ? (
            <View className="space-y-3">
              {recentScans.map((scan) => (
                <TouchableOpacity
                  key={scan.id}
                  activeOpacity={0.7}
                  className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100"
                >
                  <View className="w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-200">
                    <Image
                      source={{ uri: scan.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">
                      {scan.restaurantName}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {scan.date}
                    </Text>
                  </View>
                  
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card className="bg-white border-gray-100">
              <CardContent className="items-center py-8">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="document-text-outline" size={32} color="#9ca3af" />
                </View>
                <Text className="text-gray-500 text-center text-base">
                  Aucun scan récent
                </Text>
                <Text className="text-gray-400 text-center text-sm mt-1">
                  Commencez par scanner votre premier menu
                </Text>
              </CardContent>
            </Card>
          )}
        </View>
      </View>
    </View>
  );
}