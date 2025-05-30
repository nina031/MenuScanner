// app/components/menu/MenuDisplay.tsx
import React, { useState } from 'react';
import { View, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DietaryBadges from './DietaryBadges';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
import { useMenuFilters } from '../../hooks/useMenuFilters';
import { useMenuFilterStore } from '../../stores/MenuFilterStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MenuDisplayProps = {
  menu: Menu;
  onClose?: () => void;
};

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu }) => {
  const [selectedItem, setSelectedItem] = React.useState<MenuItemType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const scrollY = useSharedValue(0);
  
  const { filteredSections, totalFilteredItems, hasActiveFilters } = useMenuFilters(menu.sections);
  const { dietary } = useMenuFilterStore();

  return (
    <View className="flex-1 bg-gray-50">
      <Header 
        onRightPress={() => setShowFilters(true)}
        filteredItemsCount={totalFilteredItems}
        hasActiveFilters={hasActiveFilters}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View className="px-4 pt-6 pb-4 items-center">
          <Text className="text-3xl text-gray-900 font-light tracking-wider">{menu.name}</Text>
          <View className="h-0.5 w-32 bg-primary/30 rounded-full mt-2" />
        </View>
        
        {filteredSections.length > 0 ? (
          <Accordion type="multiple" defaultValue={filteredSections.map((s) => s.name)}>
            {filteredSections.map((section, index) => (
              <AccordionItem key={`${section.name}-${index}`} value={section.name}>
                <AccordionTrigger
                  className="mx-4 mt-4 bg-primary/15 rounded-xl px-5 py-4 flex-row justify-between items-center"
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
                    <Text className="text-lg font-semibold text-gray-900">
                      {section.name}
                    </Text>
                  </View>
                </AccordionTrigger>

                <AccordionContent className="mt-4 mx-4 -space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={`${item.name}-${itemIndex}`}
                      className="px-5 py-3.5 bg-white rounded-lg border border-gray-100 active:bg-gray-50 my-1"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 3,
                        elevation: 2
                      }}
                      onPress={() => setSelectedItem(item)}
                      activeOpacity={0.9}
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-4">
                          <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                          <Text numberOfLines={2} className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </Text>
                        </View>
                        <Text className="text-base font-bold text-primary">
                          {item.price.value.toFixed(2)}{item.price.currency}
                        </Text>
                      </View>

                      {item.dietary.length > 0 && (
                        <View className="mt-6">
                          <DietaryBadges
                            dietary={item.dietary}
                            containerClassName="flex-row flex-wrap"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <View className="flex-1 justify-center items-center p-8">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="search-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Aucun plat trouvé
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Essayez de modifier vos filtres pour voir plus de résultats
            </Text>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      <MenuFilters visible={showFilters} onClose={() => setShowFilters(false)} />
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </View>
  );
};

export default MenuDisplay;