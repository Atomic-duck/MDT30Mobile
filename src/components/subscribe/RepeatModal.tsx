import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
   visible: boolean,
   selectedRepeat: number[],
   onSelectRepeat: any,
   onCustomRepeat: any,
   onClose: any,
}

const RepeatModal: React.FC<Props> = ({ visible, selectedRepeat, onSelectRepeat, onCustomRepeat, onClose }) => {
   const repeatOptions = [{ name: 'Một lần', value: [0] }, { name: 'Hằng ngày', value: [10] }, { name: 'Thứ hai đến Thứ sáu', value: [26] }];

   return (
      <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={onClose}>
         <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={onClose}>
            <View style={styles.modalContent}>
               {repeatOptions.map((option, index) => (
                  <TouchableOpacity
                     key={index}
                     onPress={() => {
                        onSelectRepeat(option.value);
                        onClose();
                     }}
                  >
                     <Text style={selectedRepeat[0] === option.value[0] ? styles.selectedOption : styles.modalText}>{option.name}</Text>
                  </TouchableOpacity>
               ))}
               <TouchableOpacity onPress={onCustomRepeat}>
                  <Text style={selectedRepeat[0] != 0 && selectedRepeat[0] != 10 && selectedRepeat[0] != 26 ? styles.selectedOption : styles.modalText}>Tùy chỉnh</Text>
               </TouchableOpacity>
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
      marginBottom: 10,
      color: 'black',
   },
   selectedOption: {
      fontSize: 18,
      color: 'white',
      backgroundColor: 'blue', // Customize as needed
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginBottom: 10,
   },
});

export default RepeatModal;
