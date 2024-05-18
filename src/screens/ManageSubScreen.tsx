// LocationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import SubscribeRouteContainer from '../components/map/SubscribeRouteContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
   navigation: any,
   route: any
}

const Item = ({ sub, index, navigation }) => (
   // TODO: when long press, it display a checkbox 
   <View key={'sub' + index} style={styles.item}>
      <TouchableOpacity onPress={() => {
         navigation.navigate({
            name: 'SubscribeRouteScreen',
            params: { subscribe: sub, parent: 'ManageSubScreen' },
         });
      }}>
         <SubscribeRouteContainer
            routeInfo={sub}
         />
      </TouchableOpacity>
   </View>
);

const EditItem = ({ sub, index, handleDelete }) => (
   <View key={'sub' + index} style={styles.editItem}>
      <View style={styles.flexItem}>
         <SubscribeRouteContainer
            routeInfo={sub}
         />
      </View>
      <TouchableOpacity style={styles.trashContainer} onPress={() => handleDelete(sub)}>
         <Icon name="trash" size={24} />
      </TouchableOpacity>
   </View>
);

const ManageSubScreen: React.FC<Props> = ({ navigation, route }) => {
   const [editing, setEditing] = useState(false);
   const [subscriptions, setSubscriptions] = useState<any[]>([]);
   const [deletedSub, setDeletedSub] = useState<string[]>([]);

   useEffect(() => {
      if (route.params?.subscriptions) {
         setSubscriptions(route.params?.subscriptions)
      }
   }, [route])

   const handleDelete = async (sub) => {
      const url = `http://127.0.0.1:8080/subscribe/delete/${sub._id}`;

      try {
         let response = await fetch(url, {
            method: 'DELETE'
         });
         let result = await response.json();


         if (!response.ok) {
            throw new Error(result.message)
         }

         let newSubs = subscriptions.filter(e => e._id != sub._id);
         await AsyncStorage.setItem('subscriptions-' + route.params?.email, JSON.stringify(newSubs));

         Alert.alert('Xóa tuyến đường thành công');
         setSubscriptions(subscriptions.filter(e => e._id != sub._id));
         setDeletedSub([...deletedSub, sub._id])
      } catch (error) {
         Alert.alert('Đã có lỗi xảy ra :((');
         console.error('Error fetching subscribe route:', error);
      }
   }

   useEffect(() => {

   }, []);

   return (
      <View>
         <View style={styles.container}>
            <View style={styles.titleContainer}>
               <TouchableOpacity onPress={() => {
                  navigation.navigate({
                     name: 'Map',
                     params: { reload: true, deletedSub },
                     merge: true,
                  });
               }}>
                  <Icon name="angle-left" size={30} />
               </TouchableOpacity>
               <Text style={{ fontWeight: '900', fontSize: 16 }}>Danh sách theo dõi</Text>
            </View>
            <Text onPress={() => setEditing(!editing)}>Sửa</Text>
         </View>
         <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.contentContainer}>
            {(
               subscriptions.map((sub, index) => {
                  console.log(sub)
                  return editing ? <EditItem sub={sub} index={index} handleDelete={handleDelete}></EditItem> : <Item sub={sub} index={index} navigation={navigation} />
               })
            )}

         </ScrollView >
      </View>
   );
};


const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 5,
   },
   titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 15
   },
   item: {
      width: '100%',
   },
   contentContainer: {
      marginTop: 10,
      paddingHorizontal: 10,
   },
   editItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   flexItem: {
      width: '91%'
   },
   trashContainer: {
      paddingRight: 5,
   },
   scrollViewContent: {
      justifyContent: 'center',
      flexGrow: 1,
   },
})

export default ManageSubScreen;
