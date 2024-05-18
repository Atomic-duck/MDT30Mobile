import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
   visible: boolean,
   onClose: any
}

const LoginModal: React.FC<Props> = ({ visible, onClose }) => {
   const handleBack = () => {
      onClose();
   };

   return (
      <Modal visible={visible} animationType='fade' transparent={true}>
         <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
               <Text style={styles.modalText}>Bạn cần đăng nhập để sử dụng tính năng này</Text>
               <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleBack}>
                     <Text style={styles.backButton}>Quay lại</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
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
      width: '96%',
   },
   modalText: {
      fontSize: 18,
      marginBottom: 20,
      color: 'black',
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
   },
   backButton: {
      fontSize: 16,
      color: 'red',
   },
});

export default LoginModal;
