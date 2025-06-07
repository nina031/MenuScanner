// app/components/menu/MenuFilters.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../src/lib/theme';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutRight,
  Easing
} from 'react-native-reanimated';
import { useMenuFilterStore, DietaryFilter } from '../../../src/stores/MenuFilterStore';
import AllergenSelector from './AllergenSelector';

type MenuFiltersProps = {
  visible: boolean;
  onClose: () => void;
};

const MenuFilters: React.FC<MenuFiltersProps> = ({ visible, onClose }) => {
  const {
    dietary,
    toggleDietaryFilter,
    resetFilters,
    resetDietaryFilters,
  } = useMenuFilterStore();

  const dietaryOptions = [
    { id: 'végétarien' as DietaryFilter, label: 'Végétarien', icon: 'leaf', color: '#10B981' },
    { id: 'vegan' as DietaryFilter, label: 'Vegan', icon: 'sprout', color: '#14B8A6' },
    { id: 'pescetarien' as DietaryFilter, label: 'Pescetarien', icon: 'fish', color: '#06B6D4' },
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
          <KeyboardAvoidingView 
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
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

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Filtres diététiques */}
            <View className="px-5 py-6 border-b border-gray-100">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Ionicons name="restaurant-outline" size={24} color={colors.primary.DEFAULT} />
                  <Text className="text-lg font-bold text-gray-900 ml-3">
                    Régimes alimentaires
                  </Text>
                </View>
                {dietary.length > 0 && (
                  <View className="relative">
                    <TouchableOpacity
                      onPress={resetDietaryFilters}
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
                        {dietary.length}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              
              <Text className="text-sm text-gray-600 mb-4">
                Filtrez selon vos préférences alimentaires
              </Text>

              <View className="gap-3">
                {dietaryOptions.map((option) => {
                  const isSelected = dietary.includes(option.id);
                  
                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleDietaryFilter(option.id)}
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
                          name={option.icon as any} 
                          size={20} 
                          color={isSelected ? colors.primary.DEFAULT : option.color} 
                        />
                      </View>
                      
                      {/* Contenu */}
                      <View className="flex-1">
                        <Text className={`text-base font-medium ${
                          isSelected ? 'text-primary-700' : 'text-gray-900'
                        }`}>
                          {option.label}
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

            </View>

            {/* Sélecteur d'allergènes */}
            <View className="px-5 py-6">
              <AllergenSelector />
            </View>
            </ScrollView>

            {/* Boutons d'action */}
            <View className="px-5 pt-4 pb-6 bg-white border-t border-gray-100">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleReset}
                  className="flex-1 py-4 rounded-2xl border border-gray-200 bg-gray-50 active:bg-gray-100"
                  style={{
                    shadowColor: colors.black,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.03,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                >
                  <View className="flex-row justify-center items-center">
                    <Ionicons name="refresh-outline" size={18} color="#6B7280" />
                    <Text className="text-center font-medium text-gray-600 ml-2">
                      Réinitialiser
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleApply}
                  className="flex-1 py-4 rounded-2xl bg-primary active:bg-primary-600"
                  style={{
                    shadowColor: colors.primary.DEFAULT,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row justify-center items-center">
                    <Ionicons name="checkmark-outline" size={18} color="white" />
                    <Text className="text-center font-medium text-white ml-2">
                      Appliquer
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MenuFilters;