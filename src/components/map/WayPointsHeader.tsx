import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import LocationItem from './LocationItem';
import Waypoint from './interface/Waypoint';

interface WayPointsHeaderProps {
   routeName: string | null,
   waypoints: (Waypoint | null)[],
   location: number[],
   setWaypoints: Function,
   onSearchLocation: any,
   route: any
}

const WayPointsHeader: React.FC<WayPointsHeaderProps> = ({ routeName, waypoints, setWaypoints, onSearchLocation, route, location }) => {
   const handleAddWaypoint = () => {
      setWaypoints([...waypoints, null]);
   }

   const handleRemoveWaypoint = (indexToRemove: number) => {
      const updatedWaypoints = waypoints.filter((_, index) => index !== indexToRemove);
      setWaypoints(updatedWaypoints);
   }

   const handleUpdateWaypoint = (indexToUpdate: number, coordinates: number[], name: string) => {
      const updatedWaypoints = waypoints.map((waypoint, index) => {
         if (index == indexToUpdate) {
            return {
               coordinates,
               name
            }
         }
         return waypoint;
      });

      setWaypoints(updatedWaypoints);
   }

   const handleClearWaypoints = () => {
      setWaypoints([null, null]);
   }

   const haveNullPoint = (): boolean => {
      let i = waypoints.length - 1;
      while (i >= 0) {
         if (waypoints[i] == null) return true;
         i--;
      }

      return false;
   }

   const checkAllowCurrentLocation = (index: number): boolean => {
      let pre = index == 0 || waypoints[index - 1] == null ? true : waypoints[index - 1]?.coordinates[0] != location[0] || waypoints[index - 1]?.coordinates[1] != location[1];
      let pos = index == waypoints.length - 1 || waypoints[index + 1] == null ? true : waypoints[index + 1]?.coordinates[0] != location[0] || waypoints[index + 1]?.coordinates[1] != location[1];

      return pre && pos;
   }

   return (
      <View style={styles.fixedContainer}>
         <View style={styles.contentContainer}>
            {
               routeName && <Text style={styles.subscribeName}>{routeName}</Text>
            }
            <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.wayspointsContainer}>
               {(
                  waypoints.map((waypoint, index) => (
                     <LocationItem key={`locationitem-${index}`} allowCurrentLocation={checkAllowCurrentLocation(index)} route={route} index={index} waypoint={waypoint} allowDelete={waypoints.length > 2} onSearchLocation={onSearchLocation} handleRemoveWaypoint={handleRemoveWaypoint} handleUpdateWaypoint={handleUpdateWaypoint} />
                  ))
               )}

            </ScrollView >
            <View style={styles.buttonsContainer}>
               <TouchableOpacity style={!haveNullPoint() ? styles.addButton : [styles.addButton, styles.disableButton]} onPress={handleAddWaypoint} disabled={haveNullPoint()}>
                  <Text style={styles.addButtonText}>Thêm</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.clearButton} onPress={handleClearWaypoints}>
                  <Text style={styles.clearButtonText}>Xóa hết</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
}

export default WayPointsHeader;

const styles = StyleSheet.create({
   fixedContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      width: '100%',
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
   },
   subscribeName: {
      color: 'black',
      fontSize: 16,
      fontWeight: '600',
      marginTop: 10,
      marginLeft: 8,
      marginBottom: -10
   },
   scrollViewContent: {
      justifyContent: 'center',
      flexGrow: 1,
   },
   contentContainer: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 20,
      minHeight: 100,
      paddingHorizontal: 10,
   },
   wayspointsContainer: {
      width: '100%',
      maxHeight: 150,
      minHeight: 100,
   },
   addButton: {
      backgroundColor: 'blue',
      padding: 5,
      borderRadius: 5,
   },
   disableButton: {
      backgroundColor: 'gray',
   },
   addButtonText: {
      color: 'white',
      textAlign: 'center',
      paddingHorizontal: 5
   },
   clearButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
      paddingHorizontal: 10
   },
   clearButtonText: {
      color: 'white',
      textAlign: 'center',
   },
   buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginTop: 10,
      marginBottom: 10,
   },
});
