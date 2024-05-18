// LocationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import config from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationSearchProps {
   navigation: any,
   route: any,
}

interface SearchHistory {
   num: number,
   name: string,
   coordinates: number[],
   subName: string
}

const LocationSearch: React.FC<LocationSearchProps> = ({ navigation, route }) => {
   const [locations, setLocations] = useState<any[]>([]);
   const [searchText, setSearchText] = useState("");
   const [matchResults, setMatchResults] = useState([]);
   const [editing, setEditing] = useState(false);
   const searchHistorySize = "searchHistorySize"
   const key = "searchHistory-"

   const storeSearchHistory = async (name: string, coordinates: number[], subName: string) => {
      try {
         let size = await AsyncStorage.getItem(searchHistorySize);
         if (size == null) {
            size = "1";
            await AsyncStorage.setItem(searchHistorySize, size);
         }
         else {
            size = `${parseInt(size) + 1}`;
         }

         const jsonValue = JSON.stringify({
            num: size,
            name,
            coordinates,
            subName
         });

         await AsyncStorage.setItem(searchHistorySize, size);
         await AsyncStorage.setItem(key + size, jsonValue);
      } catch (err) {
         console.error("Error in store Search History to local storage", err)
      }
   };

   const getAllSearchHistory = async () => {
      try {
         let size = await AsyncStorage.getItem(searchHistorySize);
         let count = 0;
         const promises = [];

         if (size != null) {
            count = parseInt(size);
         }

         while (count > 0) {
            promises.push(await AsyncStorage.getItem(key + count));
            count--;
         }

         return (await Promise.all(promises)).map(value => value != null ? JSON.parse(value) : null);
      } catch (err) {
         console.error("Error in get all Search History to local storage", err)
      }
   };

   const handleTextChange = (text: string) => {
      setSearchText(text);

      //Query
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?country=vn&proximity=ip&access_token=pk.eyJ1IjoiYXRvbWljZHVjayIsImEiOiJjbG53b2t4b24wOHBiMmxwY2h2anJrNWkxIn0.FXiRCSKZGDHWSWZiIs_ZUw&language=vi&limit=10`)
         .then((res) => res.json())
         .then((data) => {
            let results = data["features"].map((feature) => {
               return {
                  text_vi: feature["text_vi"],
                  sub_name_vi: feature["place_name_vi"].replace(feature["text_vi"], ""),
                  coordinate: feature.geometry.coordinates,
               }
            })
            setMatchResults(results)
         })
   }

   const handleChoosen = (name: string, subName: string, coordinates: number[]) => {
      // save to lacal storage
      storeSearchHistory(name, coordinates, subName)

      setMatchResults([])
      setSearchText("");

      navigation.navigate({
         name: 'Map',
         params: {
            name: name,
            coordinates: coordinates,
            index: route.params?.index,
         },
         merge: true,
      });
   }

   const handleDelete = (num: string) => {
      const removeSearchHistory = async () => {
         try {
            await AsyncStorage.removeItem(key + num);
            data = locations.filter(location => location.num != num)
            setLocations(data)
         } catch (err) {
            console.error("Error remove search history", err)
         }
      }

      removeSearchHistory();
   }

   const hanldeNavigate = (name: string, coordinates: number[]) => {
      navigation.navigate({
         name: 'Map',
         params: {
            name,
            coordinates,
            index: route.params?.index,
         },
         merge: true,
      });
   }

   useEffect(() => {
      getAllSearchHistory().then(result => {
         let newLocations = result?.filter(location => location != null);
         if (newLocations) {
            setLocations(newLocations);
         }
      })
   }, []);

   return (
      <View>
         <View style={styles.topContainer}>
            <View style={styles.searchHeader}>
               <TouchableOpacity style={styles.backContainer} onPress={() => {
                  navigation.goBack();
               }}>
                  <Icon name="angle-left" size={30} />
               </TouchableOpacity>
               <TextInput
                  placeholder={"Nhập tên thành phố"}
                  value={searchText}
                  onChangeText={handleTextChange}
                  style={styles.textInput}
               />
               {
                  matchResults.length <= 0 && <Text onPress={() => setEditing(!editing)}>Edit</Text>
               }
            </View>
            {
               route.params?.allowCurrentLocation && (
                  <TouchableOpacity style={styles.currentContainer} onPress={() => hanldeNavigate("Vị trí của bạn", route.params?.current)}>
                     <View style={styles.iconContainer}>
                        <Icon name={'globe'} size={26} />
                     </View>
                     <View style={styles.location}>
                        <Text>Vị trí của bạn</Text>
                     </View>
                  </TouchableOpacity>
               )
            }
         </View>
         <View style={styles.contentContainer}>
            {
               matchResults.length > 0 ? (
                  <FlatList
                     data={matchResults}
                     renderItem={(item) => {
                        let subName = item.item["sub_name_vi"].slice(2, item.item["sub_name_vi"].length);
                        return (
                           <Item name={item.item["text_vi"]} subName={subName} iconStr='globe' handleOnPress={() => handleChoosen(item.item["text_vi"], subName, item.item["coordinate"])} />
                        )
                     }} />
               ) : (
                  <FlatList
                     data={locations}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item }) => editing ? <EditItem name={item.name} subName={item.subName} handleDelete={() => handleDelete(item.num)}></EditItem> : <Item name={item.name} subName={item.subName} iconStr='globe' handleOnPress={() => hanldeNavigate(item.name, item.coordinates)} />}
                  />
               )
            }
         </View>
      </View>
   );
};

const Item = ({ name, subName, iconStr, handleOnPress }: { name: string, subName: string | null, iconStr: string, handleOnPress: any }) => (
   <TouchableOpacity style={styles.itemContainer} onPress={() => handleOnPress()}>
      <View style={styles.iconContainer}>
         <Icon name={iconStr} size={26} />
      </View>
      <View style={styles.location}>
         <Text>{name}</Text>
         {subName && <Text>{subName}</Text>}
      </View>
   </TouchableOpacity>
);

const EditItem = ({ name, subName, handleDelete }: { name: string, subName: string, handleDelete: any }) => (
   <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
         <Icon name="globe" size={26} />
      </View>
      <View style={styles.location}>
         <Text>{name}</Text>
         <Text>{subName}</Text>
      </View>
      <Text onPress={handleDelete}>
         <Icon name="trash" size={24} />
      </Text>
   </View>
);

const styles = StyleSheet.create({
   topContainer: {
      width: '100%',
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 10,
   },
   searchHeader: {
      width: "100%",
      height: 50,
      paddingHorizontal: 15,
      borderRadius: 25,
      borderWidth: 0.8,
      borderStyle: 'solid',
      borderColor: 'rgba(100, 100, 100, 0.5)',
      flexDirection: 'row',
      alignItems: 'center',
   },
   textInput: {
      height: 50,
      width: "90%",
      flex: 2,
   },
   backContainer: {
      flex: 0.2
   },
   contentContainer: {
      width: "100%",
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: 'white',
   },
   currentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 10,
      paddingBottom: 5,
      marginHorizontal: 15,
   },
   itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingBottom: 10,
      marginHorizontal: 15,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(100, 100, 100, 0.5)',
   },
   iconContainer: {
      flex: 0.2,
      marginLeft: -5,
   },
   location: {
      flex: 2,
   },
})

export default LocationSearch;
