// app/components/Header.tsx
import { Ionicons, AntDesign} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";

type HeaderProps = {
  onLeftPress?: () => void;
  onRightPress?: () => void;
  filteredItemsCount?: number;
  hasActiveFilters?: boolean;
};

export default function Header(props: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    
    // Actions par défaut pour les boutons
    const handleLanguagePress = () => {
        console.log('Language button pressed - TODO: implement language selection');
        // TODO: Implémenter la sélection de langue
    };
    
    const handleDarkModePress = () => {
        console.log('Dark mode button pressed - TODO: implement dark mode toggle');
        // TODO: Implémenter le toggle dark mode
    };
    
    // Éviter l'accès direct aux props pour éviter les erreurs de rendu
    const handleLeftPress = () => {
        if (props.onLeftPress) {
            props.onLeftPress();
        } else if (currentTab === 'scan') {
            router.back();
        } else {
            handleLanguagePress();
        }
    };
    
    const handleRightPress = () => {
        if (props.onRightPress) {
            props.onRightPress();
        } else if (currentTab !== 'scan') {
            handleDarkModePress();
        }
    };
    
    const itemCount = (props.filteredItemsCount && typeof props.filteredItemsCount === 'number') ? props.filteredItemsCount : 0;
    const showFilters = Boolean(props.hasActiveFilters);
    
    // Détecter l'onglet actuel basé sur le pathname
    const getCurrentTab = () => {
        if (pathname === '/' || pathname === '/index') return 'index';
        if (pathname === '/scan') return 'scan';
        if (pathname === '/profile') return 'profile';
        if (pathname?.includes('/menus/')) return 'scan'; // Page de menu = mode scan
        return 'scan'; // Par défaut
    };
    
    const currentTab = getCurrentTab();
    
    
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
                return {
                    leftIcon: 'globe-outline' as const,
                    rightIcon: 'moon-outline' as const,
                    rightIconType: 'Ionicons' as const,
                };
            case 'profile':
                return {
                    leftIcon: 'globe-outline' as const,
                    rightIcon: 'moon-outline' as const,
                    rightIconType: 'Ionicons' as const,
                };
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
                            {showFilters && itemCount > 0 && (
                                <View className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 items-center justify-center">
                                    <Text className="text-xs text-[#129EA1] font-medium">{itemCount}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}