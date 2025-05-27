import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../app/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../app/components/ui/card";
export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <SafeAreaView style={{ flex: 1 }} className="bg-white">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-2xl font-bold text-primary">Bienvenue sur MenuScanner</Text>
            <Text className="text-gray-600 mt-2">Commencez par scanner un menu</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
