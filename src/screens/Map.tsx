import React, { useRef, useState, useEffect } from 'react';
import { View, Image, SafeAreaView, StyleSheet, PermissionsAndroid, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Feature } from '@turf/helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AnnotationWithImage from "../components/map/AnnotationWithImage"
import WayPointsHeader from "../components/map/WayPointsHeader"
import InfoFooter from '../components/map/InfoFooter';
import CameraView from '../components/map/CameraView';
import Waypoint from '../components/map/interface/Waypoint';
import Geolocation from 'react-native-geolocation-service';
import RoadStatusModel from '../components/map/RoadStatusModel';
import { fetchAllRoadStatus, fetchLocationName, fetchRoadCondition } from '../utils/fetchData';

import cameraImg from '../images/camera_green.png'
import { getCurrentUser } from '../utils/authen';
import { color } from '@rneui/base';

// MapboxGL.setConnected(true);
MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken("pk.eyJ1IjoiYXRvbWljZHVjayIsImEiOiJjbG53b2t4b24wOHBiMmxwY2h2anJrNWkxIn0.FXiRCSKZGDHWSWZiIs_ZUw");
// Geolocation.setRNConfiguration({
//    skipPermissionRequests: false,
//    authorizationLevel: 'auto',
// });

interface MapProps {
   navigation: any; // You should replace 'any' with the proper navigation type
   route: any; // Replace 'any' with the proper route type
}

const routeProfiles = [
   { id: 'walking', label: 'Walking', icon: 'walking' },
   { id: 'cycling', label: 'Cylcing', icon: 'bicycle' },
   { id: 'driving', label: 'Driving', icon: 'car' },
];

const getAnnotation = (legs: any[]) => {
   return legs.reduce((acum, leg) => {
      return {
         speeds: [...acum.speeds, ...leg.annotation.speed],
         durations: [...acum.durations, ...leg.annotation.duration]
      }
   }, { speeds: [], durations: [] })
}

// Function to get permission for location
const requestLocationPermission = async () => {
   try {
      const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
         {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
         },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
         console.log('You can use Geolocation');
         return true;
      } else {
         console.log('You cannot use Geolocation');
         return false;
      }
   } catch (err) {
      return false;
   }
};

