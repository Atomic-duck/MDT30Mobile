import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/BottomTabNavigator';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';
import notifee from '@notifee/react-native';
import MapStackNavigator from './src/MapStackNavigator';

// Deep links
const deepLinksConf = {
  initialRouteName: 'Map',
  screens: {
    Map: 'map',
  }
};

const linking: LinkingOptions = {
  prefixes: ['myapp://'],
  config: deepLinksConf,
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }

    // Check if there is an initial firebase notification
    const notification = await notifee.getInitialNotification();

    console.log(notification?.notification.data);


    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    return notification?.notification.data?.link;
  },
  // subscribe(listener: (url: string) => void) {
  //   const onReceiveURL = ({url}: {url: string}) => listener(url);

  //   // Listen to incoming links from deep linking
  //   const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

  //   //onNotificationOpenedApp: When the application is running, but in the background.
  //   const unsubscribe = notifee.onBackgroundEvent(remoteMessage => {
  //     const url = buildDeepLinkFromNotificationData(remoteMessage.data)
  //     if (typeof url === 'string') {
  //       listener(url)
  //     }
  //   });

  //   return () => {
  //     linkingSubscription.remove();
  //     unsubscribe();
  //   };
  // },
}

export default function App() {
  useEffect(() => {
    const onAppBootstrap = async () => {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const token = await messaging().getToken();

      console.log(token)
    }

    onAppBootstrap();
  }, [])
  return (
    <NavigationContainer linking={linking}>
      <MapStackNavigator />
    </NavigationContainer>
  );
}
