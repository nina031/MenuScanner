import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const _layout = () => {
  return (
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
        name="scan" 
        options={{ 
          title: 'Scan',
          tabBarLabel: '',
          headerShown: false, 
          tabBarIcon: () => (
            <View style={[
              styles.scanButton,
              { backgroundColor: '#129EA1' }
            ]}>
              <Ionicons 
                name="camera" 
                size={24} 
                color="white" 
              />
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
              color={focused ? '#2A9D8F' : '#9f9fa9'} 
            />
          ) 
        }}
      />
    </Tabs>
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