const Map: React.FC<MapProps> = ({ navigation, route }) => {
   const mapRef = useRef(null); // Reference to the MapView component
   const camRef = useRef<MapboxGL.Camera>(null);
   const [userInfo, setUserInfo] = useState<any>();
   const [showRouting, setShowRouting] = useState(false);
   const [showSetting, setShowSetting] = useState(true);
   const [location, setLocation] = useState<[number, number] | null>(null); // State to store current coordinates
   const [waypoints, setWaypoints] = useState<(Waypoint | null)[]>([null, null]); // Store waypoints
   const [routeDirections, setRouteDirections] = useState<any | null>(null); // State to store route directions
   const [selectedRouteProfile, setselectedRouteProfile] = useState<string>('walking'); // State to store selected route profile
   const [loading, setLoading] = useState(false); // State to manage loading indicator
   const [showWeatherIcons, setShowWeatherIcons] = useState(false); // State to manage weather icon display
   const [weatherList, setWeatherList] = useState<any[]>([]);
   const [showCameraIcons, setShowCameraIcons] = useState(false); // State to manage camera icon display
   const [cameraList, setCameraList] = useState<any[]>([]);
   const [showCameraId, setShowCameraId] = useState<{} | null>(null); // State to manage camera detail display
   const [roadStatusList, setRoadStatusList] = useState<any[]>([]);
   const [roadStatus, setRoadStatus] = useState<{} | null>(null); // State to manage camera detail display
   const [subscribe, setSubscribe] = useState<any>();
   const [roadConditions, setRoadConditions] = useState<any[]>([]);
   let delay: NodeJS.Timeout | null = null;

   useEffect(() => {
      getLocation();
      (async () => {
         setRoadStatusList(await fetchAllRoadStatus());
         setUserInfo(await getCurrentUser());
      })()
   }, [])

   useEffect(() => {
      if (route.params?.userInfo) {
         if (userInfo == null || route.params?.userInfo.googleId != userInfo.googleId) {
            setUserInfo(route.params?.userInfo);
         }
      }
      else if (userInfo) {
         setUserInfo(null);
      }
   }, [route.params])

   useEffect(() => {
      moveToUserLocation();
   }, [location])

   useEffect(() => {
      if (waypoints.length >= 2 && !haveNullPoint()) {
         fetchRoute(waypoints, subscribe?.coordinates ? subscribe?.coordinates : []);
         zoomToWaypoints(waypoints);
      }
      if (waypoints.length <= 2 && haveNullPoint()) {
         setCameraList([]);
         setWeatherList([]);
         setRouteDirections(null);
         setSubscribe(null);
      }

   }, [waypoints])

   useEffect(() => {
      if (subscribe) {
         setWaypoints(subscribe.waypoints)
      }
   }, [subscribe])

   useEffect(() => {
      if (route.params?.subInfo) {
         setSubscribe({ ...subscribe, ...route.params?.subInfo })
      }
   }, [route.params?.subInfo])

   useEffect(() => {
      if (route.params?.deletedSub && subscribe && route.params?.deletedSub.includes(subscribe._id)) {
         setWaypoints([null, null]);
      }
   }, [route.params?.deletedSub])

   useEffect(() => {
      if (routeDirections) {
         fetchCamera();
      }
   }, [routeDirections])

   const getLocation = () => {
      const result = requestLocationPermission();
      result.then(res => {
         if (res) {
            Geolocation.getCurrentPosition(
               position => {
                  console.log("Currrent location", position);
                  setLocation([position.coords.longitude, position.coords.latitude]);
               },
               error => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                  setLocation(null);
               },
               { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
         }
      });
   };

   const moveToUserLocation = () => {
      camRef.current?.setCamera({
         centerCoordinate: location ? location : [106.8052683, 10.8785317],
         zoomLevel: 14
      })
   }

   const focusCameraTo = (coor: number[]) => {
      camRef.current?.setCamera({
         centerCoordinate: coor,
         zoomLevel: 16
      })
   }

   const fetchCamera = async () => {
      const url = `http://127.0.0.1:8080/route/cameras`;
      const coordinates = routeDirections.coordinates;

      try {
         let response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(coordinates)
         });
         let cameras = await response.json();

         setCameraList(cameras);
      } catch (error) {
         console.error('Error fetching cameras:', error);
      }
   }

   const fetchRoute = async (waypoints: (Waypoint | null)[], coordinates: [number, number][]) => {
      setLoading(true); // Set loading state
      const url = `http://127.0.0.1:8080/route`;

      try {
         let response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ waypoints: waypoints.filter(waypoint => waypoint !== null).map(waypoint => waypoint?.coordinates) })
         });
         let json = await response.json();
         let l = coordinates.length;
         let idx = 0;

         for (let i = 0; i < json.routes.length; i++) {
            if (coordinates.length != json.routes[i].length) continue;
            let b1 = coordinates[Math.floor(l / 3)][0] == json.routes[i][Math.floor(l / 3)][0] && coordinates[Math.floor(l / 3)][1] == json.routes[i][Math.floor(l / 3)][1];
            let b2 = coordinates[Math.floor(l / 2)][0] == json.routes[i][Math.floor(l / 2)][0] && coordinates[Math.floor(l / 2)][1] == json.routes[i][Math.floor(l / 2)][1];
            let b3 = coordinates[Math.floor(2 * l / 3)][0] == json.routes[i][Math.floor(2 * l / 3)][0] && coordinates[Math.floor(2 * l / 3)][1] == json.routes[i][Math.floor(2 * l / 3)][1];

            if (b1 && b2 && b3) {
               idx = i;
               break;
            }
         }

         const routeCoordinates = json.routes[idx].geometry.coordinates;

         if (routeCoordinates.length) {
            const newRouteDirections = {
               coordinates: routeCoordinates,
               distance: json.routes[idx].distance,
               anotation: getAnnotation(json.routes[idx].legs)
            }

            setRouteDirections(newRouteDirections); // Set route directions
         }
         setLoading(false); // Clear loading state
      } catch (error) {
         setLoading(false); // Clear loading state
         console.error('Error fetching route:', error);
      }
   }

   const makeRouterFeature = (coordinates: [number, number][]): any => {
      return {
         type: 'FeatureCollection',
         features: [{
            type: 'Feature',
            properties: {},
            geometry: {
               type: 'LineString',
               coordinates: coordinates,
            },
         }],
      };
   }

   const haveNullPoint = (): boolean => {
      return waypoints.some(waypoint => waypoint === null);
   }

   // Function to handle map press event
   const handleMapPress = async (feature: Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {

      const featurePoint = feature as Feature<GeoJSON.Point>;
      if (!showRouting) return;

      let i = waypoints.length - 1;
      while (i >= 0 && waypoints[i] == null) {
         i--;
      }

      let addedWaypoint = {
         coordinates: featurePoint.geometry.coordinates,
         name: await fetchLocationName(featurePoint.geometry.coordinates),
      }

      if (i < waypoints.length - 1) {
         let newWaypoints = [...waypoints.slice(0, i + 1), addedWaypoint];
         setWaypoints(newWaypoints.length < 2 ? [...newWaypoints, null] : newWaypoints);
      }
   }

   const handleDragEnd = async (event: any) => {
      const { id, geometry } = event;

      // Update the coordinates of the dragged point
      const updatedWaypoints = await Promise.all(waypoints.map(async (waypoint, index) => {
         if (`waypoint-${index}` === id) {
            return {
               coordinates: geometry.coordinates,
               name: await fetchLocationName(geometry.coordinates),
            };
         }
         return waypoint;
      }));

      setWaypoints(updatedWaypoints);
   }

   const handleOnPressCamera = (camId: string, cameraName: string) => {
      setShowCameraId({
         camId: camId,
         cameraName: cameraName
      }); // Show camera detail view
   };

   const onSearchLocation = (name: string, index: number, allowCurrentLocation: boolean) => {
      navigation.navigate('LocationSearch', {
         name,
         index,
         current: location,
         allowCurrentLocation
      });
   };

   const navigateToSubscribeScreen = () => {
      if (subscribe) {
         navigation.navigate('SubscribeRouteScreen', {
            subscribe,
            parent: 'Map'
         });
      }
      else {
         navigation.navigate('SubscribeRouteScreen', {
            coordinates: routeDirections.coordinates,
            distance: routeDirections.distance,
            waypoints,
            parent: 'Map'
         });
      }

   }

   const navigateReportScreen = () => {
      navigation.navigate('ReportScreen', {
         location
      });
   }

   // Function to zoom the camera to capture all waypoints
   const zoomToWaypoints = (waypoints: (Waypoint | null)[]) => {
      const coordinates = waypoints
         .filter(waypoint => waypoint !== null)
         .map(waypoint => waypoint!.coordinates);

      if (coordinates.length === 0) return; // No waypoints

      const bbox = coordinates.reduce((acc, coord) => {
         return [
            [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
            [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]
         ];
      }, [[Infinity, Infinity], [-Infinity, -Infinity]]);

      camRef.current?.fitBounds(bbox[0], bbox[1], 130, 1000);
   }

   const handleOnPressRoadStatus = (road: any) => {
      setShowRouting(false);
      setShowSetting(true);
      setRoadStatus(road);
   }

   const onCloseRoadView = () => {
      setShowSetting(true);
      setRoadStatus(null);
   }

   const navigateToSettingScreen = () => {
      navigation.navigate('SettingScreen', {

      });
   }

   const hanldeShowRouting = () => {
      setShowRouting(!showRouting);
      setShowSetting(!showSetting);
   }

   // const onCameraChange = (state) => {
   //    if (delay != null) {
   //       clearInterval(delay);
   //    }

   //    let delayFetch = setTimeout(async () => {
   //       let result = await fetchRoadCondition(state.properties.bounds.ne[1], state.properties.bounds.ne[0], state.properties.bounds.sw[1], state.properties.bounds.sw[0], state.properties.zoom)
   //       const newRoadConditions: any[] = [];
   //       const traffic = result.data.sort((segment_1, segment_2) => {
   //          return segment_1._id - segment_2._id;
   //       })

   //       let continous = [];
   //       traffic.forEach((segment, idx) => {
   //          // console.log(segment.polyline.coordinates)
   //          if (idx > 0 && traffic[idx]._id - traffic[idx - 1]._id > 1) {
   //             newRoadConditions.push(continous);
   //             continous = [segment.polyline.coordinates[0], segment.polyline.coordinates[1]];
   //          }
   //          else {
   //             continous.push(segment.polyline.coordinates[0], segment.polyline.coordinates[1]);
   //          }

   //          if (idx == traffic.length - 1) {
   //             newRoadConditions.push(continous);
   //          }
   //       })

   //       console.log(newRoadConditions);
   //       console.log(newRoadConditions.length);

   //       setRoadConditions(newRoadConditions);
   //    }, 200);

   //    delay = delayFetch;
   // }

   // const renderTrafficConditions = () => {
   //    return roadConditions?.map((coordinates, idx) => {
   //       if (idx > 0) return
   //       return (
   //          <MapboxGL.ShapeSource id={`road-${idx}`} shape={makeRouterFeature(coordinates)} >
   //             <MapboxGL.LineLayer
   //                id={`roadLine-${idx}`}
   //                style={{
   //                   lineColor: 'red',
   //                   lineWidth: 4,
   //                }}

   //             />
   //          </MapboxGL.ShapeSource>
   //       )
   //    })
   // }

   return (
      <SafeAreaView style={styles.container}>
         {
            showRouting && (
               < WayPointsHeader routeName={subscribe ? subscribe.name : null} location={location} route={route} waypoints={waypoints} setWaypoints={setWaypoints} onSearchLocation={onSearchLocation} />
            )
         }
         {
            showSetting && (
               <View style={styles.settingPanel}>
                  <TouchableOpacity onPress={navigateToSettingScreen}>
                     <Icon name="bars" size={30} />
                  </TouchableOpacity>
               </View>
            )
         }
         <MapboxGL.MapView
            style={styles.map}
            zoomEnabled
            // onCameraChanged={onCameraChange}
            rotateEnabled={false}
            onPress={handleMapPress} // Attach onPress event handler
            ref={mapRef} // Set reference to MapView component
            pitchEnabled={false}
            scaleBarEnabled={false}
         >
            <MapboxGL.Camera
               ref={camRef}
            />
            {routeDirections && (
               <MapboxGL.ShapeSource id="route" shape={makeRouterFeature(routeDirections.coordinates)}>
                  <MapboxGL.LineLayer
                     id="routeLine"
                     style={{
                        lineColor: 'blue',
                        lineWidth: 4,
                     }}
                  />
               </MapboxGL.ShapeSource>
            )}

            {/* TODO: change the way render traffic conditions. current is too laf */}
            {/* {
               renderTrafficConditions()
            } */}

            {
               showWeatherIcons && (
                  weatherList?.map((weatherInfo, index) => (
                     <MapboxGL.MarkerView
                        key={`weather-${index}`}
                        coordinate={[weatherInfo.lon, weatherInfo.lat]}
                        anchor={{ x: 0.5, y: 1 }}
                     >
                        <View style={styles.weatherMapContainer}>
                           <Image
                              source={{
                                 uri: `http://openweathermap.org/img/wn/${weatherInfo.data[0].weather[0].icon}@2x.png`,
                              }}
                              style={styles.weatherIcon}
                              resizeMode={"contain"} // cover or contain its upto you view look
                           />
                        </View>
                     </MapboxGL.MarkerView>
                  ))
               )
            }
            {
               showCameraIcons && (
                  cameraList?.map(((camera, index) => {
                     // console.log(camera.display_name);
                     return (
                        <MapboxGL.MarkerView
                           key={`camera-${index}`}
                           coordinate={[camera.lon, camera.lat]}
                           anchor={{ x: 0.5, y: 0.5 }}
                        >
                           <TouchableOpacity onPress={() => handleOnPressCamera(camera.camId, camera.display_name)}>
                              <Image
                                 source={cameraImg}
                                 resizeMode={"contain"} // cover or contain its upto you view look
                              />
                           </TouchableOpacity>
                        </MapboxGL.MarkerView>
                     )
                  }))
               )
            }
            {
               true && (
                  roadStatusList?.map(((road, index) => {
                     return (
                        <MapboxGL.MarkerView
                           key={`road-${index}`}
                           coordinate={road.coordinates}
                        >
                           <TouchableOpacity onPress={() => handleOnPressRoadStatus(road)}>
                              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'orange', borderStyle: 'solid', borderWidth: 2, borderColor: 'white' }}>
                              </View>
                           </TouchableOpacity>
                        </MapboxGL.MarkerView>
                     )
                  }))
               )
            }
            {
               waypoints.map((waypoint, index) => {
                  if (waypoint == null) return null;
                  const title = `Lon: ${waypoint.coordinates[0]} Lat: ${waypoint.coordinates[1]}`;
                  const id = `waypoint-${index}`;
                  if (waypoint.coordinates[0] == location[0] && waypoint.coordinates[1] == location[1]) return null;

                  return (
                     <AnnotationWithImage
                        key={id}
                        id={id}
                        coordinate={waypoint.coordinates}
                        title={title}
                        onDragEnd={handleDragEnd}
                     />
                  )
               })
            }
            <MapboxGL.UserLocation minDisplacement={14} />
         </MapboxGL.MapView>

         <View style={styles.panelContainer}>
            <TouchableOpacity onPress={hanldeShowRouting}>
               <Icon name="route" size={30} color={showRouting ? 'rgba(13, 180, 185, 0.7)' : undefined} />
            </TouchableOpacity>
            {
               routeDirections && (
                  <TouchableOpacity onPress={navigateToSubscribeScreen}>
                     <Icon name="bell" size={30} />
                  </TouchableOpacity>
               )
            }
            {
               !routeDirections && (
                  <TouchableOpacity onPress={navigateReportScreen}>
                     <Icon name="exclamation-triangle" size={30} />
                  </TouchableOpacity>
               )
            }
            <TouchableOpacity onPress={moveToUserLocation}>
               <Icon name="crosshairs" size={30} />
            </TouchableOpacity>
         </View>

         <InfoFooter focusCameraTo={focusCameraTo} roadStatusList={roadStatusList} userInfo={userInfo} routeDirections={routeDirections} showWeatherIcons={showWeatherIcons} setShowWeatherIcons={setShowWeatherIcons} weatherList={weatherList} setWeatherList={setWeatherList} showCameraIcons={showCameraIcons} setShowCameraIcons={setShowCameraIcons} setSubscribe={setSubscribe} navigation={navigation} route={route} />

         <CameraView camInfo={showCameraId} setShowCameraId={setShowCameraId} visible={showCameraId != null} />

         <RoadStatusModel road={roadStatus} onClose={onCloseRoadView} visible={roadStatus != null} />

         {loading ? (
            <ActivityIndicator
               size="large"
               color="white"
               style={styles.loadingIndicator}
            />
         ) : null
         }
      </SafeAreaView>
   );
}

export default Map;

const styles = StyleSheet.create({
   container: {
      height: "100%",
      width: "100%",
   },
   map: {
      flex: 2,
   },
   loadingIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 2,
   },
   weatherMapContainer: {
      flexDirection: "column",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center"
   },
   weatherIcon: {
      width: 60,
      height: 60,
   },
   iconText: {
      marginTop: -15,
      fontSize: 16
   },
   panelContainer: {
      position: 'absolute',
      top: 300,
      right: 5,
      flexDirection: 'column',
      gap: 15,
      paddingHorizontal: 5,
      paddingVertical: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 10
   },
   settingPanel: {
      position: 'absolute',
      top: 15,
      left: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: 5,
      zIndex: 20,
   }
});
