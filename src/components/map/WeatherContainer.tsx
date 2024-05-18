import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import styled from "styled-components/native";

interface WeatherContainerProps {
   focusCameraTo: any,
   weatherInfo: any;
}

const weather_mapping = {
   'mist': {
      vi: 'Sương mù',
      icon: '50d'
   },
   'smoke': {
      vi: 'Khói',
      icon: '50d'
   },
   'haze': {
      vi: 'Sương mù nhẹ',
      icon: '50d'
   },
   'sand': {
      vi: 'Cát bụi',
      icon: '50d'
   },
   'dust whirls': {
      vi: 'Vòi rồng bụi',
      icon: '50d'
   },
   'fog': {
      vi: 'Sương mù',
      icon: '50d'
   },
   'dust': {
      vi: 'Bụi',
      icon: '50d'
   },
   'volcanic ash': {
      vi: 'Tro núi lửa',
      icon: '50d'
   },
   'squalls': {
      vi: 'Cơn giông',
      icon: '50d'
   },
   'tornado': {
      vi: 'Lốc xoáy',
      icon: '50d'
   },
   'clear sky': {
      vi: 'Trời quang đãng',
      icon: '01d'
   },
   'few clouds': {
      vi: 'Ít mây',
      icon: '02d'
   },
   'scattered clouds': {
      vi: 'Mây rải rác',
      icon: '03d'
   },
   'broken clouds': {
      vi: 'Mây rải rác',
      icon: '04d'
   },
   'overcast clouds': {
      vi: 'Trời âm u',
      icon: '04d'
   },
   'light rain': {
      vi: 'Mưa nhỏ',
      icon: '10d'
   },
   'moderate rain': {
      vi: 'Mưa vừa',
      icon: '10d'
   },
   'heavy intensity rain': {
      vi: 'Mưa lớn',
      icon: '10d'
   },
   'very heavy rain': {
      vi: 'Mưa rất to',
      icon: '10d'
   },
   'extreme rain': {
      vi: 'Mưa cực lớn',
      icon: '10d'
   },
   'freezing rain': {
      vi: 'Mưa lạnh',
      icon: '13d'
   },
   'light intensity shower rain': {
      vi: 'Mưa rào nhẹ',
      icon: '09d'
   },
   'shower rain': {
      vi: 'Mưa rào',
      icon: '09d'
   },
   'heavy intensity shower rain': {
      vi: 'Mưa rào lớn',
      icon: '09d'
   },
   'ragged shower rain': {
      vi: 'Mưa rào không đều',
      icon: '09d'
   },
   'thunderstorm with light rain': {
      vi: 'Cơn giông với mưa nhỏ',
      icon: '11d'
   },
   'thunderstorm with rain': {
      vi: 'Cơn giông với mưa',
      icon: '11d'
   },
   'thunderstorm with heavy rain': {
      vi: 'Cơn giông với mưa lớn',
      icon: '11d'
   },
   'light thunderstorm': {
      vi: 'Sấm sét nhẹ',
      icon: '11d'
   },
   'thunderstorm': {
      vi: 'Cơn giông',
      icon: '11d'
   },
   'heavy thunderstorm': {
      vi: 'Cơn giông lớn',
      icon: '11d'
   },
   'ragged thunderstorm': {
      vi: 'Cơn giông không đều',
      icon: '11d'
   },
   'thunderstorm with light drizzle': {
      vi: 'Cơn giông với mưa phùn nhẹ',
      icon: '11d'
   },
   'thunderstorm with drizzle': {
      vi: 'Cơn giông với mưa phùn',
      icon: '11d'
   },
   'thunderstorm with heavy drizzle': {
      vi: 'Cơn giông với mưa phùn lớn',
      icon: '11d'
   }
}

const WeatherContainer: React.FC<WeatherContainerProps> = ({ focusCameraTo, weatherInfo }) => {
   const timestampToTimeString = (timestampInSeconds: number): string => {
      const date = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds
      const hours = date.getHours().toString().padStart(2, '0'); // Get hours (in 24-hour format) and pad with leading zero if needed
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed
      return `${hours}:${minutes}`;
   }

   return (
      <TouchableOpacity style={styles.weatherInfo} onPress={() => focusCameraTo([weatherInfo.lon, weatherInfo.lat])}>
         <View style={styles.iconContainer}>
            <Image
               source={{
                  uri: `http://openweathermap.org/img/wn/${weatherInfo.data[0].weather[0].icon}@2x.png`,
               }}
               style={styles.weatherIcon}

               resizeMode={"contain"} // cover or contain its upto you view look
            />
            {/* Time */}
            <Text style={styles.timeText}>{timestampToTimeString(weatherInfo.data[0].dt)}</Text>
         </View>
         <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Mây rải rác</Text>
         </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   weatherInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#C5C5C5',
      borderRadius: 5,
      marginBottom: 10,
      padding: 5
   },
   iconContainer: {
      flex: 0.8,
      alignItems: 'center',
      justifyContent: 'center',
   },
   timeText: {
      fontSize: 14,
      color: 'black',
      marginTop: 5,
   },
   infoContainer: {
      flexDirection: 'row', // Display content in a row
      flexWrap: 'wrap', // Wrap content if it exceeds container width
      flex: 2,
      marginLeft: 30,
      justifyContent: 'flex-start',
      columnGap: 30
   },
   infoText: {
      fontSize: 17,
      marginBottom: 5,
      fontWeight: '500',
      color: '#525252'
   },
   weatherIcon: {
      marginVertical: -8,
      width: 50,
      height: 50,
   }
});

export default WeatherContainer;
