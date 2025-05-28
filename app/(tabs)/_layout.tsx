// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

const _layout = () => {
  return (
    <>
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#2A9D8F',
        tabBarInactiveTintColor: '#9f9fa9',
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#D3EBEB',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 60,
          position: 'absolute',
          borderWidth: 1,
          borderColor: '#e0f2f1',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }
      }}>
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home', 
            headerShown: false, 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="home" 
                size={24} 
                color={focused ? '#2A9D8F' : '#9f9fa9'} 
              />
            ) 
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            title: 'Profile', 
            headerShown: false, 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="person" 
                size={24} 
                color={focused ? '#2A9D8F' : '#9f9fa9'} 
              />
            ) 
          }}
        />
      </Tabs>

      {/* Bouton flottant de scan */}
      <View 
        className="absolute bottom-0 left-0 right-0 items-center" 
        style={{ 
          marginBottom: 66,
          zIndex: 9999,
          elevation: 9999
        }}
      >
        <Link href="/scan" asChild>
          <TouchableOpacity 
            activeOpacity={0.8}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{
              backgroundColor: '#129EA1',
              shadowColor: '#129EA1',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 9999,
              zIndex: 10000,
            }}
          >
            <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
              <Ionicons 
                name="camera" 
                size={28} 
                color="white" 
              />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default _layout;