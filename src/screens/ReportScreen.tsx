import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
   SafeAreaView,
   StyleSheet,
   Text,
   View,
   ActivityIndicator,
   TextInput,
   TouchableOpacity,
   Image,
   Alert,
   ScrollView,
} from 'react-native';
import {
   Camera,
   Point,
   useCameraDevice,
} from 'react-native-vision-camera';

import Reanimated, { runOnJS, useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TrafficModal from '../components/report/TrafficModal';
import WeatherModal from '../components/report/WeatherModal';

import JamTraffic from '../images/warning.png'
import BadWeather from '../images/bad-weather.png'
import RoadWork from '../images/roadwork.png'
import { GoogleSignin, NativeModuleError, statusCodes } from '@react-native-google-signin/google-signin';
import { uploadRoadStatus } from '../utils/fetchData';
import AccidentModal from '../components/report/AccidentModal';

interface Props {
   navigation: any,
   route: any
}

const ReportScreen: React.FC<Props> = ({ navigation, route }) => {
   const isFocused = useIsFocused()
   const appState = useAppState()
   const [isActive, setIsActive] = useState(true)
   const camera = useRef<Camera>(null);
   const [cameraPermission, setCameraPermission] = useState();
   const [photoPath, setPhotoPath] = useState<string | null>(null);
   const cameraDevice = useCameraDevice('back', {
      physicalDevices: [
         'ultra-wide-angle-camera',
         'wide-angle-camera',
         'telephoto-camera'
      ]
   });
   const [openModal, setModal] = useState(0);
   const [roadStatus, setRoadStatus] = useState<any[]>([])

   useEffect(() => {
      (async () => {
         const cameraPermissionStatus = await Camera.requestCameraPermission();
         setCameraPermission(cameraPermissionStatus);
         const userInfo = await GoogleSignin.signInSilently();
      })();
   }, []);

   useEffect(() => {
      setIsActive(isFocused && appState === "active");
   }, [isFocused, appState])

   useEffect(() => {
      setIsActive(!photoPath);
      if (!photoPath) setRoadStatus([]);
   }, [photoPath])

   const getUserEmail = async () => {
      try {
         const userInfo = await GoogleSignin.signInSilently();
         return userInfo.user.email;
      } catch (error) {
         const typedError = error as NativeModuleError;
         if (typedError.code === statusCodes.SIGN_IN_REQUIRED) {
            console.log('User not signed it yet, please sign in :)')
         } else {
            console.log('silent login err: ', error)
         }

         return "User"
      }
   }

   const focus = useCallback((point: Point) => {
      const c = camera.current
      if (c == null) return;
      console.log(point)
      c.focus(point)
   }, [])

   const gesture = Gesture.Tap()
      .onEnd(({ x, y }) => {
         runOnJS(focus)({ x, y })
      })

   const handleTakePhoto = async () => {
      try {
         const photo = await camera.current.takePhoto({
            flash: 'off',
            qualityPrioritization: 'quality',
            enableAutoStabilization: true,
            enableShutterSound: false
         });

         setPhotoPath('file://' + photo.path);
      } catch (e) {
         console.log(e);
      }
   };

   const handleDeletePhoto = async () => {
      setPhotoPath(null);
      setIsActive(true)
   }

   const addRoadStatus = (status: any) => {
      let newStatus = [];
      let isNew = true;

      for (let i = 0; i < roadStatus.length; i++) {
         if (roadStatus[i].type == status.type) {
            if (status.condition) {
               newStatus.push({
                  type: status.type,
                  condition: status.condition
               })
            }
            isNew = false;
         }
         else {
            newStatus.push(roadStatus[i]);
         }
      }

      if (isNew) newStatus.push(status);

      setRoadStatus(newStatus);
   }

   const checkActive = (type: string) => {
      for (let i = 0; i < roadStatus.length; i++) {
         if (roadStatus[i].type == type) return true;
      }

      return false;
   }

   const handleSubmit = async () => {
      try {
         const formData = new FormData();
         const timestamp = Date.now();
         formData.append('image', {
            uri: photoPath,
            type: 'image/jpeg', // Modify the type as needed
            name: route.params?.location[0].toString() + '-' + route.params?.location[1].toString() + '_' + timestamp.toString() + '.jpg',
         });
         formData.append('coordinates', JSON.stringify([106.80825135191782, 10.877151427479063]));
         formData.append('conditions', JSON.stringify(roadStatus));
         formData.append('timestamp', Date.now());
         formData.append('email', await getUserEmail());

         const responseData = await uploadRoadStatus(formData);

         Alert.alert('Báo cáo được tải lên thành công');
         navigation.goBack();
      } catch (error) {
         console.error('Error uploading photo and road status:', error);
         Alert.alert('Error', 'An error occurred while submitting photo and road status');
      }
   }


   const renderTakingPhoto = () => {
      return (
         <View>
            <GestureHandlerRootView style={[styles.imageContainer, photoPath != null && styles.hidden]}>
               <GestureDetector gesture={gesture}>
                  <Camera
                     ref={camera}
                     style={[styles.camera]}
                     // style={StyleSheet.absoluteFill}
                     device={cameraDevice}
                     isActive={isActive}
                     photo
                     enableZoomGesture
                  />
               </GestureDetector>
               <TouchableOpacity style={styles.takePhotoBtn} onPress={handleTakePhoto}>
               </TouchableOpacity>
            </GestureHandlerRootView>
            {photoPath && (
               <View style={styles.imageContainer}>
                  <TouchableOpacity style={styles.deleteImage} onPress={handleDeletePhoto}>
                     <Icon name='times' size={24} color={'red'} />
                  </TouchableOpacity>

                  <Image style={[styles.camera]} source={{ uri: photoPath }} />
               </View>

            )}

            <View style={[styles.content, !photoPath && styles.hidden]}>
               <Text style={styles.reportTitle}>Bạn đang thấy gì?</Text>
               <View style={styles.itemContainer}>
                  <View style={[styles.item]}>
                     <TouchableOpacity style={[styles.avatar, checkActive('traffic') && styles.active]} onPress={() => setModal(1)}>
                        <Image source={JamTraffic} />
                     </TouchableOpacity>
                     <Text style={styles.title}>Giao thông</Text>
                  </View>
                  <View style={[styles.item]}>
                     <TouchableOpacity style={[styles.avatar, checkActive('weather') && styles.active]} onPress={() => setModal(2)}>
                        <Image source={BadWeather} />
                     </TouchableOpacity>
                     <Text style={styles.title}>Thời tiết</Text>
                  </View>
                  <View style={[styles.item]}>
                     <TouchableOpacity style={[styles.avatar, checkActive('others') && styles.active]} onPress={() => setModal(3)}>
                        <Image source={RoadWork} />
                     </TouchableOpacity>
                     <Text style={styles.title}>Khác</Text>
                  </View>
               </View>
            </View>

            <TrafficModal visible={openModal == 1} onClose={() => { setModal(0) }} addRoadStatus={addRoadStatus} />
            <WeatherModal visible={openModal == 2} onClose={() => { setModal(0) }} addRoadStatus={addRoadStatus} />
            <AccidentModal visible={openModal == 3} onClose={() => { setModal(0) }} addRoadStatus={addRoadStatus} />
            {
               roadStatus.length > 0 && (
                  <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                     <Text style={styles.btnTitle}>Báo cáo</Text>
                  </TouchableOpacity>
               )
            }
         </View>

      );
   };

   const renderContent = () => {
      if (cameraDevice == null) {
         return <ActivityIndicator size="large" color="#1C6758" />;
      }
      if (cameraPermission !== 'granted') {
         return null;
      }

      return renderTakingPhoto();
   };

   return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.screen}>
         {renderContent()}
      </ScrollView>
   );
}

