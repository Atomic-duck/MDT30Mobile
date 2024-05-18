/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import {
   GoogleSignin
} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getEffectedRoads } from './src/utils/notify';

GoogleSignin.configure();


async function onMessageReceived(message) {
   try {
      const data = JSON.parse(message.data.notifee);
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
         id: 'default',
         name: 'Default Channel',
      });
      await notifee.requestPermission();

      const roads = await getEffectedRoads(data.coordinates, data.timestamp);

      if (message.from === "/topics/road-status" && roads.length > 0) {
         console.log('show notification')
         let roadName = roads.reduce((name, road, idx) => name + road.name + (idx == roads.length - 1 ? '' : ', '), "");
         let roadCondition = data.conditions.reduce((name, e, idx) => name + e.condition + (idx == data.conditions.length - 1 ? '' : ', '), "")
         await notifee.displayNotification({
            title: 'Tình trạng tuyến đường',
            body: `Tuyến đường ${roadName} có đoạn bị ${roadCondition}`,
            android: {
               channelId,
               // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
               // pressAction is needed if you want the notification to open the app when pressed
               pressAction: {
                  id: 'default',
               },
            },
            data: {
               link: message.data.link
            }
         })
      }
   } catch (error) {
      console.log(error)
   }
}


messaging().onMessage(async (remoteMessage) => {
   console.log(remoteMessage);
   await onMessageReceived(remoteMessage)
})

messaging().setBackgroundMessageHandler(async remoteMessage => {
   console.log('Background message handled:', remoteMessage);
   await onMessageReceived(remoteMessage)
});

messaging()
   .subscribeToTopic('road-status')
   .then(() => console.log('Subscribed to road-status topic!'))
   .catch((err) => console.log('Cannot Subscribed to road-status topic', err));

notifee.onBackgroundEvent(async ({ type, detail }) => {
   const { notification, pressAction } = detail;

   // Check if the user pressed the "Mark as read" action

   if (type === EventType.PRESS) {
      // Update external API

      // eventEmitter.emit('notificationReceived', notification);

      // Remove the notification
      await notifee.cancelNotification(notification.id);
   }
});

notifee.onForegroundEvent(async ({ type, detail }) => {
   const { notification, pressAction } = detail;

   if (type === EventType.PRESS) {
      //   eventEmitter.emit('notificationReceived', notification);

      await notifee.cancelNotification(notification.id);
   }
});

AppRegistry.registerComponent(appName, () => App);
