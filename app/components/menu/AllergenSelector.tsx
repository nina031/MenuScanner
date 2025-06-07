import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from '../ui/input';
import { colors } from '../../../src/lib/theme';
import { ALLERGENS, Allergen } from '../../../src/types/menu';
import { useMenuFilterStore } from '../../../src/stores/MenuFilterStore';

interface AllergenSelectorProps {
  className?: string;
}

// Icônes et couleurs pour chaque allergène
const allergenConfig: Record<Allergen, { icon: string; color: string; description: string }> = {
  'Gluten': { icon: 'grain', color: '#F59E0B', description: 'Blé, avoine, seigle' },
  'Produits laitiers': { icon: 'cow', color: '#3B82F6', description: 'Lait, fromage, beurre' },
  'Œufs': { icon: 'egg', color: '#FDE047', description: 'Œufs de poule' },
  'Fruits à coque': { icon: 'peanut', color: '#A3A3A3', description: 'Noix, amandes, noisettes' },
  'Arachides': { icon: 'peanut-outline', color: '#DC2626', description: 'Cacahuètes' },
  'Soja': { icon: 'soy-sauce', color: '#16A34A', description: 'Sauce soja, tofu' },
  'Poissons': { icon: 'fish', color: '#0EA5E9', description: 'Tous poissons' },
  'Crustacés': { icon: 'fishbowl', color: '#F97316', description: 'Crevettes, crabes' },
  'Mollusques': { icon: 'jellyfish', color: '#8B5CF6', description: 'Moules, escargots' },
  'Céleri': { icon: 'carrot', color: '#84CC16', description: 'Légume et épice' },
  'Moutarde': { icon: 'bottle-wine', color: '#EAB308', description: 'Graines et condiment' },
  'Sésame': { icon: 'seed', color: '#D97706', description: 'Graines de sésame' },
  'Sulfites': { icon: 'test-tube', color: '#EC4899', description: 'Conservateurs E220-E228' },
  'Lupin': { icon: 'flower', color: '#6366F1', description: 'Légumineuse' },
};

export default function AllergenSelector({ 
  className 
}: AllergenSelectorProps) {
  const { allergens: selectedAllergens, toggleAllergen, resetAllergenFilters } = useMenuFilterStore();
  const [searchTerm, setSearchTerm] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const filteredAllergens = ALLERGENS.filter(allergen =>
    allergen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View className={className}>
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.primary.DEFAULT} />
            <Text className="text-lg font-bold text-gray-900 ml-3">
              Allergies alimentaires
            </Text>
          </View>
          {selectedAllergens.length > 0 && (
            <View className="relative">
              <TouchableOpacity
                onPress={resetAllergenFilters}
                className="w-9 h-9 rounded-xl bg-white border border-primary-200 justify-center items-center"
                style={{
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons 
                  name="funnel" 
                  size={14} 
                  color={colors.primary.DEFAULT} 
                />
              </TouchableOpacity>
              <View className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full justify-center items-center border-2 border-white">
                <Text className="text-white text-sm font-bold">
                  {selectedAllergens.length}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <Text className="text-sm text-gray-600 mb-4">
          Sélectionnez vos allergies pour exclure automatiquement les plats concernés
        </Text>

        {/* Barre de recherche */}
        <View className="relative mb-4">
          <Input
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="🔍 Rechercher un allergène..."
            className="pl-4"
            onFocus={() => {
              // Scroll to top when search is focused to ensure visibility
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        className="max-h-80"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-3 pb-4">
          {filteredAllergens.map((allergen) => {
            const isSelected = selectedAllergens.includes(allergen);
            const config = allergenConfig[allergen];
            
            return (
              <TouchableOpacity
                key={allergen}
                onPress={() => toggleAllergen(allergen)}
                className={`flex-row items-center p-3 rounded-2xl border ${
                  isSelected 
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-white border-gray-100'
                }`}
                style={{
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                {/* Icône */}
                <View 
                  className={`w-10 h-10 rounded-xl justify-center items-center mr-3 ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-50'
                  }`}
                >
                  <MaterialCommunityIcons 
                    name={config.icon as any} 
                    size={20} 
                    color={isSelected ? colors.primary.DEFAULT : config.color} 
                  />
                </View>

                {/* Contenu */}
                <View className="flex-1">
                  <Text className={`text-base font-medium ${
                    isSelected ? 'text-primary-700' : 'text-gray-900'
                  }`}>
                    {allergen}
                  </Text>
                  <Text className={`text-sm ${
                    isSelected ? 'text-primary-500' : 'text-gray-500'
                  }`}>
                    {config.description}
                  </Text>
                </View>

                {/* Checkbox minimaliste */}
                <View className={`w-5 h-5 rounded-full border-2 justify-center items-center ${
                  isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

    </View>
  );
}