export default ReportScreen;

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: '#EEF2E6',
   },
   camera: {
      height: 460,
      width: '92%',
      alignSelf: 'center',
   },
   takePhotoBtn: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: 20,
      width: 50,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 50,
   },
   content: {
      marginTop: 20
   },
   imageContainer: {
      width: '100%',
      marginTop: 10
   },
   deleteImage: {
      position: 'absolute',
      top: 10,
      right: '8%',
      zIndex: 2
   },
   hidden: {
      display: 'none'
   },
   scrollViewContent: {
      justifyContent: 'flex-start',
      flexGrow: 1,
   },
   fieldContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   reportTitle: {
      fontSize: 24,
      marginLeft: 15,
      fontWeight: '500'
   },
   itemContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: '100%',
      marginLeft: 5,
      marginTop: 20
   },
   item: {
      width: '30%', // Adjust as needed to fit 3 items per row
      marginBottom: 15,
      alignItems: 'center',
      marginHorizontal: 5
   },
   avatar: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: 'rgba(192,192,192,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
   },
   title: {
      fontWeight: '500',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 8,
   },
   active: {
      borderWidth: 5,
      borderColor: 'rgba(3, 138, 255, 0.8)',
      borderStyle: 'solid',
   },
   btn: {
      height: 50,
      paddingVertical: 10,
      backgroundColor: 'rgba(241, 90, 34, 0.8)',
      marginVertical: 20,
      marginHorizontal: 80,
      alignItems: 'center',
      borderRadius: 25
   },
   btnTitle: {
      fontWeight: '500',
      fontSize: 20,
      textAlign: 'center',
      color: 'white'
   }
});