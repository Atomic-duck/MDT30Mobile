import React, { useEffect, useState } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, FlatList, Button } from "react-native";
import CurrentForecast from "../components/weatherinfo/CurrentForecast";
import DailyForecast from "../components/weatherinfo/DailyForecast";
import HourlyForecast from "../components/weatherinfo/HourlyForecast";
import InfoHeader from "../components/InfoHeader";
import styled from "styled-components/native";
import config from "../config";
import Average from "../components/visualization/AverageMetric";
import bgImg from '../images/4.png';

interface WeatherInfoProps {
   navigation: any; // You should replace 'any' with the proper navigation type
   route: any; // Replace 'any' with the proper route type
}

interface WeatherData {
   coord?: {
      lat: number;
      lon: number;
   };
   hourly?: any[]; // Replace 'any' with the actual hourly data type
   daily?: any[]; // Replace 'any' with the actual daily data type
   // Add other properties as needed
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ navigation, route }) => {
   const [city, setCity] = useState<string>(route.params.city);
   const [lat, setLat] = useState<number>(43.6532);
   const [long, setLong] = useState<number>(-79.3832);
   const [weather, setWeather] = useState<WeatherData>({});

   const fetchLatLongHandler = () => {
      console.log("fetch lat long")
      fetch(
         `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
      )
         .then((res) => res.json())
         .then((data) => {
            setLat(data.coord.lat);
            setLong(data.coord.lon);
         }).catch(err => console.error("lat long err:", err));
   };

   const onSearchCity = () => {
      navigation.navigate('LocationScreen', {
         city
      });
   };

   useEffect(() => {
      fetch(
         `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&appid=9f796948bc105f93351ac290f7d62883&lang=vi`
      )
         .then((res) => res.json())
         .then((data) => {
            setWeather(data);
         })
         .catch((err) => {
            console.log("error", err);
         });
      // return () => controller.abort();
   }, [lat, long]);

   useEffect(() => {
      fetchLatLongHandler();
   }, [city]);

   useEffect(() => {
      setCity(route.params.city);
   }, [route.params.city]);

   return (
      <Container>
         <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
            <SearchContainer>
               <Button
                  title="Vị Trí"
                  color={"rgba(255, 255, 255, 0.3)"}
                  accessibilityLabel="Search Weather By City"
                  onPress={onSearchCity}
               />
            </SearchContainer>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
               <CurrentForecast currentWeather={weather} city={city} />
               <InfoContainer>
                  <InfoHeader title={"Dự báo 24h"} titleModal={"Chi tiết >"} handleModalNavigation={() => {
                     navigation.navigate('DetailHourlyForecast', {
                        hourlyWeathers: weather.hourly?.slice(1)
                     });
                  }} />
                  <Line />
                  {weather.hourly ? (
                     <FlatList
                        data={weather.hourly.slice(1, 25)}
                        horizontal={true} // Set horizontal property to true
                        keyExtractor={(item) => item.dt.toString()}
                        renderItem={(hour) => {
                           return (
                              <HourlyForecast key={hour.item.dt} hour={hour.item} />
                           );
                        }}
                     />
                  ) : (
                     <NoWeather>No Weather to show</NoWeather>
                  )}
               </InfoContainer>
               <InfoContainer>
                  <InfoHeader title={"Dự báo hàng ngày"} titleModal={"7 ngày >"} handleModalNavigation={() => {
                     navigation.navigate('DetailDailyForecast', {
                        hourlyWeathers: weather.daily?.slice(1)
                     });
                  }} />
                  <Line />
                  {weather.daily ? (
                     weather.daily.map((day, index) => {
                        if (index !== 0) {
                           return <DailyForecast key={day.dt} day={day} index={index} />;
                        }
                        return null; // Added this line to satisfy TypeScript
                     })
                  ) : (
                     <NoWeather>No Weather to show</NoWeather>
                  )}
               </InfoContainer>
               <InfoContainer>
                  <InfoHeader title={"7 ngày vừa qua"} titleModal={"Chi tiết >"} handleModalNavigation={() => {
                     console.log(city);
                     navigation.navigate('Visualization', { city: city });
                  }} />
                  <Line />
                  <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', width: '95%', marginLeft: 5, marginTop: 10, marginBottom: 10 }}>
                     <Average color={"red"} title={"Nhiệt độ trung bình"} metric={"°C"} />
                     <Average color={"blue"} title={"Tổng lượng mưa"} metric={" mm"} />
                     <Average color={"gray"} title={"Tốc độ gió"} metric={" km/h"} />
                     <Average color={"green"} title={"Áp suất không khí"} metric={" hPa"} />
                  </View>
               </InfoContainer>
            </ScrollView>
         </ImageBackground>
      </Container>
   );
}

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const NoWeather = styled.Text`
  text-align: center;
  color: white;
`;

const InfoContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
  max-width: 478px;
  margin: 10px 0px 0px 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const Line = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: white;
  width: 100%;
`;

const SearchContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;

const HourlyContainer = styled.View`
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 5px;
`;

export default WeatherInfo;
