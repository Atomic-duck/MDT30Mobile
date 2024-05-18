import { CheckBox } from '@rneui/base';
import React from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import WeatherContainer from './WeatherContainer';

interface WeatherTabProps {
   focusCameraTo: any,
   showWeatherIcons: boolean;
   setShowWeatherIcons: any;
   weatherList: any[];
}

const WeatherTab: React.FC<WeatherTabProps> = ({ focusCameraTo, showWeatherIcons, setShowWeatherIcons, weatherList }) => {
   // Function to handle checkbox state changes
   const handleCheckboxChange = (value: boolean) => {
      setShowWeatherIcons(value);
   };

   return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.tabContent}>
         <View style={styles.checkboxContainer}>
            <CheckBox
               checked={showWeatherIcons}
               onPress={(e) => handleCheckboxChange(!showWeatherIcons)}
               containerStyle={styles.boxContainer}
            />
            <Text>HIển thị thời tiết</Text>
         </View>
         <View style={styles.weatherContainer}>
            {/* Generate weatherInfo components using mock data */}
            {
               weatherList.length == 0 && (
                  <Text style={{ alignSelf: 'center' }}>Không có thời tiết hiển thị</Text>
               )
            }
            {weatherList?.map((weather, index) => {
               return (
                  <WeatherContainer
                     key={`weather-${index}`}
                     weatherInfo={weather}
                     focusCameraTo={focusCameraTo}
                  />
               )
            })}
         </View>
      </ScrollView >
   );
}

export default WeatherTab;

const styles = StyleSheet.create({
   scrollViewContent: {
      justifyContent: 'flex-start',
      flexGrow: 1,
   },
   weatherContainer: {

   },
   checkboxContainer: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 0,
      marginBottom: 10,
   },
   boxContainer: {
      padding: 0,
   },
   tabContent: {
      paddingVertical: 5,
      height: 200,
   }
});
