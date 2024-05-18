import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground } from 'react-native';
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MyCalender from './MyCalender';


const CalenderModal = ({ setBeginDate, setEndDate }, ref) => {
   const inputRef = useRef();
   const [selecting, setSeleting] = useState(false);
   const openMe = () => {
      console.log('MODAL: openMe called from parent component via ref');
      setSeleting(true);
   };

   // useImperativeHandle(ref, () => { publicHandler: openMe }, [openMe]);
   useImperativeHandle(ref, () => ({
      visible: () => {
         inputRef.current.visible = true;
      }
   }));

   return <Modal
      animationType='fade'
      transparent={true}
      visible={false}
      onRequestClose={() => {
         setSeleting(!selecting);
      }}>
      <View style={styles.centeredView}>
         <View style={styles.triangle}></View>
         <View style={styles.modalView}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: "98%", padding: 5, borderBottomWidth: 0.5 }}>
               <Text>Chuỗi ngày</Text>
               <Pressable
                  onPress={() => setSeleting(!selecting)}>
                  <Icon name="times" size={16} />
               </Pressable>
            </View>
            <MyCalender setBeginDate={setBeginDate} setEndDate={setEndDate} closeModel={() => setSeleting(!selecting)} />
         </View>
      </View>
   </Modal>
}


const styles = StyleSheet.create({
   triangle: {
      alignSelf: 'flex-end',
      marginEnd: 22,
      marginTop: 21,
      marginBottom: -2,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderBottomWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'white',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 15,
   },
   centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
   },
   modalView: {
      width: '95%',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
      paddingTop: 3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
   button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
   },
   buttonOpen: {
      backgroundColor: '#F194FF',
   },
   buttonClose: {
      backgroundColor: '#2196F3',
   },
   textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
   },
   modalText: {
      marginBottom: 15,
      textAlign: 'center',
   },
});

export default CalenderModal;