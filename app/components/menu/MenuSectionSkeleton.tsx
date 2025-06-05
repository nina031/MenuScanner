// app/components/menu/MenuSectionSkeleton.tsx
import React from 'react';
import { View } from 'react-native';

type MenuSectionSkeletonProps = {
  sectionName: string;
  itemCount?: number;
};

const MenuSectionSkeleton: React.FC<MenuSectionSkeletonProps> = ({ 
  sectionName, 
  itemCount = 3 
}) => {
  return (
    <View className="mb-4">
      {/* Header skeleton */}
      <View className="mx-4 mt-4 bg-gray-100 rounded-xl px-5 py-4 flex-row justify-between items-center opacity-50">
        <View className="flex-row items-center">
          <View className="w-1.5 h-8 bg-gray-300 rounded-full mr-4" />
          <View className="h-5 bg-gray-300 rounded w-32" />
        </View>
      </View>

      {/* Items skeleton */}
      <View className="mt-4 mx-4 space-y-2">
        {[...Array(itemCount)].map((_, index) => (
          <View 
            key={index}
            className="px-5 py-3.5 bg-white rounded-lg border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2
            }}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-4">
                <View className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <View className="h-3 bg-gray-200 rounded w-full" />
              </View>
              <View className="h-4 bg-gray-300 rounded w-16" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MenuSectionSkeleton;