// app/components/menu/MenuDisplay.tsx
import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DietaryBadges from './DietaryBadges';
import Animated, {
  useSharedValue,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import Header from '../Header';
import MenuItemModal from './MenuItem';
import { Menu, MenuItem as MenuItemType } from '../../types/menu';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';

type MenuDisplayProps = {
  menu: Menu;
  onClose?: () => void;
};

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const scrollY = useSharedValue(0);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Header du restaurant */}
        <View className="px-4 pt-6 pb-4 items-center">
          <Text className="text-3xl text-gray-900 font-light tracking-wider">
            {menu.name}
          </Text>
          <View className="h-0.5 w-32 bg-primary/30 rounded-full mt-2" />
          
          {/* Stats du menu */}
          <View className="flex-row items-center mt-4">
            <View className="flex-row items-center">
              <Ionicons name="restaurant-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {menu.sections.reduce((acc, section) => acc + section.items.length, 0)} plats
              </Text>
            </View>
            <View className="w-0.5 h-4 bg-gray-300 rounded-full mx-4" />
            <View className="flex-row items-center">
              <Ionicons name="leaf-outline" size={16} color="#10B981" />
              <Text className="text-sm text-gray-600 ml-1">Options végé</Text>
            </View>
          </View>
        </View>

        {/* Sections avec Accordion */}
        <View className="px-4 pb-20">
          <Accordion type="multiple" defaultValue={menu.sections.map((s) => s.name)}>
            {menu.sections.map((section, sectionIndex) => (
              <Animated.View
                key={`${section.name}-${sectionIndex}`}
                entering={FadeInDown.delay(sectionIndex * 100).springify()}
              >
                <AccordionItem value={section.name}>
                  <AccordionTrigger className="my-2 bg-primary/15 rounded-xl px-5 py-4 border border-gray-100">
                    <View className="flex-row items-center justify-between flex-1">
                      <Text className="text-lg font-semibold text-gray-900 tracking-wide">
                        {section.name}
                      </Text>
                    </View>
                  </AccordionTrigger>

                  <AccordionContent className="mt-3">
                    {section.items.map((item, itemIndex) => (
                      <Animated.View
                        key={`${item.name}-${itemIndex}`}
                        entering={FadeIn.delay(itemIndex * 50).springify()}
                        className="mb-3"
                      >
                        <TouchableOpacity
                          onPress={() => setSelectedItem(item)}
                          activeOpacity={0.98}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                        >
                          <View className="p-4">
                            {/* En-tête du plat avec prix */}
                            <View className="flex-row justify-between items-start mb-2">
                              <View className="flex-1 pr-3">
                                <Text className="text-base font-medium text-gray-800">
                                  {item.name}
                                </Text>
                              </View>
                              <Text className="text-base font-bold text-primary">
                                {item.price.value.toFixed(2)}{item.price.currency}
                              </Text>
                            </View>

                            {/* Description */}
                            <Text 
                              numberOfLines={2} 
                              className="text-sm text-gray-600 leading-5 mb-3"
                            >
                              {item.description}
                            </Text>

                            {/* Badges diététiques */}
                            {item.dietary.length > 0 && (
                              <DietaryBadges
                                dietary={item.dietary}
                                containerClassName="flex-row flex-wrap"
                                variant="simple"
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Animated.View>
            ))}
          </Accordion>
        </View>
      </ScrollView>

      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </View>
  );
};

export default MenuDisplay;