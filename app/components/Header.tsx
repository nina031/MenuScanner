import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
    return (
        <View className="w-full">
            <LinearGradient
                colors={['#A2DEDE', '#129EA1']}
                className="w-full"
            >
                <SafeAreaView edges={['top']} className="w-full">
                    <View className="flex-row justify-between items-center px-4 py-4">
                        <TouchableOpacity 
                            activeOpacity={0.7}
                            className="w-10 h-10 rounded-full items-center justify-center bg-white/10"
                        >
                            <Ionicons name="globe-outline" size={22} color="white" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            activeOpacity={0.7}
                            className="w-10 h-10 rounded-full items-center justify-center bg-white/10"
                        >
                            <Ionicons name="menu-outline" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}