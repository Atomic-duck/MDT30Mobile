import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './screens/Map';
import LocationSearch from './components/map/LocationSearch';
import SubscribeRouteScreen from './screens/SubscribeRouteScreen';
import ManageSubScreen from './screens/ManageSubScreen'
import ReportScreen from './screens/ReportScreen';
import SettingScreen from './screens/SettingScreen'


const Stack = createNativeStackNavigator();

const MapStackNavigator = () => {
   return (
      <Stack.Navigator>
         <Stack.Group>
            <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
         </Stack.Group>
         <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="LocationSearch" component={LocationSearch} options={{
               headerShown: false
            }} />
            <Stack.Screen name="SubscribeRouteScreen" component={SubscribeRouteScreen} options={{
               headerShown: false
            }} />
            <Stack.Screen name="ManageSubScreen" component={ManageSubScreen} options={{
               headerShown: false
            }} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} options={{
               title: 'Tình trạng tuyến đường'
            }} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} options={{
               headerShown: false
            }} />
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default MapStackNavigator;
