import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { MenuItem } from '../../types/menu';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type MenuItemDetailsProps = {
  item: MenuItem;
  onClose: () => void;
};

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, onClose }) => {
  // Générer les couleurs pour les badges diététiques
  const getDietColor = (diet: string) => {
    const colors = {
      'végétarien': ['bg-green-100', 'text-green-700', 'leaf'],
      'végétalien': ['bg-teal-100', 'text-teal-700', 'leaf-maple'],
      'sans_gluten': ['bg-amber-100', 'text-amber-700', 'barley-off'],
      'sans_lactose': ['bg-blue-100', 'text-blue-700', 'cow-off']
    };
    
    return colors[diet as keyof typeof colors] || ['bg-gray-100', 'text-gray-700', 'information-outline'];
  };
  
  // Obtenir une icône basée sur l'ingrédient (exemple simple)
  const getIngredientIcon = (ingredient: string) => {
    const icons: {[key: string]: string} = {
      'tomate': 'food-apple',
      'tomates': 'food-apple',
      'fromage': 'cheese',
      'mozzarella': 'cheese',
      'parmesan': 'cheese',
      'oignon': 'food-apple-outline',
      'oignons': 'food-apple-outline',
      'viande': 'food-steak',
      'boeuf': 'food-steak',
      'porc': 'food-steak',
      'poulet': 'food-drumstick',
      'poisson': 'fish',
      'pain': 'bread-slice',
      'pâtes': 'noodles',
    };
    
    // Chercher des correspondances partielles
    for (const [key, icon] of Object.entries(icons)) {
      if (ingredient.includes(key)) {
        return icon;
      }
    }
    return 'silverware-fork-knife'; // icône par défaut
  };
  
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header avec bouton de retour */}
      <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={onClose} 
            className="w-10 h-10 justify-center items-center rounded-full bg-gray-50"
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Détails du plat</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Nom et prix */}
        <View className="p-6 bg-white mt-4 mx-4 rounded-xl shadow-sm">
          <Text className="text-2xl font-bold text-gray-800">{item.name}</Text>
          
          {/* Tags diététiques horizontaux */}
          {item.dietary.length > 0 && (
            <View className="flex-row flex-wrap mt-2">
              {item.dietary.map((diet, index) => {
                const [bgColor, textColor, iconName] = getDietColor(diet);
                return (
                  <View 
                    key={index} 
                    className={`${bgColor} rounded-full px-3 py-1.5 mr-2 mb-1 flex-row items-center`}
                  >
                    <MaterialCommunityIcons 
                      // @ts-ignore - Nous savons que ces noms d'icônes sont valides
                      name={iconName} 
                      size={14} 
                      color={textColor.includes('green') ? '#15803d' : 
                             textColor.includes('teal') ? '#0f766e' : 
                             textColor.includes('amber') ? '#b45309' : 
                             textColor.includes('blue') ? '#1d4ed8' : '#374151'} 
                      style={{ marginRight: 4 }}
                    />
                    <Text className={`text-sm font-medium ${textColor}`}>
                      {diet.charAt(0).toUpperCase() + diet.slice(1).replace('_', ' ')}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
          
          <Text className="text-xl font-bold text-primary mt-3">
            {item.price.value}{item.price.currency}
          </Text>
        </View>

        {/* Description */}
        <View className="p-6 bg-white mt-4 mx-4 rounded-xl shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons name="text-box-outline" size={18} color="#4b5563" />
            <Text className="text-base text-gray-600 font-medium ml-2">DESCRIPTION</Text>
          </View>
          <Text className="text-base text-gray-700 leading-6">{item.description}</Text>
        </View>

        {/* Ingrédients */}
        {item.ingredients.length > 0 && (
          <View className="p-6 bg-white mt-4 mx-4 rounded-xl shadow-sm">
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="food-variant" size={18} color="#4b5563" />
              <Text className="text-base text-gray-600 font-medium ml-2">INGRÉDIENTS</Text>
            </View>
            <View className="flex-row flex-wrap">
              {item.ingredients.map((ingredient, index) => (
                <View 
                  key={index} 
                  className="bg-gray-100 rounded-full px-3 py-2 mr-2 mb-2 flex-row items-center"
                >
                  <MaterialCommunityIcons 
                    // @ts-ignore - Nous savons que ces noms d'icônes sont valides
                    name={getIngredientIcon(ingredient)} 
                    size={14} 
                    color="#4b5563" 
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-sm text-gray-700 font-medium">
                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Espace en bas */}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default MenuItemDetails;
