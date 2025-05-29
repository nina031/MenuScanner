// app/components/menu/MenuFilters.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

type MenuFiltersProps = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
};

type FilterState = {
  dietary: string[];
  priceRange: [number, number];
  sortBy: 'price' | 'name' | 'none';
};

const MenuFilters: React.FC<MenuFiltersProps> = ({ visible, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    dietary: [],
    priceRange: [0, 50],
    sortBy: 'none'
  });

  const dietaryOptions = [
    { id: 'végétarien', label: 'Végétarien', icon: 'leaf', color: '#10B981' },
    { id: 'végétalien', label: 'Végétalien', icon: 'sprout', color: '#14B8A6' },
    { id: 'sans_gluten', label: 'Sans gluten', icon: 'barley-off', color: '#F59E0B' },
    { id: 'sans_lactose', label: 'Sans lactose', icon: 'cow-off', color: '#3B82F6' },
  ];

  const toggleDietaryFilter = (diet: string) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet]
    }));
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dietary: [],
      priceRange: [0, 50],
      sortBy: 'none'
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute inset-0"
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={onClose}
            className="flex-1 bg-black/50"
          />
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.springify()}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80%]"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Filtres</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
            {/* Filtres diététiques */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Régimes alimentaires
              </Text>
              <View className="space-y-3">
                {dietaryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => toggleDietaryFilter(option.id)}
                    className={`flex-row items-center p-4 rounded-xl border ${
                      filters.dietary.includes(option.id)
                        ? 'bg-primary/10 border-primary'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <View 
                      className="w-10 h-10 rounded-full justify-center items-center mr-3"
                      style={{ backgroundColor: option.color + '20' }}
                    >
                      <MaterialCommunityIcons 
                        // @ts-ignore
                        name={option.icon} 
                        size={20} 
                        color={option.color} 
                      />
                    </View>
                    <Text className="flex-1 text-base font-medium text-gray-800">
                      {option.label}
                    </Text>
                    {filters.dietary.includes(option.id) && (
                      <Ionicons name="checkmark-circle" size={24} color="#129EA1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tri */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Trier par
              </Text>
              <View className="flex-row space-x-3">
                {[
                  { value: 'none', label: 'Par défaut' },
                  { value: 'price', label: 'Prix' },
                  { value: 'name', label: 'Nom' }
                ].map((sortOption) => (
                  <TouchableOpacity
                    key={sortOption.value}
                    onPress={() => setFilters(prev => ({ ...prev, sortBy: sortOption.value as any }))}
                    className={`flex-1 py-3 rounded-xl border ${
                      filters.sortBy === sortOption.value
                        ? 'bg-primary border-primary'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text 
                      className={`text-center font-medium ${
                        filters.sortBy === sortOption.value
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {sortOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Boutons d'action */}
            <View className="flex-row space-x-3 mb-6">
              <TouchableOpacity
                onPress={handleReset}
                className="flex-1 py-4 rounded-xl border border-gray-300 bg-white"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Réinitialiser
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 py-4 rounded-xl bg-primary"
              >
                <Text className="text-center font-semibold text-white">
                  Appliquer
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MenuFilters;