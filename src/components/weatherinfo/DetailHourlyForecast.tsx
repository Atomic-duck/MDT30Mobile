import React from "react";
import { Text, View, StyleSheet, FlatList, SectionList } from "react-native";
import styled from "styled-components/native";
import moment from "moment";

import InfoHeader from "../InfoHeader";

const Item = ({ data, idx, size }) => {
   let content, container;
   if (idx == 0) {
      content = { ...styles.content, marginTop: 26 };
      container = styles.InfoContainer;
   }
   else if (idx == size - 1) {
      container = { ...styles.InfoContainer, marginBottom: 20 };
      content = { ...styles.content, borderBottomWidth: 0 };
   }
   else {
      container = styles.InfoContainer;
      content = styles.content;
   }

   return <View style={container}>
      <View style={content}>
         <View style={styles.other}>
            <View style={[styles.headerFirst]}>
               <Text style={styles.headerText}>{data.time}</Text>
            </View>
            <View style={styles.cell}>
               <View style={{ display: "flex", alignItems: "center" }}>
                  <WeatherIcon
                     source={{
                        uri: `http://openweathermap.org/img/wn/${data.icon}@2x.png`,
                     }}
                     resizeMode={"contain"}
                  />
                  <Text style={styles.cellVal}>{data.temp}</Text>
               </View>
            </View>
         </View>
         <View style={styles.table}>
            {/* Header row */}
            <View style={[styles.row, styles.headerRow]}>
               <View style={[styles.cell]}>
                  <Text style={styles.headerText}>{data.description}</Text>
               </View>
               <View style={[styles.cell, styles.cellThird]}>
               </View>
            </View>

            {/* Data rows */}
            <View style={styles.row}>
               <View style={styles.cell}>
                  <Text style={styles.cellTitle}>Nhiệt độ</Text>
               </View>
               <View style={[styles.cell, styles.cellThird]}>
                  <Text style={styles.cellVal}>{data.temp}</Text>
               </View>
            </View>

            <View style={styles.row}>
               <View style={styles.cell}>
                  <Text style={styles.cellTitle}>Gió</Text>
               </View>
               <View style={[styles.cell, styles.cellThird]}>
                  <Text style={styles.cellVal}>{data.wind_speed}</Text>
               </View>
            </View>

            <View style={styles.row}>
               <View style={styles.cell}>
                  <Text style={styles.cellTitle}>Gió mạnh</Text>
               </View>
               <View style={[styles.cell, styles.cellThird]}>
                  <Text style={styles.cellVal}>{data.wind_gust}</Text>
               </View>
            </View>
            <View style={styles.row}>
               <View style={styles.cell}>
                  <Text style={styles.cellTitle}>Mây che phủ</Text>
               </View>
               <View style={[styles.cell, styles.cellThird]}>
                  <Text style={styles.cellVal}>{data.clouds}</Text>
               </View>
            </View>
         </View>
      </View>
   </View>;
}

const months: any = {
   0: 'CN',
   1: 'Th 2',
   2: 'Th 3',
   3: 'Th 4',
   4: 'Th 5',
   5: 'Th 6',
   6: 'Th 7',
}

function extractData(data) {
   let date = new Date(data['dt'] * 1000);
   let description = data['weather'][0]['description'];
   description = description[0].toUpperCase() + description.slice(1)

   for (let i = 1; i < data['weather'].length; i++) {
      description = description + data['weather'][i]['description']
   }
   //console.log(data)
   return {
      time: date.getHours().toString() + ":00",
      dateStr: months[date.getDay()] + ' ' + date.getDate().toString() + '/' + (date.getMonth() + 1).toString(),
      description: description,
      icon: data['weather'][0]['icon'],
      temp: Math.round(data['temp']).toString() + "°C",
      wind_gust: data['wind_gust'].toString() + "m/s",
      wind_speed: data['wind_speed'].toString() + "m/s",
      clouds: data['clouds'].toString() + "%"
   }
}

const DetailHourlyForecast = ({ navigation, route }) => {
   const hourlyWeathers = route.params.hourlyWeathers.map(extractData);
   let sections: { title: String, data: [any] }[] = [];
   for (let i = 0; i < hourlyWeathers.length; i++) {
      if (i == 0 || i > 0 && hourlyWeathers[i]['dateStr'] != hourlyWeathers[i - 1]['dateStr']) {
         sections.push({
            title: hourlyWeathers[i]['dateStr'],
            data: [hourlyWeathers[i]]
         })
      }
      else {
         sections[sections.length - 1].data.push(hourlyWeathers[i])
      }
   }

   return (
      <Container>
         <SectionList
            style={{ margin: 10 }}
            sections={sections}
            renderItem={({ item, index, section }) => {
               //console.log(index)
               return <Item data={item} idx={index} size={section.data.length} />
            }}
            renderSectionHeader={({ section }) => (
               <View style={styles.fixedHeader}>
                  <View style={{ paddingHorizontal: 10 }}>
                     <InfoHeader title={section.title} titleModal={''} handleModalNavigation={() => { }} />
                  </View>
                  <Line />
               </View>
            )}
            //contentContainerStyle={styles.InfoContainer}
            keyExtractor={(item, index) => index.toString()}
            stickySectionHeadersEnabled={true}
         />
      </Container>
   );
};

const styles = StyleSheet.create({
   listContent: {
      flexGrow: 1, // Allow the FlatList to expand and fill the container
   },
   fixedHeader: {
      position: 'absolute',
      width: '100%',
      zIndex: 1,
      backgroundColor: "rgba(20, 25, 28, 1)",
      borderRadius: 5,
   },
   InfoContainer: {
      width: "100%",
      backgroundColor: "rgba(20, 25, 28, 1)",
   },
   content: {
      display: 'flex',
      flexDirection: 'row',
      width: '95%',
      marginHorizontal: 10,
      borderColor: "white",
      borderBottomWidth: 0.5,
      padding: 5,
      paddingLeft: 0,
   },
   other: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
   },
   headerFirst: {
      height: 35,
      padding: 5
   },
   table: {
      flexGrow: 11,
   },
   row: {
      flexDirection: 'row',
   },
   cell: {
      flex: 2,
      padding: 5,
   },
   cellThird: {
      alignItems: "flex-end"
   },
   headerRow: {
      height: 35,
   },
   headerText: {
      fontWeight: 'bold',
      fontSize: 15,
      paddingTop: 2,
      color: "white"
   },
   cellTitle: {
      fontWeight: "300",
      color: "white",
      fontSize: 13,
   },
   cellVal: {
      color: "white",
      fontSize: 15,
      fontWeight: "bold"
   },
});

const Container = styled.View`
  flex: 1;
  background-color: #222831;
  padding-top: 10px;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const Line = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: white;
  width: 100%;
  margin-bottom: 1px;
`;

export default DetailHourlyForecast;
