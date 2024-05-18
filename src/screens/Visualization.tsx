import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   Modal,
   ScrollView,
   Pressable,
   StyleSheet,
   ImageBackground,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyCalender from '../components/visualization/MyCalender';
import TemparatureChart from '../components/visualization/TemparatureChart';
import RainfallChart from '../components/visualization/RainfallChart';
import WindSpeedChart from '../components/visualization/WindSpeedChart';
import AirPressureChart from '../components/visualization/AirPressureChart';
import Average from '../components/visualization/AverageMetric';

const bgImg = require('../images/4.png');

interface VisualizationProps {
   navigation: any; // Replace with the actual type for navigation
   route: any; // Replace with the actual type for route
}

interface WeatherData {
   // Define the properties of your weather data
}

const fetchWeatherData = (beginDate: string, endDate: string): WeatherData[] => {
   let data: WeatherData[] = [];
   // Fetch data

   return data;
};

function convertDateFormat(inputDate) {
   var inputDateObject = new Date(inputDate);
   // Format the date as "dd/mm/yy"
   var formattedDate = inputDateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
   });

   return formattedDate;
}

const Visualization: React.FC<VisualizationProps> = ({ navigation, route }) => {
   const [beginDate, setBeginDate] = useState('2023-11-11');
   const [endDate, setEndDate] = useState('2023-11-15');
   const [selecting, setSelecting] = useState(false);
   const [typeChart, setTypeChart] = useState('nhiet-do');
   let data: WeatherData[] = [];

   useEffect(() => {
      data = fetchWeatherData(beginDate, endDate);
   }, []);

   useEffect(() => {
      data = fetchWeatherData(beginDate, endDate);
   }, [beginDate, endDate]);

   const Category: React.FC<{ typeName: string; title: string }> = ({
      typeName,
      title,
   }) => {
      return (
         <View>
            <Text
               style={{
                  backgroundColor: 'white',
                  fontSize: 16,
                  padding: 5,
                  marginRight: 5,
                  borderRadius: 5,
               }}
               onPress={() => setTypeChart(typeName)}>
               {title}
            </Text>
         </View>
      );
   };

   // display chart based on type
   const Chart = () => {
      let data = fetchWeatherData(beginDate, endDate);
      if (typeChart === 'nhiet-do') return <TemparatureChart data={data} />;
      if (typeChart === 'luong-mua') return <RainfallChart data={data} />;
      if (typeChart === 'gio') return <WindSpeedChart data={data} />;
      // if (typeChart === 'huong-gio') return <AreaChartDynamicData />;
      if (typeChart === 'ko-khi') return <AirPressureChart data={data} />;
      return <Text>Not found</Text>;
   };

   return (
      <View style={styles.containerStyle}>
         <ImageBackground source={bgImg} style={styles.backgroundStyle}>
            <Container>
               <Text style={styles.textStyle}>{route.params.city}</Text>
               <View style={{ ...styles.whiteContainerStyle, backgroundColor: "rgba(150, 150, 150, 0.3)", }}>
                  <Text onPress={() => setSelecting(!selecting)} style={{ ...styles.textStyle, fontWeight: '500' }}>
                     {convertDateFormat(beginDate) + ' - ' + convertDateFormat(endDate) + '  '}
                  </Text>
                  <Icon name="calendar" size={30} />
               </View>
            </Container>
            <Modal
               animationType="fade"
               transparent={true}
               visible={selecting}
               onRequestClose={() => {
                  setSelecting(!selecting);
               }}>
               <View style={styles.centeredView}>
                  <View style={styles.triangle}></View>
                  <View style={styles.modalViewStyle}>
                     <View style={{ ...styles.whiteContainerStyle, borderBottomWidth: 0.5 }}>
                        <Text>Chuỗi ngày</Text>
                        <Pressable onPress={() => setSelecting(!selecting)}>
                           <Icon name="times" size={16} />
                        </Pressable>
                     </View>
                     <MyCalender
                        setBeginDate={setBeginDate}
                        setEndDate={setEndDate}
                        closeModel={() => setSelecting(!selecting)}
                     />
                  </View>
               </View>
            </Modal>
            <View style={{
               display: 'flex',
               flexDirection: 'row',
               flexWrap: 'wrap',
               justifyContent: 'space-around',
               width: '95%',
               marginLeft: 5,
               marginTop: 15,
            }}>
               <Average color={'red'} title={'Nhiệt độ trung bình'} metric={'°C'} />
               <Average color={'blue'} title={'Tổng lượng mưa'} metric={' mm'} />
               <Average color={'gray'} title={'Tốc độ gió'} metric={' km/h'} />
               <Average color={'green'} title={'Áp suất không khí'} metric={' hPa'} />
            </View>
            <View style={{ width: '100%' }}>
               <View style={{ borderRadius: 5, marginTop: 20 }}>
                  <ScrollView horizontal={true} style={{ marginHorizontal: 5, borderRadius: 5 }}>
                     <View style={{ borderRadius: 10, display: 'flex', flexDirection: 'row' }}>
                        <Category typeName={'nhiet-do'} title={'Nhiệt Độ'} />
                        <Category typeName={'luong-mua'} title={'Lượng Mưa'} />
                        <Category typeName={'gio'} title={'Tốc Độ Gió'} />
                        <Category typeName={'ko-khi'} title={'Áp Suất khong khi'} />
                     </View>
                  </ScrollView>
               </View>
               <View>
                  <Chart />
               </View>
            </View>
         </ImageBackground>
      </View>
   );
};

const styles = StyleSheet.create({
   triangle: {
      alignSelf: 'flex-end',
      marginEnd: 22,
      marginTop: 21,
      marginBottom: -2,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderBottomWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'white',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 15,
   },
   centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
   },
   modalView: {
      width: '95%',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
      paddingTop: 3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
   containerStyle: {
      flex: 1,
      backgroundColor: '#1C1C1C',
   },
   textStyle: {
      fontSize: 16,
      color: 'white',
   },
   backgroundStyle: {
      width: '100%',
      height: '100%',
   },
   whiteContainerStyle: {
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
   modalViewStyle: {
      width: '95%',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
      paddingTop: 3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
   categoryStyle: {
      backgroundColor: 'white',
      fontSize: 16,
      padding: 5,
      marginRight: 5,
      borderRadius: 5,
   }
});

const Container = styled.View`
  display: flex;
  flexDirection: row;
  alignItems: center;
  justifyContent: space-between;
  width: 100%;
  padding: 5px 15px 5px 15px;
  margin-top: 5px;
`;

export default Visualization;
