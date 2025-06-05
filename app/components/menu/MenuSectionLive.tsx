// app/components/menu/MenuSectionLive.tsx
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { MenuSection } from '../../types/menu';

type MenuSectionLiveProps = {
  section: MenuSection;
  index: number;
  timestamp: number;
};

const MenuSectionLive: React.FC<MenuSectionLiveProps> = ({ section, index, timestamp }) => {
  const displayTime = new Date(timestamp).toLocaleTimeString();
  
  console.log(`🎨 RENDU MenuSectionLive ${index + 1}: ${section.name} à ${displayTime}`);
  
  return (
    <Animated.View
      key={`section-${section.name}-${timestamp}`} // Key unique basée sur le timestamp
      entering={SlideInDown.delay(index * 100).springify()}
      className="mb-6 bg-white rounded-xl border border-gray-100 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header de section */}
      <View className="bg-primary/10 px-4 py-3 border-b border-primary/20">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-primary rounded-full mr-3" />
          <Text className="text-lg font-semibold text-gray-900 flex-1">
            {section.name}
          </Text>
          <View className="bg-primary/20 px-2 py-1 rounded-full mr-2">
            <Text className="text-xs font-medium text-primary">
              {section.items.length} plats
            </Text>
          </View>
          {/* Badge temps réel */}
          <View className="bg-green-500 px-2 py-1 rounded-full">
            <Text className="text-xs font-medium text-white">
              🔴 {displayTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Items de la section */}
      <View className="p-4">
        {section.items.map((item, itemIndex) => (
          <Animated.View
            key={`${item.name}-${itemIndex}-${timestamp}`}
            entering={FadeIn.delay(200 + (50 * itemIndex))}
            className="py-3 border-b border-gray-50 last:border-b-0"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-3">
                <Text className="font-medium text-gray-900 mb-1">
                  {item.name}
                </Text>
                {item.description && (
                  <Text className="text-sm text-gray-600" numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Text className="font-bold text-primary">
                {item.price.value.toFixed(2)}{item.price.currency}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

export default React.memo(MenuSectionLive);