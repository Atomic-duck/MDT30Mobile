import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchRoadCondition(ne_lat: number, ne_long: number, ws_lat: number, ws_long: number, zoomLevel: number) {
   try {
      const url = `https://api.bktraffic.com/api/traffic-status/get-status-v2?NElat=${ne_lat}&NElng=${ne_long}&WSlat=${ws_lat}&WSlng=${ws_long}&zoom=${zoomLevel}&limit=10000`;
      const response = await fetch(url, {
         method: 'GET'
      });

      let result = await response.json();

      if (!response.ok) {
         throw new Error(result.message);
      }

      return result;
   } catch (error) {
      console.error('Error fetch road condition:', error);
      return [];
   }
}

export async function fetchLocationName(coordinates: number[]) {
   try {
      const url = `http://localhost:8080/route/reverse?long=${coordinates[0]}&lat=${coordinates[1]}`;
      const response = await fetch(url, {
         method: 'GET'
      });

      let result = await response.json();

      if (!response.ok) {
         throw new Error(result.message);
      }

      return result.name;
   } catch (error) {
      console.error('Error fetch all road status:', error);
      return [];
   }
}

export async function fetchAllRoadStatus() {
   try {
      const url = 'http://localhost:3333/roadstatus/all';
      const response = await fetch(url, {
         method: 'GET'
      });

      let result = await response.json();
      if (!response.ok) {
         throw new Error(result.message);
      }

      return result;
   } catch (error) {
      console.error('Error fetch all road status:', error);
      return [];
   }
}

export async function uploadRoadStatus(formData: any) {
   try {
      const url = 'http://localhost:3333/roadstatus/upload';
      const response = await fetch(url, {
         method: 'POST',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });

      if (!response.ok) {
         throw new Error('Failed to upload photo and road status');
      }

      return await response.json();
   } catch (error) {
      console.error('Error upload data:', error);
      throw error;
   }

}

export async function getSubscriptions(email: string) {
   let subscriptions = await AsyncStorage.getItem('subscriptions-' + email);
   // subscriptions = null;

   if (!subscriptions) {
      // If subscriptions info doesn't exist in AsyncStorage, fetch it from servers
      let subs = await fetchSubscribeRoutes(email);
      await AsyncStorage.setItem('subscriptions-' + email, JSON.stringify(subs));

      return subs;
   }

   return JSON.parse(subscriptions);
}

export async function saveSubscription(email: string, body: string) {
   const url = `http://127.0.0.1:8080/subscribe`;

   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body
      });

      if (!response.ok) {
         throw new Error('Đã có lỗi xảy ra :((');
      }

      let sub = await response.json()


      await saveSubscriptionToStorage(sub, email);

      return sub._id;
   } catch (error) {
      await AsyncStorage.removeItem('subscriptions-' + email);
      throw (error);
   }

}

export async function updateSubscription(email: string, id: string, body: string) {
   const url = `http://127.0.0.1:8080/subscribe/${id}/update`;

   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body
      });

      let sub = await response.json();
      await updateSubscriptionToStorage(sub, email);

      if (!response.ok) {
         throw new Error('Đã có lỗi xảy ra :((');
      }

   } catch (error) {
      await AsyncStorage.removeItem('subscriptions-' + email);
      throw error;
   }
}

export async function saveSubscriptionToStorage(sub: any, email: string) {
   let subscriptions = await getSubscriptions(email)
   subscriptions.push(sub);

   await AsyncStorage.setItem('subscriptions-' + email, JSON.stringify(subscriptions));
}

export async function updateSubscriptionToStorage(n_sub: any, email: string) {
   let subscriptions = await getSubscriptions(email)
   let n_subscriptions = subscriptions.map((sub) => {
      if (sub._id == n_sub._id) return n_sub;

      return sub;
   })

   await AsyncStorage.setItem('subscriptions-' + email, JSON.stringify(n_subscriptions));
}

const fetchSubscribeRoutes = async (email: string) => {
   const url = `http://127.0.0.1:8080/subscribe?email=${email}`;

   try {
      let response = await fetch(url, {
         method: 'GET'
      });
      let result = await response.json();

      if (!response.ok) {
         throw new Error(result.message);
      }

      return result;
   } catch (error) {
      console.error('Error fetching subscribe route:', error);
      throw error;
   }
}