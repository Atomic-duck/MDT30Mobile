import { CheckBox } from '@rneui/base';
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BadWeather from '../../images/extreme-weather.png'
import Flood from '../../images/car-accident.png'
import Slipery from '../../images/slippery-road.png'

interface Props {
   visible: boolean,
   onClose: any,
   addRoadStatus: any
}

const TrafficModal: React.FC<Props> = ({ visible, onClose, addRoadStatus }) => {
   const [value, setValue] = useState<string | null>(null);

   const handleClose = () => {
      onClose()
   }

   const handleSubmit = () => {
      addRoadStatus({
         type: 'weather',
         condition: value
      }
      );
      onClose()
   }

   const toggle = (condition: string) => {
      if (condition == value) setValue(null);
      else setValue(condition);
   }

   return (
      <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={handleClose}>
         <TouchableOpacity style={styles.modalContainer} activeOpacity={1} >
            <View style={styles.modalContent}>
               <View style={styles.header}>
                  <Text style={styles.modalText}>Thời tiết</Text>
                  <TouchableOpacity onPress={handleClose}>
                     <Icon name='times' size={24} />
                  </TouchableOpacity>
               </View>
               <View style={styles.itemContainer}>
                  <View style={styles.item}>
                     <Pressable style={[styles.avatar, value == 'Thời tiết xấu' && styles.picked]} onPress={() => toggle('Thời tiết xấu')}>
                        <Image source={BadWeather} height={16} width={16} />
                     </Pressable>
                     <Text style={styles.title}>Thời tiết xấu</Text>
                  </View>
                  <View style={styles.item}>
                     <Pressable style={[styles.avatar, value == 'Ngập lụt' && styles.picked]} onPress={() => setValue('Ngập lụt')}>
                        <Image source={Flood} height={16} width={16} />
                     </Pressable>
                     <Text style={styles.title}>Ngập lụt</Text>
                  </View>
                  <View style={styles.item}>
                     <Pressable style={[styles.avatar, value == 'Trơn trượt' && styles.picked]} onPress={() => setValue('Trơn trượt')}>
                        <Image source={Slipery} height={16} width={16} />
                     </Pressable>
                     <Text style={styles.title}>Trơn trượt</Text>
                  </View>
               </View>
               <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button} onPress={handleClose}>
                     <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                     <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </TouchableOpacity>
      </Modal>
   );
};

const styles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 15,
      borderRadius: 10,
      width: '95%',
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   modalText: {
      fontSize: 20,
      marginBottom: 20,
      color: 'black',
      fontWeight: '500'
   },
   button: {
      backgroundColor: 'rgba(45, 85, 255, 1)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 60,
      width: 120,
      alignItems: 'center'
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
   },
   buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 15,
   },
   boxContainer: {
      padding: 0,
   },
   itemContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: '100%',
      marginLeft: 5,
      marginTop: 10,
   },
   item: {
      width: '30%', // Adjust as needed to fit 3 items per row
      marginBottom: 15,
      alignItems: 'center',
      marginHorizontal: 5
   },
   avatar: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: 'rgba(192,192,192,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
   },
   title: {
      fontWeight: '500',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 8,
   },
   picked: {
      borderWidth: 5,
      borderColor: 'rgba(3, 138, 255, 0.8)',
      borderStyle: 'solid',
   },
});

export default TrafficModal;
