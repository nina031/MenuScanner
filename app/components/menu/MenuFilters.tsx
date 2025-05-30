// app/components/menu/MenuFilters.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutRight,
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useMenuFilterStore, DietaryFilter, SortOption } from '../../stores/MenuFilterStore';

type MenuFiltersProps = {
  visible: boolean;
  onClose: () => void;
};

const MenuFilters: React.FC<MenuFiltersProps> = ({ visible, onClose }) => {
  const {
    dietary,
    priceRange,
    sortBy,
    toggleDietaryFilter,
    setPriceRange,
    setSortBy,
    resetFilters,
  } = useMenuFilterStore();

  const dietaryOptions = [
    { id: 'végétarien' as DietaryFilter, label: 'Végétarien', icon: 'leaf', color: '#10B981' },
    { id: 'végétalien' as DietaryFilter, label: 'Végétalien', icon: 'sprout', color: '#14B8A6' },
    { id: 'sans_gluten' as DietaryFilter, label: 'Sans gluten', icon: 'barley-off', color: '#F59E0B' },
    { id: 'sans_lactose' as DietaryFilter, label: 'Sans lactose', icon: 'cow-off', color: '#3B82F6' },
  ];

  const handleApply = () => {
    onClose();
  };

  const handleReset = () => {
    resetFilters();
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
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="absolute inset-0"
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={onClose}
            className="flex-1 bg-black/50"
          />
        </Animated.View>

        <Animated.View 
          entering={SlideInRight.springify().damping(35).stiffness(300).mass(0.5)}
          exiting={SlideOutRight.duration(200).easing(Easing.bezier(0.4, 0, 0.2, 1))}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl h-[90%]"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100 bg-white rounded-t-3xl">
            <Text className="text-xl font-bold text-gray-900">Filtres</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
            {/* Filtres diététiques */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Régimes alimentaires
              </Text>
              <View>
                {dietaryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => toggleDietaryFilter(option.id)}
                    className={`flex-row items-center p-5 rounded-xl border mb-4 ${
                      dietary.includes(option.id)
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
                    {dietary.includes(option.id) && (
                      <Ionicons name="checkmark-circle" size={24} color="#129EA1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Boutons d'action */}
            <View className="flex-row items-center justify-between gap-4 mb-6 px-4">
              <TouchableOpacity
                onPress={handleReset}
                className="w-[45%] py-4 rounded-xl border border-gray-300 bg-white"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Réinitialiser
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="w-[45%] py-4 rounded-xl bg-primary"
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