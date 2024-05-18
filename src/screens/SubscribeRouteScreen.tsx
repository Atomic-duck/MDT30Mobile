// Import necessary modules
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import {
   GoogleSignin,
   GoogleSigninButton,
   NativeModuleError,
   statusCodes,
} from '@react-native-google-signin/google-signin';
import type { User } from '@react-native-google-signin/google-signin';
import { CheckBox } from '@rneui/base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LoginModal from '../components/subscribe/LoginModal';
import RepeatModal from '../components/subscribe/RepeatModal';
import CustomRepeatModal from '../components/subscribe/CustomRepeatModal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Waypoint from '../components/map/interface/Waypoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSubscriptions, saveSubscription, updateSubscription } from '../utils/fetchData';
import { getCurrentUser } from '../utils/authen';

interface SubInfo {
   _id: string | null,
   coordinates?: [number, number][],
   distance?: number,
   waypoints?: Waypoint[],
   name: string,
   start: string,
   end: string,
   repeat: number[],
   repeatDisplay: string
}

interface Props {
   navigation: any,
   route: any,
}


// Define your component
const SubscribeRouteScreen: React.FC<Props> = ({ navigation, route }) => {
   // State to manage the visibility of the login modal
   const [loading, setLoading] = useState(false);
   const [showTimeModel, setShowTimeModal] = useState(0);
   const [showRepeatModel, setShowRepeatModal] = useState(false);
   const [showCustomRepeatModal, setShowCustomRepeatModal] = useState(false);
   const [changed, setChanged] = useState(false)


   const [userInfo, setUserInfo] = useState<any>();
   const [subInfo, setSubInfo] = useState<SubInfo>({ _id: null, name: "", start: '17:30', end: '20:30', repeat: [0], repeatDisplay: 'Một lần' });


   useEffect(() => {
      (async () => {
         setLoading(true);
         setUserInfo(await getCurrentUser());
         setLoading(false);
      })();
   }, []);

   useEffect(() => {
      let sub = route.params?.subscribe;
      if (sub) {
         setSubInfo({
            _id: sub._id,
            coordinates: sub.coordinates,
            distance: sub.distance,
            waypoints: sub.waypoints,
            name: sub.name,
            end: sub.end,
            repeat: sub.repeat,
            start: sub.start,
            repeatDisplay: getRepeatDisplay(sub.repeat)
         })
      }
   }, [route]);

   // Function to navigate back to the previous screen
   const handleBackLogin = () => {
      navigation.goBack();
   };

   const handleSubscribeRoute = async () => {
      Keyboard.dismiss();
      // Validate input
      if (!subInfo.name.trim()) {
         Alert.alert('Tên tuyến đường là bắt buộc'); // Display error message
         return;
      }

      const body = JSON.stringify({
         email: userInfo?.email,
         coordinates: route.params?.coordinates,
         distance: route.params?.distance,
         waypoints: route.params?.waypoints,
         name: subInfo.name,
         start: subInfo.start,
         end: subInfo.end,
         repeat: subInfo.repeat // Use customRepeat if custom mode is enabled
      });


      try {
         let id = await saveSubscription(userInfo?.email, body)

         // Display success message
         Alert.alert('Theo dõi tuyến đường thành công');
         setSubInfo({
            ...subInfo,
            _id: id,
            coordinates: route.params?.coordinates,
            distance: route.params?.distance,
            waypoints: route.params?.waypoints,
         });
         setChanged(false);
      } catch (error) {
         // Display error message
         Alert.alert('Đã có lỗi xảy ra :((');
         console.error('Error post subscription:', error);
      }
   };

   const handleSaveChange = async () => {
      Keyboard.dismiss();
      let sub = route.params?.subscribe;
      const body = JSON.stringify({
         coordinates: sub.coordinates,
         distance: sub.distance,
         waypoints: sub.waypoints,
         name: subInfo.name,
         start: subInfo.start,
         end: subInfo.end,
         repeat: subInfo.repeat, // Use customRepeat if custom mode is enabled
         once: Date.now()
      })

      // Validate input
      if (!subInfo.name.trim()) {
         Alert.alert('Tên tuyến đường là bắt buộc'); // Display error message
         return;
      }

      try {
         await updateSubscription(userInfo?.email, sub._id, body);

         // Display success message
         Alert.alert('Lưu thay đổi thành công');
         setChanged(false);
      } catch (error) {
         // Display error message
         Alert.alert('Đã có lỗi xảy ra :((');
         console.error('Error post subscription:', error);
      }
   }

   const handleCustomRepeat = () => {
      // Implement logic to open a new modal for custom repeat settings
      // For example:
      setShowCustomRepeatModal(true);
      setShowRepeatModal(false);
   };

   const handleTimeConfirm = (date: Date) => {
      setShowTimeModal(0)
      if (showTimeModel == 1) {
         setSubInfo({ ...subInfo, start: date.toLocaleTimeString(undefined, { hour12: false }).slice(0, 5) })
         setChanged(true);
      } else if (showTimeModel == 2) {
         setSubInfo({ ...subInfo, end: date.toLocaleTimeString(undefined, { hour12: false }).slice(0, 5) })
         setChanged(true);
      } else {
         console.error("why showTimeModel is" + showTimeModel)
      }
   }

   const handleNameChange = (text: string) => {
      setSubInfo({ ...subInfo, name: text });
      setChanged(true);
   };

   const onSelectRepeat = (value: number[]) => {
      if (value.length == 0) value = [0];

      setSubInfo({ ...subInfo, repeat: value, repeatDisplay: getRepeatDisplay(value) })
      setChanged(true);
   }

   const getRepeatDisplay = (value: number[]) => {
      let repeatDisplay = "";
      if (value[0] == 0) repeatDisplay = "Một lần";
      else if (value[0] == 10) repeatDisplay = "Hằng ngày";
      else if (value[0] == 26) repeatDisplay = "Thứ hai đến Thứ sáu";
      else {
         value.sort((a, b) => a - b);
         for (let i = 0; i < value.length; i++) {
            if (i > 0) repeatDisplay += ' ';
            if (value[i] == 8) repeatDisplay += 'CN';
            else repeatDisplay += 'Th ' + value[i];
         }
      }

      return repeatDisplay;
   }

   const handleGoBack = () => {
      if (route.params?.parent === 'Map' && subInfo._id) {
         navigation.navigate({
            name: 'Map',
            params: {
               subInfo: subInfo,
            },
            merge: true,
         });
      }
      else {
         navigation.goBack()
      }
   }

   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
               <TouchableOpacity onPress={handleGoBack}>
                  <Icon name="angle-left" size={30} />
               </TouchableOpacity>
               <Text style={{ fontWeight: '900', fontSize: 16 }}>Theo dõi tuyến đường</Text>
            </View>
         </View>
         {/* TODO: make textinput when pressonout, it no longer forcus  */}

         <View style={styles.contentContainer}>
            <TextInput
               placeholder={"Nhập tên tuyến đường"}
               style={styles.textInput}
               value={subInfo.name}
               onChangeText={handleNameChange}
            />
            <View style={styles.field}>
               <Text style={styles.textTitle}>Từ</Text>
               <TouchableOpacity style={styles.subButton} onPress={() => setShowTimeModal(1)}>
                  <Text>{subInfo.start}</Text>
               </TouchableOpacity>
            </View>
            <View style={styles.field}>
               <Text style={styles.textTitle}>Đến</Text>
               <TouchableOpacity style={styles.subButton} onPress={() => setShowTimeModal(2)}>
                  <Text>{subInfo.end}</Text>
               </TouchableOpacity>

            </View>
            <View style={styles.field}>
               <Text style={styles.textTitle}>Lặp lại</Text>
               <TouchableOpacity style={styles.subButton} onPress={() => setShowRepeatModal(true)}>
                  <Text>{subInfo.repeatDisplay}</Text>
               </TouchableOpacity>
            </View>
         </View>
         <View style={styles.btContainer}>
            {
               !subInfo._id && (
                  <TouchableOpacity style={styles.subButton} onPress={handleSubscribeRoute}>
                     <Text style={styles.subText}>Đăng ký</Text>
                  </TouchableOpacity>
               )
            }

            {
               subInfo._id && changed && (
                  <TouchableOpacity style={styles.subButton} onPress={handleSaveChange}>
                     <Text style={styles.subText}>Lưu thay đổi</Text>
                  </TouchableOpacity>
               )
            }

         </View>


         {/* Login Modal */}
         <LoginModal visible={!loading && !userInfo} onClose={handleBackLogin} />

         {/* Time Modal */}
         <DateTimePickerModal
            isVisible={showTimeModel != 0}
            mode="time"
            is24Hour
            onConfirm={handleTimeConfirm}
            onCancel={() => setShowTimeModal(0)}
            timeZoneName=''
         />

         <RepeatModal visible={showRepeatModel} onClose={() => setShowRepeatModal(false)} selectedRepeat={subInfo.repeat} onCustomRepeat={handleCustomRepeat} onSelectRepeat={onSelectRepeat} />
         <CustomRepeatModal visible={showCustomRepeatModal} onClose={() => setShowCustomRepeatModal(false)} onSelectRepeat={onSelectRepeat} />
      </View>
   );
};

// Define your styles
const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      width: '100%',
      height: '100%',
      paddingHorizontal: 15,
      paddingTop: 5
   },
   headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      marginTop: 5,
      marginBottom: 15
   },
   titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 15
   },
   contentContainer: {

   },
   textInput: {
      height: 50,
      width: "100%",
      backgroundColor: "rgba(200,200,200,0.3)",
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 1,
   },
   field: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10
   },
   textTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: 'black'
   },
   btContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
   },
   subButton: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      backgroundColor: 'rgba(240,240,240, 0.8)',
      borderRadius: 5
   },
   subText: {
      fontSize: 16,
      color: 'blue'
   },
});

// Export your component
export default SubscribeRouteScreen;
