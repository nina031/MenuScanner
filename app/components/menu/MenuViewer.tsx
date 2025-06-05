// app/components/menu/MenuViewer.tsx
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Header';
import { Accordion } from '../ui/accordion';
import { useMenuFilters } from '../../hooks/useMenuFilters';
import { useMenuStore } from '../../stores/MenuStore';
import MenuFilters from './MenuFilters';
import { MenuItem as MenuItemType } from '../../types/menu';
import MenuItemModal from './MenuItem';
import MenuSection from './MenuSection';
import MenuSectionSkeleton from './MenuSectionSkeleton';

type MenuViewerProps = {
  onClose?: () => void;
};

const MenuViewer: React.FC<MenuViewerProps> = ({ onClose }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    currentMenu, 
    menuState, 
    menuSource,
    detectedSections, 
    completedSections, 
    loading, 
    error,
    scanId 
  } = useMenuStore();
  
  // Pour le streaming, on utilise les sections en temps réel, sinon on filtre
  const sectionsToFilter = menuState === 'streaming' 
    ? completedSections.map(s => s.section)
    : currentMenu?.sections || [];
    
  const { filteredSections, totalFilteredItems, hasActiveFilters } = useMenuFilters(sectionsToFilter);


  // Écran d'erreur
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
          <Text className="text-red-500 text-3xl">⚠️</Text>
        </View>
        <Text className="text-red-500 text-lg font-medium mb-2 text-center">
          Erreur de traitement
        </Text>
        <Text className="text-gray-700 text-center mb-4">
          {error}
        </Text>
        {scanId && (
          <Text className="text-gray-500 text-xs">
            ID: {scanId.substring(0, 8)}
          </Text>
        )}
      </View>
    );
  }

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
      >
        {/* Titre du menu */}
        <View className="px-4 pt-6 pb-4 items-center">
          <Text className="text-3xl text-gray-900 font-light tracking-wider">
            {currentMenu?.name || 'Menu'}
          </Text>
          <View className="h-0.5 w-32 bg-primary/30 rounded-full mt-2" />
        </View>
        
        {/* Menu complet (récents) */}
        {menuState === 'complete' && currentMenu && (
          <Accordion type="multiple" defaultValue={filteredSections.map((s) => s.name)}>
            {filteredSections.map((section, index) => (
              <MenuSection
                key={`${section.name}-${index}`}
                section={section}
                onItemPress={setSelectedItem}
                sectionKey={`${section.name}-${index}`}
              />
            ))}
          </Accordion>
        )}

        {/* Streaming en cours */}
        {menuState === 'streaming' && (
          <Accordion type="multiple" defaultValue={detectedSections}>
            {/* Sections complétées (filtrées) */}
            {filteredSections.map((section) => {
              // Retrouver l'ID original de la section pour la key
              const originalSectionData = completedSections.find(cs => cs.section.name === section.name);
              return (
                <MenuSection
                  key={originalSectionData?.id || section.name}
                  section={section}
                  onItemPress={setSelectedItem}
                  sectionKey={originalSectionData?.id || section.name}
                />
              );
            })}
            
            {/* Sections en attente avec skeletons */}
            {detectedSections.slice(completedSections.length).map((sectionName, index) => (
              <MenuSectionSkeleton
                key={`skeleton-${sectionName}-${index}`}
                sectionName={sectionName}
                itemCount={3}
              />
            ))}
          </Accordion>
        )}

        {/* Indicateur de chargement initial */}
        {loading && (!currentMenu || currentMenu.sections.length === 0) && (
          <View className="flex-1 justify-center items-center p-8">
            <ActivityIndicator size="large" color="#129EA1" />
            <Text className="mt-3 text-gray-500 text-center">
              {menuSource === 'scan' ? 'Analyse du menu en cours...' : 'Chargement du menu...'}
            </Text>
          </View>
        )}

        {/* Aucun résultat avec filtres */}
        {menuState === 'complete' && filteredSections.length === 0 && currentMenu && currentMenu.sections.length > 0 && (
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

export default MenuViewer;