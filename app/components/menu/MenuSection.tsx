// app/components/menu/MenuSection.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { MenuSection as MenuSectionType, MenuItem as MenuItemType } from '../../types/menu';
import DietaryBadges from './DietaryBadges';

type MenuSectionProps = {
  section: MenuSectionType;
  onItemPress: (item: MenuItemType) => void;
  sectionKey?: string;
};

const MenuSection: React.FC<MenuSectionProps> = ({ 
  section, 
  onItemPress, 
  sectionKey 
}) => {
  return (
    <AccordionItem key={sectionKey || section.name} value={section.name}>
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
            onPress={() => onItemPress(item)}
            activeOpacity={0.9}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-4">
                <Text className="text-base font-medium text-gray-800">
                  {item.name}
                </Text>
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
  );
};

export default MenuSection;