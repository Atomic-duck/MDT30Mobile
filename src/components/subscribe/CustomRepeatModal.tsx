import { CheckBox } from '@rneui/base';
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
   visible: boolean,
   onClose: any,
   onSelectRepeat: any
}

const CustomRepeatModal: React.FC<Props> = ({ visible, onClose, onSelectRepeat }) => {
   const daysOfWeek = [{ name: 'Thứ hai', value: 2 }, { name: 'Thứ ba', value: 3 }, { name: 'Thứ tư', value: 4 }, { name: 'Thứ năm', value: 5 }, { name: 'Thứ sáu', value: 6 }, { name: 'Thứ bảy', value: 7 }, { name: 'Chủ Nhật', value: 8 }];
   const [customRepeat, setCustomRepeat] = useState<number[]>([])

   const toggleRepeatDay = (day: number) => {
      const updatedRepeat = [...customRepeat];

      if (updatedRepeat.includes(day)) {
         // Remove day from repeat
         const index = updatedRepeat.indexOf(day);
         updatedRepeat.splice(index, 1);
      } else {
         // Add day to repeat
         updatedRepeat.push(day);
      }
      setCustomRepeat(updatedRepeat);
   };

   return (
      <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={onClose}>
         <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={onClose}>
            <View style={styles.modalContent}>
               <Text style={styles.modalText}>Chọn các ngày lặp lại</Text>
               {daysOfWeek.map((day, index) => (
                  <View key={index} style={styles.checkboxContainer}>
                     <Text style={styles.modalText}>{day.name}</Text>
                     <CheckBox
                        checked={customRepeat.includes(day.value)}
                        onPress={(e) => toggleRepeatDay(day.value)}
                        containerStyle={styles.boxContainer}
                     />
                  </View>
               ))}
               <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button} onPress={onClose}>
                     <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => {
                     onSelectRepeat(customRepeat)
                     onClose()
                  }}>
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
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
   },
   modalText: {
      fontSize: 18,
      marginBottom: 20,
      color: 'black',
   },
   dayButton: {
      width: '80%',
      paddingVertical: 10,
      marginVertical: 5,
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'blue',
   },
   button: {
      marginTop: 20,
      backgroundColor: 'blue',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
   },
   checkboxContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
   },
   buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 20,
   },
   boxContainer: {
      padding: 0,
   },
});

export default CustomRepeatModal;
