import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';

import SubscribeRouteContainer from './SubscribeRouteContainer';
import { getSubscriptions } from '../../utils/fetchData';

interface Props {
   userInfo: any,
   setSubscribe: any,
   navigation: any,
   route: any
}

const SubscribeTab: React.FC<Props> = ({ userInfo, setSubscribe, navigation, route }) => {
   const [subscriptions, setSubscriptions] = useState<any[]>();
   const [loading, setLoading] = useState(false); // State to manage loading indicator

   useEffect(() => {
      if (userInfo) {
         (async () => {
            setLoading(true);
            await fetchSubscribeRoutes();
            setLoading(false);
         })()
      }
   }, [userInfo, route.params])

   const fetchSubscribeRoutes = async () => {
      try {
         let result = await getSubscriptions(userInfo?.email);

         setSubscriptions(result);
      } catch (error) {
         console.error('Error fetching subscribe route:', error);
      }
   }

   const showSubscribeRoute = async (sub: any) => {
      const url = `http://127.0.0.1:8080/subscribe/${sub._id}`;

      try {
         let response = await fetch(url, {
            method: 'GET'
         });
         let result = await response.json();


         setSubscribe({ ...sub, coordinates: result.coordinates })
      } catch (error) {
         console.error('Error fetching subscribe route:', error);
      }
   }

   if (loading) {
      return <ActivityIndicator
         size="large"
         color="black"
         style={[styles.tabContent, styles.centerContent]}
      />
   }

   return (
      <>
         {
            !userInfo ? (
               <View style={[styles.tabContent, styles.centerContent]}>
                  <Text>Bạn chưa đăng nhập</Text>
               </View>
            ) : (
               <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.tabContent}>
                  {
                     subscriptions && subscriptions?.length > 0 ? (
                        <View style={styles.manageContainer}>
                           <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate('ManageSubScreen', {
                              subscriptions: subscriptions,
                              email: userInfo?.email
                           })}>
                              <Text>Quản lý đăng ký {'>>'}</Text>
                           </TouchableOpacity>
                        </View>
                     ) : (
                        <Text>Không có tuyến đường theo dõi nào</Text>
                     )
                  }
                  {
                     subscriptions?.map((sub, index) => {
                        return (
                           // TODO: when long press, it display a checkbox 
                           <TouchableOpacity key={`sub-${index}`} onPress={() => showSubscribeRoute(sub)}>
                              <SubscribeRouteContainer
                                 routeInfo={sub}
                              />
                           </TouchableOpacity>
                        )
                     })
                  }
               </ScrollView >
            )
         }
      </>
   );
}

export default SubscribeTab;

const styles = StyleSheet.create({
   tabContent: {
      paddingVertical: 5,
      height: 200,
   },
   centerContent: {
      alignItems: 'center',
   },
   scrollViewContent: {
      justifyContent: 'flex-start',
      flexGrow: 1,
   },
   manageContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
   },
   manageButton: {
      paddingTop: 5,
      marginBottom: 10,
      marginRight: 10,
   },
   loginBtn: {
      marginTop: 20,
   }
});

