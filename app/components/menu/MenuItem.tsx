// app/components/menu/MenuItem.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, Pressable } from 'react-native';
import DietaryBadges from './DietaryBadges';
import { LinearGradient } from 'expo-linear-gradient';
import { MenuItem } from '../../types/menu';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut,
  SlideInDown, 
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type MenuItemModalProps = {
  item: MenuItem;
  onClose: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 25,
      stiffness: 120,
    });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const closeModal = () => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(onClose, 300);
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.5,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));


  
  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View className="flex-1">
        {/* Backdrop avec animation */}
        <AnimatedPressable 
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
            },
            backdropStyle
          ]}
          onPress={closeModal}
        />

        {/* Modal content */}
        <Animated.View 
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: SCREEN_HEIGHT * 0.9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 24,
            },
            modalStyle
          ]}
        >
          {/* Poignée de fermeture */}
          <TouchableOpacity 
            onPress={closeModal}
            className="items-center py-3"
            activeOpacity={0.8}
          >
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </TouchableOpacity>

          {/* Header avec le prix */}
          <View className="px-5 pb-4 pt-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-4">
                <Text className="text-2xl font-bold text-gray-900 mb-3">
                  {item.name}
                </Text>
            {/* Tags diététiques avec animation */}
                  <DietaryBadges
                    dietary={item.dietary}
                    variant="simple"
                    animate
                    containerClassName="flex-row flex-wrap mt-2 mb-1"
                  />
              </View>
              
              {/* Badge de prix avec gradient */}
              <Animated.View
                entering={FadeIn.delay(200).springify()}
              >
                  <Text className="text-xl font-bold text-primary">
                    {item.price.value.toFixed(2)}{item.price.currency}
                  </Text>
              </Animated.View>
            </View>
          </View>

          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {/* Description avec animation */}
            <Animated.View 
              entering={FadeIn.delay(300).springify()}
              className="px-5 pt-2"
            >
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 justify-center items-center mr-3">
                  <MaterialCommunityIcons name="text-box-outline" size={20} color="#6B7280" />
                </View>
                <Text className="text-base font-semibold text-gray-700">Description</Text>
              </View>
              <View className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                <Text className="text-base text-gray-700 leading-6">{item.description}</Text>
              </View>
            </Animated.View>

            {/* Ingrédients avec animation */}
            {item.ingredients.length > 0 && (
              <Animated.View 
                entering={FadeIn.delay(400).springify()}
                className="px-5 pt-5"
              >
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 justify-center items-center mr-3">
                    <MaterialCommunityIcons name="food-variant" size={20} color="#129EA1" />
                  </View>
                  <Text className="text-base font-semibold text-gray-700">
                    Ingrédients ({item.ingredients.length})
                  </Text>
                </View>
                <View className="flex-row flex-wrap">
                  {item.ingredients.map((ingredient, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeIn.delay(400 + index * 50).springify()}
                    >
                      <View 
                        className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 mr-2 mb-2"
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                      >
                        <Text className="text-sm text-gray-700 font-medium capitalize">
                          {ingredient}
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            )}

          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MenuItemModal;