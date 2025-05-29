import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

type DietaryBadgesProps = {
  dietary: string[];
  variant?: 'gradient' | 'simple';
  animate?: boolean;
  containerClassName?: string;
};

const DietaryBadges: React.FC<DietaryBadgesProps> = ({ 
  dietary,
  variant = 'simple',
  animate = false,
  containerClassName = ''
}) => {
  // Fonction pour obtenir les informations des badges diététiques
  const getDietInfo = (diet: string) => {
    const dietInfo = {
      'végétarien': {
        colors: ['#10B981', '#059669'] as const,
        icon: 'leaf',
        label: 'Végétarien',
        simpleStyle: ['bg-green-100', 'text-green-700']
      },
      'végétalien': {
        colors: ['#14B8A6', '#0D9488'] as const,
        icon: 'sprout',
        label: 'Végétalien',
        simpleStyle: ['bg-teal-100', 'text-teal-700']
      },
      'sans_gluten': {
        colors: ['#F59E0B', '#D97706'] as const,
        icon: 'barley-off',
        label: 'Sans gluten',
        simpleStyle: ['bg-amber-100', 'text-amber-700']
      },
      'sans_lactose': {
        colors: ['#3B82F6', '#2563EB'] as const,
        icon: 'cow-off',
        label: 'Sans lactose',
        simpleStyle: ['bg-blue-100', 'text-blue-700']
      }
    };
    
    return dietInfo[diet as keyof typeof dietInfo] || {
      colors: ['#6B7280', '#4B5563'] as const,
      icon: 'information-outline',
      label: diet,
      simpleStyle: ['bg-gray-100', 'text-gray-700']
    };
  };

  if (dietary.length === 0) return null;

  const BadgeWrapper = animate ? Animated.View : View;

  return (
    <View 
      className={containerClassName}
    >
      {dietary.map((diet, index) => {
        const dietInfo = getDietInfo(diet);

        if (variant === 'gradient') {
          return (
            <BadgeWrapper
              key={index}
              {...(animate && { entering: FadeIn.delay(index * 100).springify() })}
            >
              <LinearGradient
                colors={dietInfo.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-full px-3 py-1.5 mr-2 flex-row items-center"
                style={{
                  shadowColor: dietInfo.colors[0],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <MaterialCommunityIcons 
                  // @ts-ignore
                  name={dietInfo.icon} 
                  size={14} 
                  color="white" 
                  style={{ marginRight: 4 }}
                />
                <Text className="text-xs font-semibold text-white">
                  {dietInfo.label}
                </Text>
              </LinearGradient>
            </BadgeWrapper>
          );
        }

        return (
          <BadgeWrapper
            key={index}
            {...(animate && { entering: FadeIn.delay(index * 100).springify() })}
          >
            <View className={`${dietInfo.simpleStyle[0]} rounded-full px-2.5 py-0.5 mr-1.5 mb-1`}>
              <Text className={`text-xs ${dietInfo.simpleStyle[1]} font-medium`}>
                {dietInfo.label}
              </Text>
            </View>
          </BadgeWrapper>
        );
      })}
    </View>
  );
};

export default DietaryBadges;
