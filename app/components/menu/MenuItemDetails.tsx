// app/components/menu/MenuItemDetails.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MenuItem } from '../../types/menu';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import DietaryBadges from './DietaryBadges';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type MenuItemDetailsProps = {
  item: MenuItem;
  onClose: () => void;
};

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, onClose }) => {

  
  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Animated.View 
          entering={FadeIn}
          className="absolute inset-0"
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={onClose}
            className="flex-1"
          />
        </Animated.View>

        <Animated.View 
          entering={SlideInUp.springify()}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
          style={{ maxHeight: SCREEN_HEIGHT * 0.9 }}
        >
          {/* Header avec le prix */}
          <View className="relative overflow-hidden">
            <LinearGradient
              colors={['#f9fafb', '#f3f4f6']}
              className="px-5 pt-6 pb-4"
            >
              {/* Barre de fermeture */}
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
              
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-4">
                  <Text className="text-2xl font-bold text-gray-900 mb-2">
                    {item.name}
                  </Text>
                  
                  {/* Tags diététiques */}
                  <DietaryBadges
                    dietary={item.dietary}
                    variant="simple"
                    animate
                    containerClassName="flex-row flex-wrap mt-2"
                  />
                </View>
                
                <View className="bg-primary/10 px-4 py-2 rounded-xl">
                  <Text className="text-2xl font-bold text-primary">
                    {item.price.value.toFixed(2)}{item.price.currency}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {/* Description */}
            <View className="px-5 pt-5">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3">
                  <MaterialCommunityIcons name="text-box-outline" size={20} color="#6B7280" />
                </View>
                <Text className="text-base font-semibold text-gray-700">Description</Text>
              </View>
              <View className="bg-gray-50 rounded-2xl p-4">
                <Text className="text-base text-gray-700 leading-6">{item.description}</Text>
              </View>
            </View>

            {/* Ingrédients */}
            {item.ingredients.length > 0 && (
              <View className="px-5 pt-5">
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3">
                    <MaterialCommunityIcons name="food-variant" size={20} color="#129EA1" />
                  </View>
                  <Text className="text-base font-semibold text-gray-700">
                    Ingrédients ({item.ingredients.length})
                  </Text>
                </View>
                <View className="flex-row flex-wrap">
                  {item.ingredients.map((ingredient, index) => (
                    <View 
                      key={index} 
                      className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 mr-2 mb-2 shadow-sm"
                    >
                      <Text className="text-sm text-gray-700 font-medium capitalize">
                        {ingredient}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bouton de fermeture */}
            <View className="px-5 pt-6">
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 py-4 rounded-2xl"
                activeOpacity={0.8}
              >
                <Text className="text-center font-semibold text-gray-700 text-base">
                  Fermer
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MenuItemDetails;