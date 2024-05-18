import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Image, ActivityIndicator, Modal } from 'react-native';

interface CameraViewProps {
   camInfo: any;
   setShowCameraId: any;
   visible: any
}

const CameraView: React.FC<CameraViewProps> = ({ camInfo, setShowCameraId, visible }) => {
   const [loading, setLoading] = useState(true);

   const onClose = () => {
      setShowCameraId(null);
   }
   return (
      <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={onClose}>
         <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={onClose}>
            <View style={styles.cameraDetailView}>
               <View style={styles.cameraDetailHeader}>
                  <Text style={{ fontSize: 16, color: 'black' }}>{camInfo?.cameraName}</Text>
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
                     source={{ uri: `http://giaothong.hochiminhcity.gov.vn/render/ImageHandler.ashx?id=${camInfo?.camId}` }}
                     style={[styles.cameraImage, loading ? styles.hidden : {}]}
                     resizeMode="contain"
                     onLoad={(e) => {
                        setLoading(false)
                     }}
                  />
               </View>
            </View>
         </TouchableOpacity>
      </Modal>
   );
}

export default CameraView;

const styles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   cameraDetailView: {
      marginTop: '50%',
      backgroundColor: 'white',
      paddingHorizontal: 5,
      width: '100%',
      height: 280,
      borderRadius: 5,
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
      paddingBottom: 10,
   },
   cameraImage: {
      width: '100%',
      height: '100%',
   },
   hidden: {
      display: 'none'
   },
});
