import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Waypoint from './interface/Waypoint';

interface LocationItemProps {
   index: number,
   allowDelete: boolean,
   waypoint: Waypoint | null,
   onSearchLocation: Function,
   allowCurrentLocation: boolean,
   handleRemoveWaypoint: Function,
   handleUpdateWaypoint: Function,
   route: any,
}

const LocationItem: React.FC<LocationItemProps> = ({ route, index, waypoint, allowDelete, allowCurrentLocation, onSearchLocation, handleRemoveWaypoint, handleUpdateWaypoint }) => {

   useEffect(() => {
      if (route.params?.index == index) {
         console.log(route.params?.coordinates)
         handleUpdateWaypoint(index, route.params?.coordinates, route.params?.name)
      }
   }, [route])

   return (
      <View style={styles.waypointItem} key={index}>
         <TouchableOpacity
            style={styles.input}
            onPress={() => onSearchLocation(waypoint?.name, index, allowCurrentLocation)}
         >
            {/* TODO: how to make the overflow text be hidden */}
            <Text style={styles.inputText} numberOfLines={1} >
               {waypoint ? waypoint.name : "Tìm kiếm hoặc chọn trên bản đồ"}
            </Text>
         </TouchableOpacity>
         {allowDelete && (
            <TouchableOpacity style={styles.removeContainer} onPress={() => handleRemoveWaypoint(index)}>
               <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
         )}
      </View>
   );
}

export default LocationItem;

const styles = StyleSheet.create({
   waypointItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingLeft: 10,
   },
   input: {
      paddingVertical: 5,
      width: "90%",
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
   },
   inputText: {
      fontSize: 16,
      color: 'gray',
   },
   removeContainer: {
      alignItems: 'center',
      width: 30,
   },
   removeButtonText: {
      color: 'red',
   },
});
