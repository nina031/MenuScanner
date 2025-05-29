// app/components/menu/MenuDisplay.tsx
import React from 'react';
import { View, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Header from '../Header';
import MenuItemModal from './MenuItem';
import MenuFilters from './MenuFilters';
import { Menu } from '../../types/menu';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';
import { MenuItem as MenuItemType } from '../../types/menu';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MenuDisplayProps = {
  menu: Menu;
  onClose?: () => void;
};

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu }) => {
  const [selectedItem, setSelectedItem] = React.useState<MenuItemType | null>(null);
  const scrollY = useSharedValue(0);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 100], [0, -50], Extrapolate.CLAMP);
    return {
      transform: [{ translateY }],
    };
  });

  // Fonction pour obtenir les couleurs des badges diététiques
  const getDietColor = (diet: string) => {
    const colors = {
      'végétarien': ['bg-green-100', 'text-green-700'],
      'végétalien': ['bg-teal-100', 'text-teal-700'],
      'sans_gluten': ['bg-amber-100', 'text-amber-700'],
      'sans_lactose': ['bg-blue-100', 'text-blue-700']
    };
    
    return colors[diet as keyof typeof colors] || ['bg-gray-100', 'text-gray-700'];
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 50 }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <Accordion type="multiple" defaultValue={menu.sections.map((s) => s.name)}>
          {menu.sections.map((section, index) => (
            <AccordionItem key={`${section.name}-${index}`} value={section.name}>
              <AccordionTrigger
                className="mx-4 mt-4 bg-primary/5 rounded-xl px-5 py-4 flex-row justify-between items-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 10,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-1.5 h-8 bg-primary/80 rounded-full mr-4" />
                  <Text className="text-lg font-semibold text-gray-900">{section.name}</Text>
                </View>
              </AccordionTrigger>

              <AccordionContent className="bg-white mt-2 mx-4 rounded-xl border border-gray-200">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={`${item.name}-${itemIndex}`}
                    onPress={() => setSelectedItem(item)}
                    className={`px-5 py-4 ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-200' : ''}`}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 pr-3">
                        <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                        
                        <Text numberOfLines={2} className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </Text>
                        {/* Badges des régimes alimentaires */}
                        {item.dietary.length > 0 && (
                          <View className="flex-row flex-wrap mt-4 mb-1">
                            {item.dietary.map((diet, dietIndex) => {
                              const [bgColor, textColor] = getDietColor(diet);
                              return (
                                <View 
                                  key={dietIndex} 
                                  className={`${bgColor} rounded-full px-2.5 py-0.5 mr-1.5 mb-1`}
                                >
                                  <Text className={`text-xs ${textColor} font-medium`}>
                                    {diet.charAt(0).toUpperCase() + diet.slice(1).replace('_', ' ')}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                      <View className="ml-3">
                        <Text className="text-base font-bold text-primary">
                          {item.price.value.toFixed(2)}{item.price.currency}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <View className="h-24" />
      </ScrollView>

      <MenuFilters visible={false} onClose={() => {}} />
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </View>
  );
};

export default MenuDisplay;