import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';

import config from "../../config";
import WeatherTab from './WeatherTab';
import ReportTab from './ReportTab';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SubscribeTab from './SubscribeTab';
import { checkCoordinates } from '../../utils/notify';

interface InfoFooterProps {
   focusCameraTo: any,
   roadStatusList: any[],
   userInfo: any,
   routeDirections: any,
   showWeatherIcons: boolean,
   setShowWeatherIcons: any,
   weatherList: any[],
   setWeatherList: any,
   showCameraIcons: boolean,
   setShowCameraIcons: any,
   setSubscribe: any,
   navigation: any,
   route: any,
}

interface WeatherFetchInfo {
   location: number[],
   timestamp: number,
}

enum TabType {
   WEATHER = "Thời tiết",
   FLOOD = "Báo cáo",
   FOLLOW = "Theo dõi"
}

const InfoFooter: React.FC<InfoFooterProps> = ({ focusCameraTo, roadStatusList, userInfo, routeDirections, showWeatherIcons, setShowWeatherIcons, weatherList, setWeatherList, showCameraIcons, setShowCameraIcons, setSubscribe, navigation, route }) => {
   const [footerOpen, setFooterOpen] = useState(false); // State to manage footer visibility
   const [activeTab, setActiveTab] = useState<TabType>(TabType.FOLLOW); // State to manage active tab
   const [reports, setReports] = useState<any[]>([]);
   const weatherDistance = 1000; // m

   useEffect(() => {
      if (!routeDirections) {
         setActiveTab(TabType.FOLLOW);
         return;
      }
      let weatherLocations = getWeatherLocations();

      const fetchWeatherData = async () => {
         console.log("fetch weather data")
         const promises = weatherLocations.map(async (locationInfo) => {
            const { location, timestamp } = locationInfo;
            const [longitude, latitude] = location;

            const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${Math.floor(timestamp / 1000)}&units=metric&appid=${config.API_KEY}`;

            try {
               const response = await fetch(apiUrl);
               const data = await response.json();
               return data;
            } catch (error) {
               console.error('Error fetching weather data:', error);
               return null;
            }
         });

         Promise.all(promises).then((results) => {
            const filteredResults = results.filter((result) => result !== null);
            setWeatherList(filteredResults);
         });
      };

      fetchWeatherData();
      setReports(getReports());
      setActiveTab(TabType.WEATHER);
   }, [routeDirections])

   const getWeatherLocations = (): WeatherFetchInfo[] => {
      let coordinates = routeDirections.coordinates;
      let weatherLocations: WeatherFetchInfo[] = [];
      let distance = 0;
      let duration = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
         distance += routeDirections.anotation.durations[i] * routeDirections.anotation.speeds[i];
         duration += routeDirections.anotation.durations[i];
         if (distance > weatherDistance) {
            weatherLocations.push({
               location: coordinates[i + 1],
               timestamp: Date.now() + duration * 1000
            });
            distance = 0;
         }
      }

      return weatherLocations;
   }

   const getReports = (): any[] => {
      const effected: any[] = [];
      roadStatusList.forEach(roadStatus => {
         if (checkCoordinates(routeDirections.coordinates, roadStatus.coordinates)) {
            effected.push(roadStatus);
         }
      })

      return effected;
   }

   // Function to toggle footer visibility
   const toggleFooter = () => {
      setFooterOpen(!footerOpen);
   }

   // Function to handle tab press
   const handleTabPress = (tab: TabType) => {
      setFooterOpen(true);
      setActiveTab(tab);
   };

   const renderContent = () => {
      switch (activeTab) {
         case TabType.WEATHER:
            return (
               <WeatherTab focusCameraTo={focusCameraTo} showWeatherIcons={showWeatherIcons} setShowWeatherIcons={setShowWeatherIcons} weatherList={weatherList} />
            );
         case TabType.FLOOD:
            return (
               <ReportTab focusCameraTo={focusCameraTo} roadStatusList={reports} showCameraIcons={showCameraIcons} setShowCameraIcons={setShowCameraIcons} />
            );
         case TabType.FOLLOW:
            return (
               <SubscribeTab userInfo={userInfo} setSubscribe={setSubscribe} navigation={navigation} route={route} />
            );
         default:
            return null;
      }
   }

   return (
      <View style={styles.infoContainer}>
         <View style={styles.footerHeader} >
            <View style={styles.tabContainer}>
               {
                  routeDirections && (
                     <TouchableOpacity
                        style={styles.tab}
                        onPress={() => handleTabPress(TabType.WEATHER)}
                     >
                        <Text style={[styles.tabText, activeTab === TabType.WEATHER && styles.activeTab]}>{TabType.WEATHER.toString()}</Text>
                     </TouchableOpacity>
                  )
               }

               {
                  routeDirections && (
                     <TouchableOpacity
                        style={styles.tab}
                        onPress={() => handleTabPress(TabType.FLOOD)}
                     >
                        <Text style={[styles.tabText, activeTab === TabType.FLOOD && styles.activeTab]}>{TabType.FLOOD.toString()}</Text>
                     </TouchableOpacity>
                  )
               }

               <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleTabPress(TabType.FOLLOW)}
               >
                  <Text style={[styles.tabText, activeTab === TabType.FOLLOW && styles.activeTab]}>{TabType.FOLLOW.toString()}</Text>
               </TouchableOpacity>
            </View>

            <TouchableOpacity
               style={[styles.tab]}
               onPress={toggleFooter}
            >
               {
                  footerOpen ? (<Icon name='chevron-down' size={16} />) : (<Icon name='chevron-up' size={16} />)
               }
            </TouchableOpacity>
         </View>

         {
            footerOpen && renderContent()
         }
      </View>
   );
}

export default InfoFooter;

const styles = StyleSheet.create({
   infoContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
   },
   footerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingHorizontal: 5
   },
   tab: {
      alignItems: 'center',
      paddingVertical: 5,
   },
   activeTab: {
      fontWeight: 'bold',
      color: 'black',
   },
   tabText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'gray',
   },
   tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 25
   },
   tabContent: {
      paddingVertical: 5,
      height: 200,
   },
});

