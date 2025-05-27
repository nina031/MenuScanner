import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">Bienvenue</Text>
          <Text className="text-lg text-gray-600 mt-2">Découvrez nos fonctionnalités</Text>
          
          <View className="mt-8 space-y-4">
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-lg font-semibold text-gray-900">Scanner un menu</Text>
              <Text className="text-gray-600 mt-1">Utilisez votre appareil photo pour scanner un menu</Text>
            </View>
            
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-lg font-semibold text-gray-900">Historique</Text>
              <Text className="text-gray-600 mt-1">Retrouvez vos précédentes analyses</Text>
            </View>
            
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-lg font-semibold text-gray-900">Préférences</Text>
              <Text className="text-gray-600 mt-1">Personnalisez votre expérience</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
