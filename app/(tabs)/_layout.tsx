// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const _layout = () => {
  return (
    <Tabs 
      screenOptions={{
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
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="home" 
              size={24} 
              color={focused ? '#129EA1' : '#9f9fa9'} 
            />
          ) 
        }}
      />

      <Tabs.Screen 
        name="scan" 
        options={{ 
          title: 'Scan', 
          headerShown: false, 
          tabBarStyle: { display: 'none' },
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.scanButtonContainer}>
              <View style={[
                styles.scanButton,
                { 
                  backgroundColor: '#129EA1',
                  transform: [{ scale: focused ? 1.1 : 1 }]
                }
              ]}>
                <View style={styles.innerCircle}>
                  <Ionicons 
                    name="camera" 
                    size={28} 
                    color="white" 
                  />
                </View>
              </View>
              {/* Effet de pulse autour */}
              <View style={[
                styles.pulseRing,
                { 
                  opacity: focused ? 0.3 : 0.2,
                  transform: [{ scale: focused ? 1.3 : 1.2 }]
                }
              ]} />
            </View>
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
              color={focused ? '#129EA1' : '#9f9fa9'} 
            />
          ) 
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  scanButtonContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#129EA1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#129EA1',
    backgroundColor: 'transparent',
  },
});

export default _layout;