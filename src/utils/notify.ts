import {
   GoogleSignin
} from '@react-native-google-signin/google-signin';
import { getSubscriptions } from './fetchData';

export const geTimeDiff = (time: Date) => {
   const currentTime = new Date();
   const timeDifference = currentTime.getTime() - time.getTime();

   if (timeDifference < 60000) { // Less than a minute
      return 'Mới đây';
   } else if (timeDifference < 3600000) { // Less than an hour
      const minutesAgo = Math.floor(timeDifference / 60000);
      return `${minutesAgo} phút trước`;
   } else if (timeDifference < 86400000) { // Less than a day
      const hoursAgo = Math.floor(timeDifference / 3600000);
      return `${hoursAgo} giờ trước`;
   } else {
      return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}, ${time.getHours()}:${time.getMinutes()}`;
   }
}

export const checkCoordinates = (coordinates: [number, number][], coord: [number, number]) => {
   // Iterate through each pair of coordinates
   for (let i = 0; i < coordinates.length - 1; i++) {
      const [start, end] = [coordinates[i], coordinates[i + 1]];

      // Check if the given coordinate is within the bounding box of the road segment
      if (
         (coord[0] >= Math.min(start[0], end[0]) && coord[0] <= Math.max(start[0], end[0])) &&
         (coord[1] >= Math.min(start[1], end[1]) && coord[1] <= Math.max(start[1], end[1]))
      ) {
         // Calculate the slope of the road segment
         const slope = (end[1] - start[1]) / (end[0] - start[0]);

         // Calculate the expected y-coordinate on the road segment for the given x-coordinate
         const expectedY = start[1] + slope * (coord[0] - start[0]);
         // console.log(expectedY, coord[1])

         // Check if the actual y-coordinate matches the expected y-coordinate (with some tolerance)
         if (Math.abs(coord[1] - expectedY) < 0.001) {
            return true; // Coordinate is on the road segment
         }
      }
   }
   return false; // Coordinate is not on any road segment
};

export const getEffectedRoads = async (coord, happenedTime) => {
   let roads = [];
   try {
      let userInfo = await GoogleSignin.signInSilently();
      let subscriptions = await getSubscriptions(userInfo.user.email);

      for (let i = 0; i < subscriptions.length; i++) {
         if (subscriptions[i].isOn && checkNotifyTime(subscriptions[i].start, subscriptions[i].end, subscriptions[i]['repeat'], subscriptions[i].once, happenedTime) && checkCoordinates(subscriptions[i].coordinates, coord)) {
            roads.push({
               name: subscriptions[i].name,
               id: subscriptions[i]._id
            })
         }
      }

      return roads;
   } catch (error) {
      console.error('is Effected', error);
      throw error;
   }
}

const checkNotifyTime = (start, end, repeat, once, notifyTime) => {
   // Parse start and end time strings to get hours and minutes
   const [startHour, startMinute] = start.split(':').map(Number);
   const [endHour, endMinute] = end.split(':').map(Number);

   // Convert notifyTime to Date object to compare with start and end times
   const notifyDate = new Date(notifyTime);
   const notifyHour = notifyDate.getHours();
   const notifyMinute = notifyDate.getMinutes();

   // Check if repeat is [0], meaning it only checks if notifyTime is 'once' day
   if (checkOnce(repeat, once)) {
      const onceDay = new Date(once);
      const onceDayStartTime = new Date(onceDay.getFullYear(), onceDay.getMonth(), onceDay.getDate(), startHour, startMinute);
      const onceDayEndTime = new Date(onceDay.getFullYear(), onceDay.getMonth(), onceDay.getDate(), endHour, endMinute);
      return onceDayStartTime <= notifyDate && notifyDate <= onceDayEndTime;
   }

   // Check if repeat includes the day of the week of notifyTime
   let notifyDayOfWeek = notifyDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
   if (notifyDayOfWeek == 0) notifyDayOfWeek = 8;
   else notifyDayOfWeek += 1;

   if (repeat[0] === 10 || (repeat[0] == 26 && notifyDayOfWeek >= 2 && notifyDayOfWeek <= 6) || repeat.includes(notifyDayOfWeek)) {
      // Check if notifyTime is within the range of start and end times
      const notifyTimeInMinutes = notifyHour * 60 + notifyMinute;
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      return startTimeInMinutes <= notifyTimeInMinutes && notifyTimeInMinutes <= endTimeInMinutes;
   }

   return false; // Notify time doesn't match repeat criteria
}

const checkOnce = (repeat, once) => {
   if (repeat[0] != 0) return false;
   let onceDay = new Date(once);
   let nowDay = new Date();

   return onceDay.getFullYear() == nowDay.getFullYear() && onceDay.getMonth() == nowDay.getMonth() && onceDay.getDate() == nowDay.getDate();
}