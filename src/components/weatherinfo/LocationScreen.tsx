// LocationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import styled from "styled-components/native";
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

const Item = ({ item, navigation }) => (
   <View>
      <TouchableOpacity onPress={() => {
         navigation.navigate({
            name: 'WeatherInfo',
            params: { city: item.title },
            merge: true,
         });
      }}>
         <Box>
            <Text>{item.title}</Text>
         </Box>
      </TouchableOpacity>
   </View>
);

const EditItem = ({ item, handleDelete }) => (
   <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box style={{ width: "85%" }}>
         <Text>{item.title}</Text>
      </Box>
      <Text onPress={() => handleDelete(item.title)}>
         <Icon name="trash" size={24} />
      </Text>
   </View>
);

let data = [
   // Sample data for the cards
   { title: 'Thủ Đức', subtitle: 'Subtitle 1' },
   // Add more cards as needed
];

const LocationScreen = ({ navigation, route }) => {
   const [locations, setLocations] = useState([{}]);
   const [searchText, setSearchText] = useState("");
   const [matchResults, setMatchResults] = useState([]);
   const [editing, setEditing] = useState(false);

   const handleTextChange = (text) => {
      setSearchText(text);

      //Query
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?types=locality&proximity=106.787305,10.867553&access_token=pk.eyJ1IjoiYXRvbWljZHVjayIsImEiOiJjbG53b2t4b24wOHBiMmxwY2h2anJrNWkxIn0.FXiRCSKZGDHWSWZiIs_ZUw&language=vi&limit=10`)
         .then((res) => res.json())
         .then((data) => {
            let results = data["features"].map((feature) => {
               return {
                  text_vi: feature["text_vi"],
                  sub_name_vi: feature["place_name_vi"].replace(feature["text_vi"], "")
               }
            })
            setMatchResults(results)
         })
   }

   const handleChoosen = (cityName) => {
      if (data.indexOf({ title: cityName, subtitle: "" }) == -1) {
         data.push({ title: cityName, subtitle: "" })
         setLocations(data);
      }
      setMatchResults([])
      setSearchText("");
   }

   const handleDelete = (cityName) => {
      data = data.filter(item => item.title != cityName)
      setLocations(data)
   }

   useEffect(() => {
      console.log("loading location");
      setLocations(data);
   }, []);

   if (matchResults.length > 0) {
      return (
         <View>
            <Container>
               <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 120, justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => {
                     navigation.goBack();
                  }}>
                     <Icon name="angle-left" size={30} />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: '900', fontSize: 16 }}>Sửa Địa Điểm</Text>
               </View>
            </Container>
            <SearchCity
               placeholder={"Nhập tên thành phố"}
               value={searchText}
               onChangeText={handleTextChange}
            />
            <View style={{ borderColor: "black", borderTopWidth: 0.5, padding: 10 }}>
               <FlatList
                  data={matchResults}
                  renderItem={(item) => {
                     return (
                        <Text style={{ marginLeft: 5, marginBottom: 10, paddingBottom: 10, borderColor: "black", borderBottomWidth: 0.2, fontSize: 12 }} onPress={() => handleChoosen(item.item["text_vi"])}>
                           <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.item["text_vi"]}</Text> {item.item["sub_name_vi"]}
                        </Text>
                     )
                  }} />
            </View>
         </View >
      );
   }

   return (
      <View>
         <Container>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 120, justifyContent: 'space-between' }}>
               <TouchableOpacity onPress={() => {
                  navigation.goBack();
               }}>
                  <Icon name="angle-left" size={30} />
               </TouchableOpacity>
               <Text style={{ fontWeight: '900', fontSize: 16 }}>Sửa Địa Điểm</Text>
            </View>
            <Text onPress={() => setEditing(!editing)}>Edit</Text>
         </Container>
         <SearchCity
            placeholder={"Nhập tên thành phố"}
            value={searchText}
            onChangeText={handleTextChange}
         />
         <FlatList
            data={locations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => editing ? <EditItem item={item} handleDelete={handleDelete}></EditItem> : <Item item={item} navigation={navigation} />}
         />
      </View>
   );
};

const SearchCity = styled.TextInput`
  height: 50px;
  margin: 12px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  width: 95%;
  max-width: 700px;
`;

const Box = styled.View`
  height: 50px;
  margin: 12px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  width: 95%;
  max-width: 700px;
`;

const Container = styled.View`
   display: flex;
   flexDirection: row;
   alignItems: center;
   justifyContent: space-between;
   width: 100%;
   padding: 5px 15px 5px 15px;
`;

export default LocationScreen;
