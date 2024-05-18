import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styled from "styled-components/native";

interface Props {
   routeInfo: any;
}

const SubsctibeRouteContainer: React.FC<Props> = ({ routeInfo }) => {
   const timestampToTimeString = (timestampInSeconds: number): string => {
      const date = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds
      const hours = date.getHours().toString().padStart(2, '0'); // Get hours (in 24-hour format) and pad with leading zero if needed
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed
      return `${hours}:${minutes}`;
   }

   return (
      <View style={styles.subInfo}>
         <View style={styles.iconContainer}>
            <View style={styles.routeIcon}>
               <Icon name="route" size={30} />
            </View>
         </View>
         <View style={styles.infoContainer}>
            <Text>
               <Text style={styles.nameText}>{routeInfo?.name}</Text> -{' '}
               {(parseInt(routeInfo?.distance) / 1000).toFixed(1)} km
            </Text>
            <Text>Thông báo: {routeInfo?.start} - {routeInfo?.end}</Text>
            <Text style={styles.infoText} numberOfLines={1}>Từ: {routeInfo?.waypoints[0].name}</Text>
            <Text style={styles.infoText} numberOfLines={1}>Đến: {routeInfo?.waypoints[routeInfo?.waypoints.length - 1].name}</Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   subInfo: {
      flexDirection: 'row',
      backgroundColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 8,
      paddingVertical: 10,
      width: '100%',
   },
   routeIcon: {
      width: 30,
   },
   iconContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
   },
   timeText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 5,
   },
   infoContainer: {
      marginLeft: 8,
   },
   infoText: {
      fontSize: 14,
   },
   nameText: {
      color: 'black',
      fontWeight: '600'
   }
});

export default SubsctibeRouteContainer;
