// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WeatherStackNavigator from './WeatherStackNavigator';
import MapStackNavigator from './MapStackNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
   return (
      <Tab.Navigator screenOptions={{
         headerShown: false,
      }}>
         {/* <Tab.Screen name="WeatherInfoScreen" component={WeatherStackNavigator} options={{ title: "Thời tiết" }} /> */}
         <Tab.Screen name="MapScreen" component={MapStackNavigator} options={{ title: "Giao thông" }} />
      </Tab.Navigator>
   );
};

export default BottomTabNavigator;
