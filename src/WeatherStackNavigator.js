import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationScreen from './components/weatherinfo/LocationScreen';
import DetailHourlyForecast from './components/weatherinfo/DetailHourlyForecast';
import WeatherInfo from './screens/WeatherInfo';
import Visualization from './screens/Visualization';
import DetailDailyForecast from './components/weatherinfo/DetailDailyForecast';

const Stack = createNativeStackNavigator();

const WeatherStackNavigator = () => {
   return (
      <Stack.Navigator>
         <Stack.Group>
            <Stack.Screen name="WeatherInfo" component={WeatherInfo} options={{ headerShown: false }} initialParams={{ city: "Ho Chi Minh" }} />
         </Stack.Group>
         <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="LocationScreen" component={LocationScreen} options={{
               gestureDirection: 'vertical',
               headerShown: false
            }} />
            <Stack.Screen name="DetailHourlyForecast" component={DetailHourlyForecast} />
            <Stack.Screen name="DetailDailyForecast" component={DetailDailyForecast} />
            <Stack.Screen name="Visualization" component={Visualization} options={{ title: "Biểu đồ thời tiết" }} />
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default WeatherStackNavigator;
