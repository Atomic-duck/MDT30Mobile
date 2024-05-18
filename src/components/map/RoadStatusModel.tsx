import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator, Pressable, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { geTimeDiff } from '../../utils/notify';


interface Props {
   road: any;
   onClose: any;
   visible: boolean,
}

const RoadStatusModel: React.FC<Props> = ({ road, onClose, visible }) => {
   const [loading, setLoading] = useState(true);
   const [conditions, setConditions] = useState<string>();
   useEffect(() => {
      if (road) {
         setConditions(road?.conditions?.reduce((name, e, idx) => name + e.condition + (idx == road.conditions.length - 1 ? '' : ', '), ""))
      }
      console.log('change')
   }, [road])

   return (
      <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={onClose}>
         <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={onClose}>
            <View style={styles.cameraDetailView}>
               <View style={styles.cameraDetailHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Text style={{ fontSize: 17, fontWeight: '500', color: 'orange' }}>{conditions}</Text>
                     <Text style={{ fontSize: 14, color: 'white' }}>{' - ' + geTimeDiff(new Date(road?.timestamp))}</Text>
                  </View>
               </View>
               <View style={styles.cameraDetailContent}>
                  {
                     loading && (
                        <ActivityIndicator
                           size="large"
                           color="black"
                        />
                     )
                  }
                  <Image
                     source={{ uri: road?.imgUrl }}
                     style={[styles.cameraImage, loading ? styles.hidden : {}]}
                     resizeMode="contain"
                     onLoad={(e) => {
                        setLoading(false)
                     }}
                     onError={(err) => {
                        console.log(err)
                     }}
                  />
               </View>
               <View style={styles.btnContainer}>
                  <Pressable style={styles.btn}>
                     <Icon name='thumbs-down' size={24} color={'white'} solid></Icon>
                     <Text style={styles.btnText}>
                        0
                     </Text>
                  </Pressable>
                  <Pressable style={styles.btn}>
                     <Icon name='thumbs-up' size={24} color={'white'} solid></Icon>
                     <Text style={styles.btnText}>
                        1
                     </Text>
                  </Pressable>
               </View>

            </View>
         </TouchableOpacity>
      </Modal>
   );
}

export default RoadStatusModel;

const styles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   // Style for camera detail view
   cameraDetailView: {
      top: 0,
      backgroundColor: 'rgba(26,26,26, 0.9)',
      paddingHorizontal: 2,
      width: "100%",
      height: '60%'
   },
   cameraDetailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: "100%",
      padding: 5
   },
   // Style for close button in camera detail view
   closeButton: {
      color: 'blue',
   },
   cameraDetailContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: "100%",
      marginTop: 10,
      paddingBottom: 10,
   },
   cameraImage: {
      width: '100%',
      height: '100%',
   },
   hidden: {
      display: 'none'
   },
   btnContainer: {
      position: 'relative',
      top: 20,
      width: '100%',
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10
   },
   btn: {
      width: 80,
      borderRadius: 25,
      padding: 10,
      paddingHorizontal: 15,
      backgroundColor: 'rgba(3, 138, 255, 1)',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center'
   },
   btnText: {
      color: 'white',
      fontSize: 16
   }
});
