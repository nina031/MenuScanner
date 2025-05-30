// app/components/Header.tsx
import { Ionicons, AntDesign} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useSegments } from "expo-router";

type HeaderProps = {
  onLeftPress?: () => void;
  onRightPress?: () => void;
  filteredItemsCount?: number;
  hasActiveFilters?: boolean;
};

export default function Header({ onLeftPress, onRightPress, filteredItemsCount, hasActiveFilters }: HeaderProps) {
    const router = useRouter();
    const segments = useSegments();
    
    // Déterminer l'onglet actuel
    const currentTab = segments[1] || 'index'; // segments[0] est "(tabs)", segments[1] est l'onglet
    
    const handleLeftPress = () => {
        if (onLeftPress) {
            onLeftPress();
        } else if (currentTab === 'scan') {
            router.back();
        }
        // Pour l'onglet home, on peut ajouter une action par défaut si nécessaire
    };
    
    const handleRightPress = () => {
        if (onRightPress) {
            onRightPress();
        }
        // Actions par défaut selon l'onglet si nécessaire
    };
    
    // Configuration des icônes selon l'onglet
    const getHeaderConfig = () => {
        switch (currentTab) {
            case 'scan':
                return {
                    leftIcon: 'chevron-back' as const,
                    rightIcon: 'filter' as const,
                    rightIconType: 'AntDesign' as const,
                };
            case 'index':
            default:
                return {
                    leftIcon: 'globe-outline' as const,
                    rightIcon: 'moon-outline' as const,
                    rightIconType: 'Ionicons' as const,
                };
        }
    };
    
    const { leftIcon, rightIcon, rightIconType } = getHeaderConfig();
    
    return (
        <View className="w-full">
            <LinearGradient
                colors={['#9AD6D6', '#129EA1']}
                className="w-full"
            >
                <SafeAreaView edges={['top']} className="w-full">
                    <View className="flex-row justify-between items-center px-4 py-4">
                        <TouchableOpacity 
                            activeOpacity={0.7}
                            className="w-10 h-10 rounded-full items-center justify-center bg-white/10"
                            onPress={handleLeftPress}
                        >
                            <Ionicons name={leftIcon} size={22} color="white" />
                        </TouchableOpacity>
                        
                        <View className="relative">
                            <TouchableOpacity 
                                activeOpacity={0.7}
                                className="w-10 h-10 rounded-full items-center justify-center bg-white/10"
                                onPress={handleRightPress}
                            >
                                {rightIconType === 'AntDesign' ? 
                                    <AntDesign name={rightIcon} size={22} color="white" /> :
                                    <Ionicons name={rightIcon} size={22} color="white" />
                                }
                            </TouchableOpacity>
                            {hasActiveFilters && filteredItemsCount && filteredItemsCount > 0 && (
                                <View className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 items-center justify-center">
                                    <Text className="text-xs text-[#129EA1] font-medium">{filteredItemsCount}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}