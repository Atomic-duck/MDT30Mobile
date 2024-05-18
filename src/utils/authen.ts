import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, NativeModuleError, statusCodes } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

// Function to store user data to AsyncStorage
const storeUserDataToAsyncStorage = async (userData: any) => {
   try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Store user data as JSON string
   } catch (error) {
      console.error('Error storing user data:', error);
   }
};

// Function to retrieve user data from AsyncStorage
const getUserDataFromAsyncStorage = async () => {
   try {
      const userDataJson = await AsyncStorage.getItem('userData'); // Retrieve user data JSON string
      return userDataJson ? JSON.parse(userDataJson) : null; // Parse JSON string to object
   } catch (error) {
      console.error('Error getting user data from AsyncStorage:', error);
      return null;
   }
};

// Implement getCurrentUser function to retrieve user data from AsyncStorage
export async function getCurrentUser(): Promise<any> {
   return await getUserDataFromAsyncStorage();
}

export async function logout() {
   try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('userData'); // Retrieve user data JSON string
   } catch (error) {
      console.log(error)
   }

}

export async function login(): Promise<any> {
   const url = `http://127.0.0.1:8080/users/login`;
   try {
      const userInfo = await loginWithGoogle();
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            googleId: userInfo?.user.id
         })
      });

      let result = await response.json();

      console.log(result)
      if (!response.ok) {
         throw new Error('Đã có lỗi xảy ra :((');
      }

      if (!result.success) {
         throw new Error(result.message);
      }

      await storeUserDataToAsyncStorage(result.data);

      return result.data;
   } catch (error) {
      const typedError = error as NativeModuleError;

      switch (typedError.code) {
         case statusCodes.SIGN_IN_CANCELLED:
            // sign in was cancelled
            Alert.alert('cancelled');
            break;
         case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert('in progress');
            break;
         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // android only
            Alert.alert('play services not available or outdated');
            break;
         default:
            Alert.alert('Something went wrong', typedError.toString())
      }

      return null;
   }
}

export async function register(): Promise<any> {
   const url = `http://127.0.0.1:8080/users/register`;
   try {
      const userInfo = await loginWithGoogle();
      console.log(userInfo)
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            email: userInfo.user.email,
            name: userInfo.user.givenName,
            googleId: userInfo.user.id
         })
      });

      let result = await response.json();

      if (!response.ok) {
         throw new Error('Đã có lỗi xảy ra :((');
      }
      if (!result.success) {
         throw new Error(result.message);
      }

      await storeUserDataToAsyncStorage(result.data);

      return result.data;
   } catch (error) {
      const typedError = error as NativeModuleError;

      switch (typedError.code) {
         case statusCodes.SIGN_IN_CANCELLED:
            // sign in was cancelled
            Alert.alert('cancelled');
            break;
         case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert('in progress');
            break;
         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // android only
            Alert.alert('play services not available or outdated');
            break;
         default:
            Alert.alert('Something went wrong', typedError.toString())
      }

      return null;
   }
}

// Function to handle user login
const loginWithGoogle = async () => {
   await GoogleSignin.hasPlayServices();
   const userInfo = await GoogleSignin.signIn();

   console.log(userInfo)
   return userInfo
};

