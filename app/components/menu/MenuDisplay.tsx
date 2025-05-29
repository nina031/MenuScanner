import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Menu, MenuSection as MenuSectionType, MenuItem as MenuItemType } from '../../types/menu';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MenuItemDetails from './MenuItemDetails';

type MenuDisplayProps = {
  menu: Menu;
  onClose?: () => void;
};

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(menu.sections.map(section => section.name));
  const [filterVisible, setFilterVisible] = useState(false);
  const navigation = useNavigation();

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header avec bouton de retour et filtre */}
      <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          {onClose && (
            <TouchableOpacity onPress={onClose} className="w-10 h-10 justify-center items-center rounded-full bg-gray-50">
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          
          <Text className="text-xl font-bold text-gray-800">Menu Scanné</Text>
          
          <TouchableOpacity 
            onPress={() => setFilterVisible(true)} 
            className="w-10 h-10 justify-center items-center rounded-full bg-gray-50"
          >
            <Ionicons name="options-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView className="flex-1">
        {menu.sections.map((section, index) => (
          <MenuSection 
            key={`${section.name}-${index}`}
            section={section}
            isExpanded={expandedSections.includes(section.name)}
            onToggle={() => toggleSection(section.name)}
          />
        ))}
        
        {/* Espace en bas pour permettre le défilement complet */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

type MenuSectionProps = {
  section: MenuSectionType;
  isExpanded: boolean;
  onToggle: () => void;
};

const MenuSection: React.FC<MenuSectionProps> = ({ section, isExpanded, onToggle }) => {
  return (
    <View className="mb-4 mx-4 mt-4 bg-white rounded-xl overflow-hidden shadow-sm">
      <TouchableOpacity 
        onPress={onToggle}
        className="flex-row justify-between items-center p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View className="w-1.5 h-8 bg-primary rounded-full mr-3" />
          <Text className="text-lg font-bold text-gray-800">{section.name}</Text>
        </View>
        <View className="w-8 h-8 rounded-full bg-gray-50 justify-center items-center">
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={18} 
            color="#666" 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View>
          {section.items.map((item, itemIndex) => (
            <MenuItem 
              key={`${item.name}-${itemIndex}`} 
              item={item} 
              isLast={itemIndex === section.items.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

type MenuItemProps = {
  item: MenuItemType;
  isLast?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({ item, isLast = false }) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Générer une couleur pour les badges diététiques
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
    <>
      <TouchableOpacity 
        onPress={() => setShowFullDetails(true)}
        className={`px-4 py-3 flex-1 ${!isLast ? 'border-b border-gray-100' : ''}`}
        activeOpacity={0.6}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-2">
            <Text className="text-base font-medium text-gray-800">{item.name}</Text>
            
            {/* Tags diététiques horizontaux */}
            {item.dietary.length > 0 && (
              <View className="flex-row flex-wrap mt-1">
                {item.dietary.map((diet, index) => {
                  const [bgColor, textColor] = getDietColor(diet);
                  return (
                    <View key={index} className={`${bgColor} rounded-full px-2 py-0.5 mr-1.5 mb-1`}>
                      <Text className={`text-xs ${textColor}`}>
                        {diet.charAt(0).toUpperCase() + diet.slice(1).replace('_', ' ')}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
            
            {/* Description courte */}
            <Text numberOfLines={2} className="text-sm text-gray-500 mt-1">
              {item.description}
            </Text>
          </View>
          
          <View className="bg-gray-50 px-2.5 py-1.5 rounded-lg">
            <Text className="text-base font-bold text-primary">
              {item.price.value}{item.price.currency}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Modal pour afficher les détails complets */}
      <Modal
        visible={showFullDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFullDetails(false)}
      >
        <MenuItemDetails item={item} onClose={() => setShowFullDetails(false)} />
      </Modal>
    </>
  );
};

export default MenuDisplay;
