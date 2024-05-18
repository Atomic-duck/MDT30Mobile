// LocationScreen.tsx
import { GoogleSignin, GoogleSigninButton, NativeModuleError, User, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getCurrentUser, login, logout, register } from '../utils/authen';

interface Props {
   navigation: any,
   route: any
}

// TODO: create a setting screen include user name, login button, register button
const SettingScreen: React.FC<Props> = ({ navigation, route }) => {
   const [userInfo, setUserInfo] = useState<any>();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      (async () => {
         setLoading(true);
         setUserInfo(await getCurrentUser());
         setLoading(false);
      })();
   }, []);

   const handleLogin = async () => {
      setUserInfo(await login())
   }

   const handleRegister = async () => {
      setUserInfo(await register())
   }

   const handleLogout = async () => {
      setLoading(true);
      await logout();
      setUserInfo(null);
      setLoading(false);
   }

   const goToMap = () => {
      navigation.navigate({
         name: 'Map',
         params: { userInfo },
         merge: true,
      });
   }

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={goToMap}>
               <Icon name="times" size={30} />
            </TouchableOpacity>
         </View>
         <View style={styles.userProfile}>
            <View>
               <Text style={styles.name}>Xin chào {userInfo ? userInfo.name : 'bạn'}</Text>
               {
                  userInfo ? (
                     <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
                           <Text>Đăng xuất</Text>
                        </TouchableOpacity>
                     </View>
                  ) : (
                     <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                           <Text>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                           <Text>Đăng ký</Text>
                        </TouchableOpacity>
                     </View>
                  )
               }

            </View>
         </View>
         <View>

         </View>
         {loading ? (
            <ActivityIndicator
               size="large"
               color="white"
               style={styles.loadingIndicator}
            />
         ) : null
         }
      </View>
   );
};


const styles = StyleSheet.create({
   container: {
      padding: 10,
      width: '100%'
   },
   header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end'
   },
   userProfile: {
      width: '100%',
      flexDirection: 'row',
      gap: 20,
      paddingBottom: 10,
      paddingHorizontal: 10,
      marginTop: 20,
      borderStyle: 'solid',
      borderBottomWidth: 0.5,
      borderBottomColor: 'gray',
   },
   name: {
      fontSize: 24,
      fontWeight: '500',
      color: 'black'
   },
   btnContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10
   },
   btn: {
      width: 100,
      alignItems: 'center',
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 15,
      backgroundColor: 'rgba(192,192,192, 0.7)'
   },
   loadingIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 2,
   },
})

export default SettingScreen;
