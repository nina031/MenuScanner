// app/(tabs)/index.tsx
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Header from "../components/Header";
import { Card, CardContent, CardTitle, CardDescription } from "../components/ui/card";
import { Ionicons } from "@expo/vector-icons";
import RecentScans from "../components/Home/RecentScans";

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Feature = {
  icon: IconName;
  title: string;
  description: string;
  color: string;
};

export default function Index() {

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
      color: "#7C3AED"
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header />

      <View className="flex-1">
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

        {/* Section des scans recents */}
        <RecentScans />
      </View>
      
    </View>
  );
}